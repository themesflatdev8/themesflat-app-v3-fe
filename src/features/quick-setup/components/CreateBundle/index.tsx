import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Toast,
  BlockStack,
  Card,
  Text,
  InlineStack,
  Button,
} from "@shopify/polaris";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { StyledContainer } from "./styled-components";
import ComplementaryProducts from "@/features/quick-setup/components/CreateBundle/ComplementaryProducts";
import MainResource from "@/features/quick-setup/components/CreateBundle/MainResource";
import Discount from "@/features/product-bundles/components/Discount";
import api from "@/features/product-bundles/api";
import { clone } from "@/utils/lodash";
import { _queryKey } from "@/constants/react-query";
import _routes from "@/constants/routes";
import {
  _formDefault,
  TYPE_SPECIFIC,
  TYPE_COLLECTION,
  STRATEGY_AI,
  STRATEGY_MANUAL_PICK,
  PAGE_TYPE_PRODUCT,
} from "@/features/product-bundles/constants";
import _typeReducer from "@/constants/reducer";
import { useAuthContext } from "@/features/auth/contexts";
import { getOnlyNumeric, formatOutputPrice } from "@/utils/money";
type Props = {
  onBack: Function;
  onNext: Function;
};

type TProductCommendations = {
  id: string;
  title: string;
  image: string;
  type: string;
};

interface IFormInput {
  name: string;
  status: number | boolean;
  type: string;
  list_default_ids: any;
  mode: string;
  list_commendations: any;
  maxProduct: number;
  selectable: number;
  useDiscount: number | boolean;
  minimumAmount: string | number;
  promotionType: string;
  discountContent: string;
  discountType: string;
  discountValue: string | number;
  discountOncePer: number | boolean;
  discountFreeshipType: string;
  discountFreeshipContent: string;
  discountFreeshipValue: string | number;
  countdownTimerActive: number | boolean;
  countdownTimerValue: string | number;
  countdownTimerSession: string | number;
  countdownTimerReaches: string | number;
  templateDesktop: string;
  templateMobile: string;
}

const schema = yup
  .object()
  .shape({
    name: yup.string().trim().required("This field is required."),
    use_discount: yup.boolean(),
    minimumAmount: yup
      .string()
      .test(
        "required",
        "This field is required.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (parent.useDiscount) {
            if (!value) return false;
          }
          return true;
        }
      )
      .test(
        "min",
        "Please enter a value greater than 0.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (parent.useDiscount) {
            if (!value) return false;
            let val = Number(getOnlyNumeric(`${value}`));
            return val <= 0 ? false : true;
          }
          return true;
        }
      )
      .test(
        "max",
        "Please enter a valid number.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (parent.useDiscount) {
            if (!value) return false;
            if (!`${value}`.replace(/[^\d]/g, "").match(/^[0-9.]{1,15}$/)) {
              return false;
            }
          }
          return true;
        }
      ),
    type: yup.string().required("This field is required."),
    discountValue: yup
      .string()
      .test(
        "required",
        "This field is required.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.use_discount &&
            (parent.promotion_type == "discount" ||
              parent.promotion_type == "gift")
          ) {
            if (!value) return false;
          }
          return true;
        }
      )
      .test(
        "min-percent",
        "Please enter a value between 0 and 100.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.useDiscount &&
            parent.promotion_type == "discount" &&
            parent.type == "percent"
          ) {
            if (!value) return false;
            let val = Number(getOnlyNumeric(`${value}`));
            return val <= 0 || val > 100 ? false : true;
          }
          return true;
        }
      )
      .test(
        "min-amount",
        "Please enter a value greater than 0.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.useDiscount &&
            parent.promotion_type == "discount" &&
            parent.type == "amount"
          ) {
            if (!value) return false;
            let val = Number(getOnlyNumeric(`${value}`));
            return val <= 0 ? false : true;
          }
          return true;
        }
      )
      .test(
        "max",
        "Please enter a valid number.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.useDiscount &&
            parent.promotion_type == "discount" &&
            parent.type == "amount"
          ) {
            if (!value) return false;
            if (!`${value}`.replace(/[^\d]/g, "").match(/^[0-9.]{1,15}$/)) {
              return false;
            }
          }
          return true;
        }
      ),
    list_commendations: yup.array().when(["mode"], ([mode], schema) => {
      if (mode == STRATEGY_MANUAL_PICK)
        return schema.test(
          "required",
          "Please select a product",
          (value: any, context: any) => {
            if (!value || !value.length) return false;
            return true;
          }
        );
      return schema;
    }),
    list_default_ids: yup.array().when(["type"], ([type], schema) => {
      if (type == TYPE_SPECIFIC) {
        return schema.test(
          "required",
          "Please select at least a main product",
          (value: any, context: any) => {
            if (!value || !value.length) return false;
            return true;
          }
        );
      } else if (type == TYPE_COLLECTION) {
        return schema.test(
          "required",
          "'Please select at least a collection",
          (value: any, context: any) => {
            if (!value || !value.length) return false;
            return true;
          }
        );
      }
      return schema;
    }),
    discountContent: yup
      .string()
      .when(["promotionType"], ([promotionType], schema) => {
        if (promotionType == "discount") {
          return schema.test(
            "required",
            "This field is required.",
            (value: any, context: any) => {
              if (!value || !value?.trim()) return false;
              return true;
            }
          );
        }
        return schema;
      }),
    discountFreeshipContent: yup
      .string()
      .when(["promotionType"], ([promotionType], schema) => {
        if (promotionType == "freeship") {
          return schema.test(
            "required",
            "This field is required.",
            (value: any, context: any) => {
              if (!value || !value?.trim()) return false;
              return true;
            }
          );
        }
        return schema;
      }),
  })
  .required();

