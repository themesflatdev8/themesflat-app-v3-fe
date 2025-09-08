import React, { useState } from "react";
import axios from "axios";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Toast,
  BlockStack,
  Box,
} from "@shopify/polaris";

const ApproveDomainPage: React.FC = () => {
  const [domainName, setDomainName] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [security, setSecurity] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        domain_name: domainName,
        email_domain: emailDomain,
        valid_days: validDays,
        security,
      };

      await axios.post("/api/shop/request", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setToastContent("Gửi thành công!");
      setToastActive(true);
      setDomainName("");
      setEmailDomain("");
      setValidDays(30);
      setSecurity("");
    } catch (error: any) {
      setToastContent("Gửi thất bại: " + (error.message || "Lỗi server"));
      setToastActive(true);
    } finally {
      setLoading(false);
    }
  };

  const toastMarkup = toastActive ? (
    <Toast content={toastContent} onDismiss={() => setToastActive(false)} />
  ) : null;

  return (
    <Page title="Duyệt Domain">
      <Card>
        <Box padding="400">
          <FormLayout>
            <TextField
             autoComplete="off"
              label="Domain"
              value={domainName}
              onChange={setDomainName}
              placeholder="vd: example.com"
            />
            <TextField
             autoComplete="off"
              label="Email Domain"
              value={emailDomain}
              onChange={setEmailDomain}
              placeholder="vd: gmail.com"
            />
            <TextField
              autoComplete="off"
              label="Valid Days"
              type="number"
              value={String(validDays)}
              onChange={(val) => setValidDays(Number(val))}
            />
            <TextField
              autoComplete="off"
              label="Security"
              value={security}
              onChange={setSecurity}
            />
            <Button variant="primary" onClick={handleSubmit} loading={loading}>
              Submit
            </Button>
          </FormLayout>
        </Box>
      </Card>
      {toastMarkup}
    </Page>
  );
};

export default ApproveDomainPage;
