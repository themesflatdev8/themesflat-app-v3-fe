'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from "@/features/auth/contexts";
import Pusher, { Channel } from "pusher-js"; // Sửa dòng này

const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const PUSHER_APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

export default function SyncDiscount() {
  let [{ store }] = useAuthContext();
  const SHOP_ID = store?.shopId;

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [modalActive, setModalActive] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (message:string) => {
    setModalMessage(message);
    setModalActive(true);
    setTimeout(() => {
      setModalActive(false);
    }, 3000);
  };

  useEffect(() => {
    if (!SHOP_ID) {
      console.log("Waiting for SHOP_ID to be available...");
      return;
    }

    let newPusher: Pusher | undefined;
    let channel: Channel | undefined;

    try {
      if (!PUSHER_APP_KEY || !PUSHER_APP_CLUSTER) {
        throw new Error("Pusher credentials are not configured.");
      }

      newPusher = new Pusher(PUSHER_APP_KEY, {
        cluster: PUSHER_APP_CLUSTER,
      });

      const channelName = `shop-${SHOP_ID}`;
      channel = newPusher.subscribe(channelName);

      channel.bind("sync-status-update", (data) => {
        console.log("Pusher event received:", data);
        const { shop_id, resource, status } = data;

        if (shop_id === SHOP_ID && resource === 'discount') {
          if (status === 'syncing') {
            setSyncStatus('Đang đồng bộ...');
            setIsSyncing(true);
          } else if (status === 'success') {
            setSyncStatus('Đồng bộ thành công!');
            setIsSyncing(false);
            showModal("Đồng bộ thành công!");
          }
        }
      });
    } catch (error) {
      console.error("Lỗi khi kết nối Pusher:", error);
      setSyncStatus('Lỗi khi kết nối Pusher');
      if (newPusher) {
          newPusher.disconnect();
      }
    }

    return () => {
      if (channel) {
        channel.unbind("sync-status-update");
        channel.unsubscribe();
      }
      if (newPusher) {
        newPusher.disconnect();
      }
    };
  }, [SHOP_ID]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Đang đồng bộ...');

    try {
      console.log('Bắt đầu quá trình đồng bộ...');
    } catch (error) {
      console.error('Đồng bộ thất bại:', error);
      setSyncStatus('Đã xảy ra lỗi khi đồng bộ');
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-auto">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold">
          Đồng bộ giảm giá
        </h2>

        {syncStatus && (
          <p className={`text-sm ${syncStatus.includes('Lỗi') ? 'text-red-500' : 'text-green-500'}`}>
            {syncStatus}
          </p>
        )}

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
            isSyncing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
        </button>

        {modalActive && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
              {modalMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}