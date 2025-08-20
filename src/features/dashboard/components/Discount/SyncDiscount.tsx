// src/features/dashboard/components/SyncDiscount.jsx
'use client';

import { env } from 'process';
import { useState } from 'react';
import verifyAppApi from "@/api/verify-app";
import { syncDiscount } from './discount';

export default function SyncDiscount() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Đang đồng bộ...');

    try {
      // let res = await verifyAppApi.verifyAppEmbed();
      let res = await syncDiscount();
      console.log('Kết quả đồng bộ:', res); 
      let { status = false, verify = false } = res;

      if (!status) {
        throw new Error('Đã xảy ra lỗi khi đồng bộ');
      }

    
    } catch (error) {
      
    } finally {
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button
        onClick={handleSync}
        // disabled={isSyncing}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isSyncing ? 'not-allowed' : 'pointer',
          backgroundColor: isSyncing ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
      </button>
      {syncStatus && (
        <p style={{ marginTop: '10px', color: syncStatus.includes('Lỗi') ? 'red' : 'green' }}>
          {syncStatus}
        </p>
      )}
    </div>
  );
}