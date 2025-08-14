import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Grid, List, Button, Icon, Text } from "@shopify/polaris";
import ModalDowngraded from "@/components/shared/ModalDowngraded";
import {
  StyledContainer,
  StyledCardContentContainer,
  StyledCardContent,
  StyledCardSectionAction,
  StyledCardItem,
  StyledCardHeader,
  StyledTextPlanTitle,
  StyledTextPlanSubtitle,
  StyledTextPrice,
  StyledTextPricePerOrder,
} from "./styled-components";
import ModalDowngradePlan from "@/features/charge/components/ModalDowngradePlan";
import {
  _planList,
  PLAN_FREE,
  PRICING,
  CHOOSE_PLAN,
  PLAN_PREMIUM,
  PLAN_ESSENTIAL,
} from "@/features/charge/constants";
import api from "@/features/charge/api";
import { useAuthContext } from "@/features/auth/contexts";
import { _typeReducer } from "@/features/auth/constants";
import { _queryKey } from "@/constants/react-query";

type Props = {
  page?: string;
};

const Plan = ({ page = PRICING }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [{ store }, dispatch]: any = useAuthContext();
  const [dataPlans, setDataPlans]: any = useState(_planList);
  const [currentPlan, setCurrentPlan]: any = useState(null);
  const [newPlan, setNewPlan]: any = useState(null);
  const [isActiveModalDowngrade, setIsActiveModalDowngrade] = useState(false);
  const [isActiveModalDowngraded, setIsActiveModalDowngraded] = useState(false);

  const { mutate: mutationCharge } = useMutation(async (data: any) => {
    setIsLoading(true);
    let res = await api.charge(data);
    let { status = false, data: dataRes = null } = res;
    if (data.plan == PLAN_FREE) {
      dispatch({
        type: _typeReducer.SET_STORE,
        payload: { ...store, app_plan: PLAN_FREE },
      });
      router.push(`/?plan=${PLAN_FREE}&is_upgrade=false`);
      setIsLoading(false);
    } else {
      if (status && dataRes && dataRes.redirect_url) {
        dataRes.redirect_url && window.open(dataRes.redirect_url, "_top");
      } else {
        setIsLoading(false);
      }
    }
    return res;
  });

  const onSave = async (item: any) => {
    let isUpgradePlan =
      !currentPlan || item.order > currentPlan?.order ? true : false;
    let data = {
      // type: isUpgradePlan ? "upgrade" : "downgrade”",
      plan: item.code,
      redirect_url:
        item.code == PLAN_FREE
          ? ""
          : `plan=${item.name}&is_upgrade=${isUpgradePlan}`,
    };
    mutationCharge(data);
  };

  const onCharge = (item: any) => {
    setNewPlan(item);
    if (currentPlan && item.order < currentPlan?.order && page != CHOOSE_PLAN) {
      setIsActiveModalDowngrade(true);
      return;
    }
    onSave(item);
  };

  const onChangePlan = () => {
    setIsActiveModalDowngrade(false);
    onSave(newPlan);
  };

  const textBtnCharge = (item: any) => {
    let content = "Get started";
    if (page == PRICING && currentPlan && currentPlan.code == item.code) {
      content = "You are here";
    } else if (store.trial_days > 0 && item.code != PLAN_FREE) {
      content = `Try with ${store.trial_days}-day free trial`;
    }
    return content;
  };

  const isActivePlan = (planName: string) => {
    if (page != PRICING) {
      return !currentPlan || (currentPlan && PLAN_FREE == currentPlan.code)
        ? false
        : true;
    }
    return page == PRICING && currentPlan && planName == currentPlan.code;
  };

  useEffect(() => {
    if (store && dataPlans) {
      setCurrentPlan((): any => {
        return (
          dataPlans &&
          dataPlans.find((item: any) => item.code == store.app_plan)
        );
      });
    }
  }, [store, dataPlans]);

  return (
    <StyledContainer>
      <Grid
        columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
        gap={{ xs: "16px", sm: "16px", md: "32px", lg: "32px", xl: "32px" }}
      >
        {dataPlans &&
          dataPlans.map((item: any, index: number) => (
            <div key={index}>
              <StyledCardItem
                name={item.code}
                active={item.code == PLAN_ESSENTIAL}
              >
                <StyledCardHeader name={item.code}>
                  <StyledTextPlanTitle name={item.code}>
                    {item.name}
                  </StyledTextPlanTitle>
                  <StyledTextPlanSubtitle name={item.code}>
                    {item.subtitle}
                  </StyledTextPlanSubtitle>
                  <StyledTextPrice name={item.code}>
                    <strong>$</strong>
                    <span>{item.price}</span>
                    <p>monthly</p>
                  </StyledTextPrice>
                  {item.perOrder && (
                    <StyledTextPricePerOrder name={item.code}>
                      {item.perOrder}
                    </StyledTextPricePerOrder>
                  )}
                </StyledCardHeader>
                <StyledCardContentContainer
                  active={item.code == PLAN_ESSENTIAL}
                >
                  <StyledCardContent
                    name={item.code}
                    active={item.code == currentPlan?.code}
                  >
                    <Text variant="headingMd" as="h2" tone="subdued">
                      {item.features.title}:
                    </Text>
                    <List>
                      {item.features.list.map(
                        (itemList: any, index: number) => (
                          <List.Item key={index}>
                            <Icon source={itemList.icon} />
                            <Text variant="bodyMd" as="p">
                              {itemList.description}
                            </Text>
                          </List.Item>
                        )
                      )}
                    </List>
                  </StyledCardContent>
                  <StyledCardSectionAction active={isActivePlan(item.code)}>
                    <Button
                      variant={
                        !isActivePlan(item.code) && item.code != PLAN_FREE
                          ? "primary"
                          : undefined
                      }
                      fullWidth
                      disabled={
                        newPlan && item.code != newPlan.code ? isLoading : false
                      }
                      loading={
                        newPlan && item.code == newPlan.code ? isLoading : false
                      }
                      onClick={() =>
                        (!currentPlan ||
                          page == CHOOSE_PLAN ||
                          (currentPlan && item.code != currentPlan.code)) &&
                        onCharge(item)
                      }
                    >
                      {textBtnCharge(item)}
                    </Button>
                  </StyledCardSectionAction>
                </StyledCardContentContainer>
              </StyledCardItem>
            </div>
          ))}
      </Grid>

      <ModalDowngradePlan
        open={isActiveModalDowngrade}
        currentPlan={currentPlan}
        newPlan={newPlan}
        onClose={() => setIsActiveModalDowngrade(false)}
        onOk={() => onChangePlan()}
      ></ModalDowngradePlan>

      <ModalDowngraded
        planName="Free"
        open={isActiveModalDowngraded}
        onClose={() => setIsActiveModalDowngraded(false)}
      ></ModalDowngraded>
    </StyledContainer>
  );
};

export default Plan;
