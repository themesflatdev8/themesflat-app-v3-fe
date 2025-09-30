'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import {
  Page,
  Card,
  Text,
  Button,
  Spinner,
  Modal,
  Badge,
  Frame,
  Toast,
  Select,
  TextField,
} from '@shopify/polaris';
import { Container } from '@/components/core';
import axios from '@/utils/axios';
import { useAuthContext } from '@/features/auth/contexts';
import Pusher from 'pusher-js';

interface Discount {
  id: number;
  shopify_discount_id?: string;
  title?: string;
  summary?: string;
  type?: string;
  status?: number | string;
  codes?: string;
  starts_at?: string | null;
  ends_at?: string | null;
}

// Helpers
const getDiscountId = (gid?: string) => {
  if (!gid) return '';
  const parts = gid.split('/');
  return parts[parts.length - 1] || gid;
};

const parseCode = (codes?: string) => {
  if (!codes) return '-';
  try {
    const parsed = JSON.parse(codes);
    if (Array.isArray(parsed)) return parsed.join(', ');
    return String(parsed);
  } catch {
    return String(codes);
  }
};

const renderStatusBadge = (status?: number | string) => {
  if (status === 1 || status === '1') return <Badge tone="success">Active</Badge>;
  if (status === 2 || status === '2') return <Badge tone="critical">Expired</Badge>;
  return <Badge>{String(status ?? '-')}</Badge>;
};

