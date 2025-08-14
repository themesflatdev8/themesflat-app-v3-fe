import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/features/auth/contexts";
import { useRouter } from "next/router";
import _routes from "@/constants/routes";
import {
  Page,
  Card,
  Toast,
  Button,
  EmptyState,
  Link,
  InlineGrid,
  Text,
  Banner,
  Box,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import List from "@/features/product-bundles/components/List";
import Form from "@/features/product-bundles/components/Form";

type Props = {
  pageType: string;
  onRedirect: Function;
};

const MainProductBundles = ({ pageType, onRedirect }: Props) => {
  const router = useRouter();
  const [type, setType] = useState("");
  const [formId, setFormId] = useState("create");
  // Toast
  const [toast, setToast] = useState({
    active: false,
    content: "",
    error: false,
    duration: 5000,
  });
  const toggleActiveToast = useCallback(
    () => setToast((prev) => ({...prev, active: !prev.active})),
    []
  );
  const toastMarkup = toast.active ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={toggleActiveToast}
      duration={toast.duration}
    />
  ) : null;

  return (
    <>
      {!type ? (
        <List 
          pageType={pageType} 
          onAction={({type = "", id = ""} : any) => {
            if(type == "customization"){
              onRedirect({type: "customization"})
            }else{
              setFormId(id);
              setType("form");
            }
          }}
        />
      ) : (
        <Form 
          pageType={pageType} 
          formId={formId}
          onAction={({ type = ""} ) => {
            if(type == "customization"){
              onRedirect({type: "customization"})
            }else if(type == "removed"){
              setToast({ active: true, content: `Removed`, error: false, duration: 5000 });
            }
            setType("");
            setFormId("")
          }}
        />
      )}

      {toastMarkup}
    </>
  );
};

export default MainProductBundles;
