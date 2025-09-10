'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import axios from '@/utils/axios';
import { useAuthContext } from "@/features/auth/contexts";
import {
  Frame,
  Toast,
  Button,
  Card,
  Text,
  Page,
  BlockStack,
  Box,
} from "@shopify/polaris";

// API call
const syncDiscount = () => axios.post("discount/sync");

export default function SyncDiscount() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ active: boolean; content: string }>({
    active: false,
    content: '',
  });
  const [{ store }]: any = useAuthContext();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'ap1',
    });

    const channel = pusher.subscribe(`list-syncing-${store?.shop_id}`);
    channel.bind('sync-completed', (data: any) => {
      setIsSyncing(false);
      setToast({
        active: true,
        content: data.message || 'Discounts synced successfully 🎉',
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [store?.shop_id]);

  const handleSync = async () => {
    setIsSyncing(true);
    setToast({ active: true, content: 'Syncing in progress...' });
    try {
      await syncDiscount();
    } catch {
      setIsSyncing(false);
      setToast({ active: true, content: 'Failed to sync discounts ❌' });
    }
  };

  return (
    <Frame>
      <Page>
        <Card>
          <Box maxWidth="500px"  padding="600">
            <BlockStack gap="400" align="center">
              <Text variant="headingLg" as="h2">
                Keep your discounts up-to-date
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                Sync discounts with your Shopify store in just one click.
              </Text>
              <Button
                size="large"
                onClick={handleSync}
                loading={isSyncing}
                disabled={isSyncing}
              >
                {isSyncing ? 'Syncing…' : 'Sync now'}
              </Button>
            </BlockStack>
          </Box>
        </Card>
      </Page>

      {toast.active && (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({ active: false, content: '' })}
        />
      )}
    </Frame>
  );
}