const DiscountPageManage: NextPage = () => {
  const [{ store }]: any = useAuthContext();

  const [data, setData] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ active: boolean; content: string }>({
    active: false,
    content: '',
  });

  const [statusOptions, setStatusOptions] = useState<{ label: string; value: string }[]>([
    { label: 'All', value: 'all' },
    { label: 'Expired', value: 'expired' },
    { label: 'Active', value: 'active' },
  ]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');

  const syncTimeoutRef = useRef<number | null>(null);

  // fetch discounts
  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/discount', {
        params: {
          status: statusFilter !== "all" ? statusFilter : undefined,
          keyword: keyword || undefined,
          limit:10
        }
      });
      const discounts: Discount[] =
        res?.data?.data?.data || res?.data?.data || res?.data || [];
      setData(discounts);

      // lấy options filter từ API nếu có
      if (res?.data?.meta?.statuses) {
        const apiStatuses = res.data.meta.statuses.map((s: any) => ({
          label: s.label,
          value: String(s.value),
        }));
        setStatusOptions([{ label: 'All', value: 'all' }, ...apiStatuses]);
      }
    } catch (err) {
      console.error('Failed to fetch discounts:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [store?.id, statusFilter, keyword]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // Pusher events
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '';
    const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'ap1';
    if (!key || !store?.shop_id) return;

    const channelName = `list-syncing-${store.shop_id}`;
    const pusher = new Pusher(key, { cluster });
    const channel = pusher.subscribe(channelName);

    const onCompleted = (payload: any) => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
      setIsSyncing(false);
      setToast({
        active: true,
        content: payload?.message || 'Discounts synced successfully 🎉',
      });
      fetchDiscounts();
    };

    const onFailed = (payload: any) => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
      setIsSyncing(false);
      setToast({ active: true, content: payload?.message || 'Sync failed ❌' });
    };

    channel.bind('sync-completed', onCompleted);
    channel.bind('sync-failed', onFailed);

    return () => {
      try {
        channel.unbind('sync-completed', onCompleted);
        channel.unbind('sync-failed', onFailed);
        pusher.unsubscribe(channelName);
        pusher.disconnect();
      } catch {
        // ignore
      }
    };
  }, [store?.shop_id, fetchDiscounts]);

  // start sync
  const handleSync = async () => {
    setIsSyncing(true);
    setToast({ active: true, content: 'Syncing in progress...' });

    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = window.setTimeout(() => {
      setIsSyncing(false);
      setToast({ active: true, content: 'Sync timeout — reloading data' });
      fetchDiscounts();
      syncTimeoutRef.current = null;
    }, 15000);

    try {
      await axios.post('/discount/sync', { store_id: store?.id });
      if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
        if (syncTimeoutRef.current) {
          window.clearTimeout(syncTimeoutRef.current);
          syncTimeoutRef.current = null;
        }
        setIsSyncing(false);
        setToast({ active: true, content: 'Sync requested — reloading' });
        await fetchDiscounts();
      }
    } catch (err) {
      console.error('Failed to start sync:', err);
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
      setIsSyncing(false);
      setToast({ active: true, content: 'Failed to start sync ❌' });
    }
  };

  return (
    <Frame>
      <Container size="xl">
        <Page
          title="Discounts"
          primaryAction={{
            content: isSyncing ? 'Syncing…' : 'Sync now',
            onAction: handleSync,
            loading: isSyncing,
            disabled: isSyncing,
          }}
        >
          <Card>
            {/* Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Select
                  label="Status"
                  labelHidden
                  options={statusOptions}
                  onChange={(v: string) => setStatusFilter(v)}
                  value={statusFilter}
                />
                <TextField
                 autoComplete="off"
                  label="Keyword"
                  labelHidden
                  placeholder="Search discounts..."
                  value={keyword}
                  onChange={(val) => setKeyword(val)}
                  onBlur={fetchDiscounts}
                />
                <Button onClick={fetchDiscounts} disabled={loading}>
                  Apply
                </Button>
              </div>
              <div>
                <Text as="span" variant="bodyMd">
                  Total: {data.length}
                </Text>
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  padding: 24,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Spinner accessibilityLabel="Loading discounts" size="large" />
              </div>
            ) : (
              <div
                style={{
                  overflowX: 'auto',
                  overflowY: 'visible',
                  padding: 8,
                }}
              >
                <table
                  className="discount-table"
                  style={{
                    width: '100%',
                    minWidth: 980,
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Title</th>
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Type</th>
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Code</th>
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Starts At</th>
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Ends At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((discount, idx) => (
                      <tr
                        key={discount.id ?? idx}
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                      >
                        <td style={{ padding: 12 }}>
                          <Text as="span" variant="bodyMd">
                            {getDiscountId(discount.shopify_discount_id)}
                          </Text>
                        </td>
                        <td style={{ padding: 12 }}>
                          <Text as="span" variant="bodyMd">
                            {discount.title ?? discount.summary ?? '-'}
                          </Text>
                        </td>
                        <td style={{ padding: 12 }}>
                          <Text as="span" variant="bodyMd">
                            {discount.type ?? '-'}
                          </Text>
                        </td>
                        <td style={{ padding: 12 }}>
                          {renderStatusBadge(discount.status ?? '-')}
                        </td>
                        <td style={{ padding: 12 }}>
                          <Text as="span" variant="bodyMd">
                            {parseCode(discount.codes)}
                          </Text>
                        </td>
                        <td style={{ padding: 12 }}>
                          <Text as="span" variant="bodyMd">
                            {discount.starts_at ? new Date(discount.starts_at).toLocaleString() : '-'}
                          </Text>
                        </td>
                        <td style={{ padding: 12 }}>
                          <Text as="span" variant="bodyMd">
                            {discount.ends_at ? new Date(discount.ends_at).toLocaleString() : '-'}
                          </Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Modal
            open={!!selectedSummary}
            onClose={() => setSelectedSummary(null)}
            title="Summary"
            primaryAction={{
              content: 'Close',
              onAction: () => setSelectedSummary(null),
            }}
          >
            <Modal.Section>
              <Text as="p">{selectedSummary}</Text>
            </Modal.Section>
          </Modal>
        </Page>

        {toast.active && (
          <Toast content={toast.content} onDismiss={() => setToast({ active: false, content: '' })} />
        )}
      </Container>
      <style>{`
        .discount-table tbody tr:hover {
          background-color: #f6f6f7; /* Shopify gray */
          cursor: pointer;
        }
      `}</style>
    </Frame>
  );
};

export default DiscountPageManage;