function CreateBundle({ onBack, onNext }: Props) {
  const router = useRouter();
  const { query } = router;
  const [{ store }]: any = useAuthContext();

  const [mainData, setMainData] = useState([]);

  const getForm = (form: IFormInput) => {
    let discountType = form.discountType ?? _formDefault.discountType;
    return {
      name: form.name || "Product bundle 1",
      status: form.status ?? _formDefault.status,
      type: form.type ?? _formDefault.type,
      list_default_ids: form.list_default_ids ?? _formDefault.list_default_ids,
      mode: form.mode ?? _formDefault.mode,
      list_commendations:
        form.list_commendations ?? _formDefault.list_commendations,
      maxProduct: form.maxProduct ?? _formDefault.maxProduct,
      selectable: form.selectable ?? _formDefault.selectable,
      useDiscount: form.useDiscount ?? _formDefault.useDiscount,
      minimumAmount: formatOutputPrice(
        form.minimumAmount ?? _formDefault.minimumAmount
      ),
      promotionType: form.promotionType ?? _formDefault.promotionType,
      discountType,
      discountValue:
        discountType == "percent"
          ? (form.discountValue ?? _formDefault.discountValue)
          : formatOutputPrice(form.discountValue ?? _formDefault.discountValue),
      discountContent: form.discountContent ?? _formDefault.discountContent,
      discountOncePer: form.discountOncePer ?? _formDefault.discountOncePer,
      discountFreeshipType:
        form.discountFreeshipType ?? _formDefault.discountFreeshipType,
      discountFreeshipValue:
        form.discountFreeshipValue ?? _formDefault.discountFreeshipValue,
      discountFreeshipContent:
        form.discountFreeshipContent ?? _formDefault.discountFreeshipContent,
      countdownTimerActive:
        form.countdownTimerActive ?? _formDefault.countdownTimerActive,
      countdownTimerValue:
        form.countdownTimerValue ?? _formDefault.countdownTimerValue,
      countdownTimerSession:
        form.countdownTimerSession ?? _formDefault.countdownTimerSession,
      countdownTimerReaches:
        form.countdownTimerReaches ?? _formDefault.countdownTimerReaches,
      templateDesktop: form.templateDesktop ?? _formDefault.templateDesktop,
      templateMobile: form.templateMobile ?? _formDefault.templateMobile,
    };
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

  return (
    <StyledContainer>
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Choose your desired campaign type to preview for your store
            </Text>
            <BlockStack gap="400">
              <MainResource
                errors={errors}
                watch={watch}
                setValue={setValue}
                mainData={mainData}
                setMainData={setMainData}
              />

              <ComplementaryProducts
                errors={errors}
                control={control}
                watch={watch}
                setValue={setValue}
                mainData={mainData}
              />
              {/* <Discount
                errors={errors}
                errorsServer={{}}
                control={control}
                watch={watch}
                setValue={setValue}
                clearErrors={clearErrors}
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

export default CreateBundle;
