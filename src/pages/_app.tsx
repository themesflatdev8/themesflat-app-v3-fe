import "@/styles/globals.scss";
import type { AppProps, AppContext } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  // AppBridgeProvider,
  PolarisProvider,
  SessionProvider,
  QueryProvider,
} from "@/components/providers";
// import { RoutePropagator } from '@/components/app-bridge'
import { AuthProvider } from "@/features/auth/contexts";
import { CommonProvider } from "@/contexts/common";
import MiddlewareAuth from "@/middlewares/Auth";
import Layout from "@/components/layouts/Default";
import "@/i18n";
// import {onCLS, onFID, onLCP} from 'web-vitals';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [host, setHost]: any = useState("");

  // function sendToAnalytics(metric: any) {
  //   console.log("Metric: ", metric.name, metric.value)
  //   //add code to send the metric to your analytics service
  // }

  useEffect(() => {
    if (!host && router.query?.host) {
      setHost(router.query?.host || "");
    }
  }, [router.query, host]);

  // useEffect(() => {
  //   onCLS(sendToAnalytics);
  //   onFID(sendToAnalytics);
  //   onLCP(sendToAnalytics);
  // }, [])

  return (
    <PolarisProvider>
      <CommonProvider>
        <QueryProvider>
          <AuthProvider>
            {host ? (
              <SessionProvider>
                <MiddlewareAuth>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </MiddlewareAuth>
              </SessionProvider>
            ) : null}
          </AuthProvider>
        </QueryProvider>
      </CommonProvider>
    </PolarisProvider>
  );
};

export default MyApp;
