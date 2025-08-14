import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Text,
  Card,
  InlineStack,
  TextField,
  BlockStack,
  Select,
  InlineGrid,
  RadioButton,
} from "@shopify/polaris";
import { StyledContainer } from "./styled-components";
import { Switch } from "@/components/core";
import { Controller } from "react-hook-form";
import { useAuthContext } from "@/features/auth/contexts";
import { getOnlyDigit } from "@/utils/money";
import _routes from "@/constants/routes";

type Props = {
  errors?: any;
  control?: any;
  errorsServer?: any;
  watch: any;
};

function CountdownTimer({ errors, errorsServer, control, watch }: Props) {
  const router = useRouter();
  const [{ store }]: any = useAuthContext();

  return (
    <StyledContainer>
      <Card>
        <BlockStack gap="300">
          <Controller
            name="countdownTimerActive"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InlineStack gap="200" blockAlign="start" wrap={false}>
                <Switch
                  checked={value}
                  onChange={(status: any) => onChange(status)}
                />
                <BlockStack gap="050">
                  <Text variant="bodyMd" as="h3" fontWeight="semibold">
                    Countdown timer
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Display a countdown timer for discounted offers, apply with
                    tier that has discount enabled
                  </Text>
                </BlockStack>
              </InlineStack>
            )}
          />
          {watch("countdownTimerActive") ? (
            <BlockStack gap="300">
              <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="300">
                <Controller
                  name="countdownTimerValue"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Timer"
                      type="number"
                      value={value || ""}
                      onChange={(val: string) => {
                        onChange(getOnlyDigit(val));
                      }}
                      onBlur={() => {
                        if (value == "") {
                          onChange(1);
                        } else if (value <= 0) {
                          onChange(1);
                        } else if (value > 142560) {
                          onChange(142560);
                        }
                      }}
                      prefix="Minutes"
                      autoComplete="off"
                      error={
                        errorsServer.countdownTimerValue ||
                        errors?.countdownTimerValue?.message
                      }
                    />
                  )}
                />
              </InlineGrid>
              <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="300">
                <Controller
                  name="countdownTimerReaches"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Countdown reaches"
                      type="number"
                      helpText="Red text will be displayed"
                      value={value || ""}
                      onChange={(val: string) => {
                        onChange(getOnlyDigit(val));
                      }}
                      onBlur={() => {
                        if (value == "") {
                          onChange(1);
                        } else if (value <= 0) {
                          onChange(1);
                        } else if (value > 100) {
                          onChange(100);
                        }
                      }}
                      prefix="%"
                      autoComplete="off"
                      error={
                        errorsServer.countdownTimerReaches ||
                        errors?.countdownTimerReaches?.message
                      }
                    />
                  )}
                />
                <BlockStack gap="200">
                  <Controller
                    name="countdownTimerSession"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        label="Repeat time after it ends"
                        type="number"
                        value={value || ""}
                        onChange={(val: string) => {
                          onChange(getOnlyDigit(val));
                        }}
                        onBlur={() => {
                          if (value == "") {
                            onChange(1);
                          } else if (value <= 0) {
                            onChange(1);
                          } else if (value > 142560) {
                            onChange(142560);
                          }
                        }}
                        prefix="Minutes"
                        helpText="Ex: 1 hour = 60, 1 day = 1440. If you want to hide, set 99999 minutes"
                        autoComplete="off"
                        error={
                          errorsServer.countdownTimerSession ||
                          errors?.countdownTimerSession?.message
                        }
                      />
                    )}
                  />
                </BlockStack>
              </InlineGrid>
            </BlockStack>
          ) : null}
        </BlockStack>
      </Card>
    </StyledContainer>
  );
}

export default CountdownTimer;
