// src/middlewares/MiddlewareAuth.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { NavMenu } from "@shopify/app-bridge-react";
import { useAuthContext } from "@/features/auth/contexts";
import { Loading } from "@/components/core";
import api from "@/features/auth/api";
import { _typeReducer } from "@/features/auth/constants";
import { _navigationMenu } from "@/constants/navigation";

type Props = {
  children: React.ReactNode;
};

const MiddlewareAuth = ({ children }: Props) => {
  const router = useRouter();
  const { query } = router;
  const [{ store }, dispatch]: any = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);

  // Load store và kiểm tra approve_domain
  useEffect(() => {
    (async () => {
      const queryTemp = { ...query };
      delete queryTemp["id"];
      const res: any = await api.auth(queryTemp);
      const { status = false, data = null } = res;

      if (status && data) {
        dispatch({ type: _typeReducer.SET_STORE, payload: data });

        // Redirect nếu pending
        if (data?.approve_domain?.status === "pending") {
          setRedirected(true);
          router.replace("/approve-domain");
        }
      }

      setLoading(false);
    })();
  }, []);

  // Chặn truy cập các route khác khi pending
  useEffect(() => {
    if (
      store?.approve_domain?.status === "pending" &&
      router.asPath !== "/approve-domain" &&
      !redirected
    ) {
      setRedirected(true);
      router.replace("/approve-domain");
    }
  }, [store, router.asPath, redirected]);

  // Navigation menu chuẩn Polaris
  const navigation = useMemo(() => {
    const handleRoute = (path: string) => {
      if (store?.approve_domain?.status === "pending") {
        router.replace("/approve-domain");
      } else {
        router.push(path);
      }
    };

    return _navigationMenu.map((item: any) => ({
      ...item,
      onClick: (e: any) => {
        e.preventDefault();
        handleRoute(item.destination);
      },
    }));
  }, [store]);

  if (loading) return <Loading />;

  return (
    <>
      <NavMenu>
        <a
          href="/"
          rel="home"
          onClick={(e) => {
            e.preventDefault();
            if (store?.approve_domain?.status === "pending") {
              router.replace("/approve-domain");
            } else {
              router.push("/");
            }
          }}
        >
          Home
        </a>
        {navigation.map((item: any) => (
          <a key={item.destination} href={item.destination} onClick={item.onClick}>
            {item.label}
          </a>
        ))}
      </NavMenu>
      {children}
    </>
  );
};

export default MiddlewareAuth;
