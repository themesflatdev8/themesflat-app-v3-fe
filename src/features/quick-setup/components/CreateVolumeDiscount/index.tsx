import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Card, BlockStack, Text, InlineStack, Button } from "@shopify/polaris";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { StyledContainer } from "./styled-components";
import MainResource from "@/features/volume-discounts/components/MainResource";
import Tier from "@/features/volume-discounts/components/Tier";
import { clone } from "@/utils/lodash";
import { _queryKey } from "@/constants/react-query";
import _routes from "@/constants/routes";
import { _formDefault } from "@/features/volume-discounts/constants";
import _typeReducer from "@/constants/reducer";
import { useAuthContext } from "@/features/auth/contexts";
import { getOnlyNumeric, formatOutputPrice } from "@/utils/money";
import CountdownTimer from "@/features/volume-discounts/components/CountdownTimer";

type Props = {
  onBack: Function;
  onNext: Function;
};

type TTiers = {
  id?: string;
  name: string;
  quantity: string | number;
  message: string;
  useDiscount: number;
  discountType: string;
  discountValue: string;
};

interface IFormInput {
  name: string;
  status: number;
  product_id: string | number;
  mostPopularActive: number;
  mostPopularPosition: string;
  tiers: TTiers[];
  countdownTimerActive: number;
  countdownTimerValue: string | number;
  countdownTimerSession: string | number;
  countdownTimerReaches: string | number;
}

const schema = yup
  .object()
  .shape({
    name: yup
      .string()
      .trim()
      .required("This field is required.")
      .max(100, "Please enter no more than 100 characters."),
    product_id: yup.string().required("Please select a product"),
    tiers: yup
      .array()
      .of(
        yup.object().shape({
          name: yup
            .string()
            .trim()
            .required("This field is required.")
            .max(100, "Please enter no more than 100 characters."),
          quantity: yup
            .string()
            .required(
              "The quantity in this tier cannot exceed the quantity in a higher tier"
            )
            .test("integer", "Please enter a valid number.", (value: any) => {
              return /^\d+$/.test(value);
            })
            .matches(/^[0-9]{1,9}$/, "Please enter a valid number."),
          message: yup.string().trim(),
          discountValue: yup
            .string()
            .when("useDiscount", ([useDiscount], schema) => {
              if (useDiscount)
                return schema
                  .required("This field is required.")
                  .test(
                    "invalid_percent",
                    "Please enter a value between 0 and 100.",
                    (value: any, context: any) => {
                      let parent = context.parent;
                      if (
                        parent.useDiscount &&
                        parent.discountType == "percent"
                      ) {
                        if (!value) return false;
                        let val = Number(getOnlyNumeric(`${value}`));
                        return val <= 0 || val > 100 ? false : true;
                      }
                      return true;
                    }
                  )
                  .test(
                    "invalid_amount",
                    "Please enter a value greater than 0",
                    (value: any, context: any) => {
                      let parent = context.parent;
                      if (
                        parent.useDiscount &&
                        parent.discountType == "amount"
                      ) {
                        if (!value) return false;
                        let val = Number(getOnlyNumeric(`${value}`));
                        return val <= 0 ? false : true;
                      }
                      return true;
                    }
                  );
              return schema;
            }),
        })
      )
      .test(
        "quantity",
        "The quantity in this tier cannot exceed the quantity in a higher tier",
        (value, context) => {
          const errors: any = [];
          if (value && value.length > 1) {
            value?.forEach((item: any, index: number) => {
              if (
                index > 0 &&
                Number(`${item.quantity}`.replace(/\D/gi, "")) <=
                  Number(`${value[index - 1].quantity}`.replace(/\D/gi, ""))
              ) {
                errors.push(
                  context.createError({
                    path: `tiers[${index}].quantity`,
                    message:
                      "The quantity in this tier cannot exceed the quantity in a higher tier",
                  })
                );
              }
            });
          }
          if (errors.length > 0) {
            throw new yup.ValidationError(errors);
          }
          return true;
        }
      ),
  })
  .required();

function CreateVolumeDiscount({ onBack, onNext }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;
  const [{ store }]: any = useAuthContext();

  const [mainData, setMainData] = useState(null);

  const getForm = (form: IFormInput) => {
    return {
      name: form.name || "Volume discount 1",
      product_id: form.product_id,
      status: form.status,
      mostPopularActive: form.mostPopularActive,
      mostPopularPosition: form.mostPopularPosition,
      tiers: form.tiers || _formDefault.tiers,
      countdownTimerActive: form.countdownTimerActive,
      countdownTimerValue: form.countdownTimerValue,
      countdownTimerSession: form.countdownTimerSession,
      countdownTimerReaches: form.countdownTimerReaches,
    };
  };

  const handleData = (data: any) => {
    let objNew: any = {
      name: data.name,
      product_id: data.product_id,
      status: data.status,
      mostPopularActive: data.mostPopularActive,
      mostPopularPosition: `${data.mostPopularPosition ?? 1}`,
      tiers: data.tiers.map((item: any, index: number) => {
        return {
          id: item.id,
          name: item.name || "",
          quantity: item.quantity,
          message: item.message || "",
          useDiscount: item.useDiscount,
          discountType: item.discountType,
          discountValue:
            item.discountType == "percent"
              ? item.discountValue || ""
              : formatOutputPrice(item.discountValue || ""),
          discount_id: item.discount_id || null,
          discount_code: item.discount_code || null,
          chosen: false,
          selected: false,
        };
      }),
      countdownTimerActive: data.countdownTimerActive,
      countdownTimerValue: data.countdownTimerValue,
      countdownTimerSession: data.countdownTimerSession,
      countdownTimerReaches: data.countdownTimerReaches,
    };
    reset(getForm(objNew));
  };

  const formOptions = {
    resolver: yupResolver(schema),
    defaultValues: getForm({ ..._formDefault }),
  };

  const {
    control,
    reset,
    setValue,
    watch,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IFormInput>(formOptions);
  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    try {
      onNext(form);
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    handleData(clone(_formDefault));
  }, []);

  return (
    <StyledContainer>
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Choose your desired campaign type to preview for your store
            </Text>
            <BlockStack gap="400">
              <Card padding="400">
                <BlockStack gap="400">
                  <MainResource
                    errors={errors}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    mainData={mainData}
                    setMainData={setMainData}
                  />
                </BlockStack>
              </Card>

              <Tier
                errors={errors}
                control={control}
                watch={watch}
                setValue={setValue}
                clearErrors={clearErrors}
                setToast={() => {}}
              />

              {/* <CountdownTimer
                errors={errors}
                errorsServer={null}
                control={control}
                watch={watch}
              /> */}
            </BlockStack>
          </BlockStack>
        </Card>
        <InlineStack gap="200" align="end">
          <Button onClick={() => onBack()}>Black</Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Next
          </Button>
        </InlineStack>
      </BlockStack>
    </StyledContainer>
  );
}

export default CreateVolumeDiscount;
