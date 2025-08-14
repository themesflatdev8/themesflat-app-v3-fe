import type { NextPage } from "next";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import {
  Text,
  Card,
  Toast,
  ProgressBar,
  Icon,
  Button,
  ButtonGroup,
  Badge,
  InlineGrid,
  InlineStack,
  TextField,
  FormLayout,
  Popover,
  Link,
  Box,
  BlockStack,
} from "@shopify/polaris";
import { Container, Image } from "@/components/core";
import {
  CheckIcon,
  AppExtensionIcon,
  CheckCircleIcon,
  EmailIcon,
  EditIcon,
  AlertTriangleIcon,
  CursorIcon,
} from "@shopify/polaris-icons";
import {
  StyledHeader,
  StyledSteps,
  StyledStep,
  StyledStepIcon,
  StyledStepContent,
  StyledStepBody,
  StyledStepContentImage,
  StyledStepDescription,
  StyledStepLine,
  StyledBenefits,
  StyledBenefitsHeader,
  StyledBenefitsExceptionList,
  StyledProgress,
  StyledProgressBar,
  StyledRating,
  StyledRatingImage,
  StyledRatingContent,
  StyledInlineError,
  StyledApplyStatus,
  StyledActionApplyStatus,
} from "@/features/loyalty/styled-components";
import LogoIcon from "@/features/loyalty/assets/logo.svg";
import ratingImage from "@/features/loyalty/assets/rating.png";
import vipImage from "@/features/loyalty/assets/vip.png";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/api";
import { useAuthContext } from "@/features/auth/contexts";
import { checkInstallExtension } from "@/utils/chrome-extension";
import _typeReducer from "@/constants/reducer";
import { _typeReducer as _typeReducerAuth } from "@/features/auth/constants";
import { useCommonContext } from "@/contexts/common";
import { LINK_CHROME_EXTENSION } from "@/constants/link";
import { openChat } from "@/utils/chat";
import { _queryKey } from "@/constants/react-query";
import _routes from "@/constants/routes";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
import { STORAGE_APPLY_LOYALTY } from "@/constants/storage";
import { LINK_RATE, LINK_GENERATE_PRODUCT_BUNDLE } from "@/constants/link";

type Props = {};

const LoyaltyPage: NextPage = ({}: Props) => {
  const router = useRouter();
  const bottomEl: any = useRef(null);
  const [{ store }, dispatch]: any = useAuthContext();
  let [{ loyalty: questLoyalty }, dispatchCommon]: any = useCommonContext();
  const [isShowQuestOne, setIsShowQuestOne] = useState(false);
  const [isShowQuestTwo, setIsShowQuestTwo] = useState(false);
  const [isShowQuestThree, setIsShowQuestThree] = useState(false);
  const [isErrorVerifyQuest2, setIsErrorVerifyQuest2] = useState(false);
  const [isErrorVerifyQuest3, setIsErrorVerifyQuest3] = useState(false);
  const [isInstallExt, setIsInstallExt] = useState(false);
  const [popoverActive, setPopoverActive] = useState(false);
  const [emailValue, setEmailValue] = useState(store?.email || "");

  const [toast, setToast] = useState({
    content: "",
    error: false,
    active: false,
  });
  const toggleActiveToast = useCallback(
    () =>
      setToast((oldVal) => {
        return { ...oldVal, active: !oldVal.active };
      }),
    []
  );

  const progress = useMemo(() => {
    if (!questLoyalty) return { percent: 100, step: 3 };
    // if(!!questLoyalty.isComplete) return {percent: 100, step: 3}
    let result = {
      percent: 0,
      step: 0,
    };
    if (questLoyalty.one) {
      result.percent += 100 / 3;
      result.step += 1;
    }
    if (questLoyalty.two) {
      result.percent += 100 / 3;
      result.step += 1;
    }
    if (questLoyalty.three) {
      result.percent += 100 / 3;
      result.step += 1;
    }
    // if(questLoyalty.four){
    //   result.percent += 100/4
    //   result.step += 1
    // }
    return result;
  }, [questLoyalty]);

  const { mutate: mutateApply, isLoading: isLoadingApply } = useMutation(
    async () => {
      let res = await api.applyLoyalty();
      let { status = false, message = "" } = res;
      if (status) {
        setToast({
          content: "Verified Successfully",
          error: false,
          active: true,
        });
        setTimeout(() => {
          scrollToBottom();
        }, 300);
        dispatchCommon({
          type: _typeReducer.SET_LOYALTY,
          payload: { apply: true, isComplete: true },
        });
      } else {
        setToast({ content: "Server error", error: true, active: true });
      }
      return res;
    }
  );

  const { mutate: mutationUpdateShop, isLoading: isLoadingUpdateShop } =
    useMutation(async ({ email = "" }: any) => {
      let res = await api.completeQuestLoyalty({ email });
      let { status = false, message = "" } = res;
      if (status) {
        setToast({ content: "Email updated!", error: false, active: true });
        dispatchCommon({ type: _typeReducer.SET_LOYALTY, payload: { email } });
      } else {
        setToast({ content: "Server error", error: true, active: true });
      }
      setPopoverActive(false);
      return res;
    });

  const { mutate: mutateCompleteQuestOne } = useMutation(async () => {
    let res = await api.completeQuestLoyalty({ quest_review: true });
    let { status = false, message = "" } = res;
    if (status) {
      dispatchCommon({
        type: _typeReducer.SET_LOYALTY,
        payload: { one: true },
      });
    }
    return res;
  });

  const { mutate: mutateCompleteQuestTwo, isLoading: isLoadingQuest2 } =
    useMutation(async ({ isFirst = false }: any) => {
      let res = await api.completeQuestLoyalty({ quest_ext: true });
      let { status = false, message = "" } = res;
      if (status) {
        dispatchCommon({
          type: _typeReducer.SET_LOYALTY,
          payload: { two: true },
        });
        !isFirst &&
          setToast({
            content: "Verified Successfully",
            error: false,
            active: true,
          });
        setIsErrorVerifyQuest2(false);
        if (!questLoyalty.three && questLoyalty.one) {
          setIsShowQuestTwo(false);
          setIsShowQuestThree(true);
        } else {
          setIsShowQuestTwo(false);
        }
      } else {
        !isFirst && setIsErrorVerifyQuest2(true);
      }
      return res;
    });

  const { mutate: mutateCompleteQuestThree, isLoading: isLoadingQuest3 } =
    useMutation(async ({ isFirst = false }: any) => {
      let resBundle = await api.checkBundleLoyalty();
      if (resBundle && resBundle.check) {
        let res = await api.completeQuestLoyalty({ quest_bundle: true });
        let { status = false, message = "" } = res;
        if (status) {
          dispatchCommon({
            type: _typeReducer.SET_LOYALTY,
            payload: { three: true },
          });
          !isFirst &&
            setToast({
              content: "Verified Successfully",
              error: false,
              active: true,
            });
          setIsErrorVerifyQuest3(false);
          setIsShowQuestThree(false);
        } else {
          !isFirst && setIsErrorVerifyQuest3(true);
        }
        return res;
      } else {
        !isFirst && setIsErrorVerifyQuest3(true);
      }
      return {
        status: false,
      };
    });

  const onNextStep = (step: any) => {
    if (step == 1) {
      if (!questLoyalty.one) {
        mutateCompleteQuestOne();
      } else {
        setIsShowQuestOne(false);
        setIsShowQuestTwo(true);
      }
      return;
    }
    if (step == 2) {
      if (!questLoyalty.two) {
        checkInstallExtension({
          cb: (res: any) => {
            if (res.status) {
              mutateCompleteQuestTwo({ isFirst: false });
            } else {
              openUrl(LINK_CHROME_EXTENSION);
            }
          },
        });
      } else {
        if (!questLoyalty.three && questLoyalty.one) {
          setIsShowQuestTwo(false);
          setIsShowQuestThree(true);
        } else {
          setIsShowQuestTwo(false);
        }
      }
      return;
    }
    if (step == 3) {
      if (questLoyalty.three) {
        setIsShowQuestThree(false);
      } else {
        mutateCompleteQuestThree({ isFirst: false });
      }
      return;
    }
  };

  const onApplyNow = useCallback(() => {
    mutateApply();
    // setToast({content: "Verified Successfully", error: false, active: true})
    // setLocalStorage(`${STORAGE_APPLY_LOYALTY}`, "ms")
    // setIsCardRating(true)
    // setTimeout(() => {
    //   scrollToBottom()
    // }, 300)
  }, []);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const handleEmailValueChange = useCallback(
    (value: string) => setEmailValue(value),
    []
  );

  const checkValidEmail = useCallback((text: string) => {
    if (!text) return false;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(text);
  }, []);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  useEffect(() => {
    let timerCheckExt: any = null;
    if (getLocalStorage(`${STORAGE_APPLY_LOYALTY}`)) {
      dispatchCommon({
        type: _typeReducer.SET_LOYALTY,
        payload: { apply: true },
      });
      // setIsCardRating(true)
    }
    if (!questLoyalty?.two) {
      checkInstallExtension({
        cb: (res: any) => {
          if (res.status) {
            clearInterval(timerCheckExt);
            setIsInstallExt(true);
            mutateCompleteQuestTwo({ isFirst: true });
          } else {
            setIsInstallExt(false);
          }
        },
      });
      timerCheckExt = setInterval(() => {
        checkInstallExtension({
          cb: (res: any) => {
            if (res.status) {
              clearInterval(timerCheckExt);
              setIsInstallExt(true);
              mutateCompleteQuestTwo({ isFirst: true });
            } else {
              setIsInstallExt(false);
            }
          },
        });
      }, 3000);
    }

    if (!questLoyalty?.three) {
      mutateCompleteQuestThree({ isFirst: true });
    }

    return () => {
      clearInterval(timerCheckExt);
    };
  }, []);

  if (!questLoyalty) return null;

  return (
    <Container size="lg">
      <StyledHeader>
        <Image
          root={true}
          src="/images/loyalty.png"
          width="234"
          height="32"
          alt=""
        />
        <Text variant="bodyMd" tone="subdued" as="p">
          {`Joining our loyalty program is completely free. This is where M-Sell expresses our genuine gratitude to customers like you for choosing us between a lot of choices.`}
        </Text>
      </StyledHeader>
      <StyledBenefits complete={questLoyalty.congratulationsStatus}>
        {questLoyalty.congratulationsStatus && (
          <StyledBenefitsHeader>
            <Image
              alt=""
              root={true}
              src={vipImage.src}
              width="98"
              height="110"
            ></Image>
            <div>
              <h2>Congratulations, you are a Loyalty member!</h2>
              <p>{`You've acquired a thorough understanding and have navigated our app like a master. Keep up the great work!`}</p>
            </div>
          </StyledBenefitsHeader>
        )}
        <Card>
          <Text as="h2" variant="headingMd">
            Membership Highlights
          </Text>
          <Box paddingBlockStart="300">
            <StyledBenefitsExceptionList>
              {/* <Text as="h6" variant="bodyMd" color="success" fontWeight="medium">For Premium users</Text> */}
              <div>
                <Icon source={CheckIcon} tone="emphasis"></Icon>
                <Text as="p" variant="bodyMd">
                  Generate tailored product bundles using M-Sell AI
                </Text>
              </div>
              <div>
                <Icon source={CheckIcon} tone="emphasis"></Icon>
                <Text as="p" variant="bodyMd">
                  Publish an unlimited number of product bundles
                </Text>
              </div>
              <div>
                <Icon source={CheckIcon} tone="emphasis"></Icon>
                <Text as="p" variant="bodyMd">
                  Unlock discount when customer purchases bundle
                </Text>
              </div>
              <div>
                <Icon source={CheckIcon} tone="emphasis"></Icon>
                <Text as="p" variant="bodyMd">
                  Unlock advanced customization features for better shopping
                  experience
                </Text>
              </div>
            </StyledBenefitsExceptionList>
          </Box>
        </Card>
      </StyledBenefits>
      {!questLoyalty.congratulationsStatus && (
        <StyledProgress>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 2C10.6989 2 10.8897 2.07902 11.0303 2.21967C11.171 2.36032 11.25 2.55109 11.25 2.75V3.25C11.25 3.44891 11.171 3.63968 11.0303 3.78033C10.8897 3.92098 10.6989 4 10.5 4C10.3011 4 10.1103 3.92098 9.96967 3.78033C9.82902 3.63968 9.75 3.44891 9.75 3.25V2.75C9.75 2.55109 9.82902 2.36032 9.96967 2.21967C10.1103 2.07902 10.3011 2 10.5 2Z"
                  fill="#003D2C"
                />
                <path
                  d="M6.08002 4.16711C5.93784 4.03463 5.7498 3.96251 5.5555 3.96594C5.36119 3.96937 5.17581 4.04808 5.0384 4.18549C4.90098 4.3229 4.82227 4.50829 4.81884 4.70259C4.81541 4.89689 4.88754 5.08494 5.02002 5.22711L5.37302 5.58111C5.44217 5.65278 5.5249 5.70995 5.61638 5.7493C5.70787 5.78865 5.80627 5.80939 5.90586 5.8103C6.00544 5.81121 6.10421 5.79228 6.1964 5.75461C6.28859 5.71695 6.37235 5.6613 6.44281 5.59091C6.51326 5.52052 6.56899 5.43681 6.60674 5.34466C6.6445 5.2525 6.66352 5.15375 6.6627 5.05417C6.66188 4.95458 6.64124 4.85616 6.60198 4.76464C6.56271 4.67312 6.50562 4.59033 6.43402 4.52111L6.08002 4.16711Z"
                  fill="#003D2C"
                />
                <path
                  d="M2.5 9.75C2.5 9.55109 2.57902 9.36032 2.71967 9.21967C2.86032 9.07902 3.05109 9 3.25 9H3.75C3.94891 9 4.13968 9.07902 4.28033 9.21967C4.42098 9.36032 4.5 9.55109 4.5 9.75C4.5 9.94891 4.42098 10.1397 4.28033 10.2803C4.13968 10.421 3.94891 10.5 3.75 10.5H3.25C3.05109 10.5 2.86032 10.421 2.71967 10.2803C2.57902 10.1397 2.5 9.94891 2.5 9.75Z"
                  fill="#003D2C"
                />
                <path
                  d="M16.5 9.75C16.5 9.55109 16.579 9.36032 16.7197 9.21967C16.8603 9.07902 17.0511 9 17.25 9H17.75C17.9489 9 18.1397 9.07902 18.2803 9.21967C18.421 9.36032 18.5 9.55109 18.5 9.75C18.5 9.94891 18.421 10.1397 18.2803 10.2803C18.1397 10.421 17.9489 10.5 17.75 10.5H17.25C17.0511 10.5 16.8603 10.421 16.7197 10.2803C16.579 10.1397 16.5 9.94891 16.5 9.75Z"
                  fill="#003D2C"
                />
                <path
                  d="M16.157 5.40387C16.2895 5.26169 16.3616 5.07365 16.3582 4.87935C16.3547 4.68505 16.276 4.49966 16.1386 4.36225C16.0012 4.22483 15.8158 4.14612 15.6215 4.14269C15.4272 4.13927 15.2392 4.21139 15.097 4.34387L14.743 4.69687C14.6693 4.76553 14.6102 4.84833 14.5692 4.94033C14.5282 5.03233 14.5062 5.13164 14.5044 5.23235C14.5026 5.33305 14.5211 5.43308 14.5589 5.52647C14.5966 5.61986 14.6527 5.70469 14.7239 5.77591C14.7952 5.84713 14.88 5.90327 14.9734 5.94099C15.0668 5.97871 15.1668 5.99724 15.2675 5.99546C15.3682 5.99368 15.4675 5.97164 15.5595 5.93065C15.6515 5.88966 15.7343 5.83056 15.803 5.75687L16.157 5.40387Z"
                  fill="#003D2C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.97398 5.99791C7.90919 5.06288 9.17751 4.5376 10.5 4.5376C11.8224 4.5376 13.0908 5.06288 14.026 5.99791C14.976 6.94791 15.486 8.10091 15.486 9.29591C15.486 10.4899 14.976 11.6439 14.026 12.5929C14.0085 12.6107 13.9908 12.6284 13.973 12.6459C13.5 13.1009 13.25 13.5119 13.25 13.8859V14.9999C13.25 15.663 12.9866 16.2988 12.5177 16.7677C12.0489 17.2365 11.413 17.4999 10.75 17.4999H10.25C9.58694 17.4999 8.95105 17.2365 8.48221 16.7677C8.01337 16.2988 7.74998 15.663 7.74998 14.9999V13.8859C7.74998 13.5119 7.49998 13.1009 7.02798 12.6459C7.00982 12.6284 6.99182 12.6107 6.97398 12.5929C6.02398 11.6429 5.51398 10.4899 5.51398 9.29591C5.51398 8.10091 6.02398 6.94691 6.97398 5.99791ZM12.966 7.05791C12.6422 6.73402 12.2577 6.47709 11.8346 6.3018C11.4115 6.1265 10.958 6.03628 10.5 6.03628C10.042 6.03628 9.58847 6.1265 9.16535 6.3018C8.74223 6.47709 8.35779 6.73402 8.03398 7.05791C7.32898 7.76491 7.01398 8.54991 7.01398 9.29591C7.01398 10.0409 7.32898 10.8259 8.03398 11.5319L8.06798 11.5649C8.43398 11.9179 8.85598 12.4009 9.08298 12.9999H11.917C12.144 12.3999 12.566 11.9179 12.932 11.5649L12.966 11.5319C13.671 10.8259 13.986 10.0409 13.986 9.29591C13.986 8.54991 13.671 7.76391 12.966 7.05791ZM11.75 14.4999H9.24998V14.9999C9.24998 15.2651 9.35533 15.5195 9.54287 15.707C9.73041 15.8946 9.98476 15.9999 10.25 15.9999H10.75C11.0152 15.9999 11.2695 15.8946 11.4571 15.707C11.6446 15.5195 11.75 15.2651 11.75 14.9999V14.4999Z"
                  fill="#008060"
                />
              </svg>
              <Text as="h2" variant="bodyLg" fontWeight="semibold">
                How to become a Loyalty member
              </Text>
            </div>
            <Card>
              <BlockStack gap="400">
                <Box>
                  <div style={{ marginBottom: "4px" }}>
                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                      Loyalty criteria checklist
                    </Text>
                  </div>
                  <InlineStack wrap={false} gap="400">
                    <Text variant="bodyMd" tone="subdued" as="p">
                      {`To earn Loyalty status, you must complete all the quests. Please remember to click on the 'Verify' button, after which our system will check the completion status of each quest.`}
                    </Text>
                    <p style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                      {progress.step} of 3
                    </p>
                  </InlineStack>
                  <StyledProgressBar>
                    <ProgressBar
                      progress={progress.percent}
                      size="small"
                      tone="highlight"
                    />
                  </StyledProgressBar>
                  <StyledSteps>
                    <StyledStep>
                      <StyledStepIcon step="1">
                        <Icon source={LogoIcon}></Icon>
                      </StyledStepIcon>
                      <StyledStepContent
                        status={questLoyalty.one ? "complete" : ""}
                      >
                        <div
                          onClick={() =>
                            setIsShowQuestOne((val: boolean) => !val)
                          }
                        >
                          <Text variant="headingSm" as="h6">
                            Explore app with a qualified store
                          </Text>
                        </div>
                        {(!questLoyalty.one || isShowQuestOne) && (
                          <StyledStepBody>
                            <StyledStepDescription step="1">
                              <Text variant="bodyMd" as="p">
                                {`You need to spend quality time navigating our app features, and ensure that your store maintains good standards, adhering strictly to Shopify policies. We’ll manually verify if you’ve completed this quest after you pass all the automatically checked tasks.`}
                              </Text>
                            </StyledStepDescription>
                          </StyledStepBody>
                        )}
                      </StyledStepContent>
                    </StyledStep>
                    <StyledStep>
                      <StyledStepIcon
                        status={
                          questLoyalty.two
                            ? "complete"
                            : (!questLoyalty.two && questLoyalty.one) ||
                                isShowQuestTwo
                              ? "progress"
                              : ""
                        }
                        step="2"
                      >
                        {questLoyalty.two ? (
                          <Icon source={CheckIcon}></Icon>
                        ) : (
                          <Icon source={AppExtensionIcon}></Icon>
                        )}
                      </StyledStepIcon>
                      <StyledStepContent
                        status={
                          questLoyalty.two || isShowQuestTwo ? "complete" : ""
                        }
                      >
                        <div
                          onClick={() =>
                            setIsShowQuestTwo((val: boolean) => !val)
                          }
                        >
                          <Text variant="headingSm" as="h6">
                            Install and utilize the Chrome extension
                          </Text>
                        </div>
                        {((questLoyalty.one && !questLoyalty.two) ||
                          isShowQuestTwo) && (
                          <StyledStepBody>
                            <StyledStepDescription step="2">
                              <Text variant="bodyMd" as="p">
                                {`You will need our Chrome extension to add product recommendations manually or automatically, creating a personalized bundle. This data syncs with M-Sell AI, enhancing its understanding of your hobbies for better future recommendations.`}
                              </Text>
                              {!questLoyalty.two && (
                                <>
                                  <ButtonGroup>
                                    <Button
                                      size="slim"
                                      icon={AppExtensionIcon}
                                      loading={isLoadingQuest2}
                                      onClick={() => onNextStep(2)}
                                    >
                                      {isInstallExt ? "Verify" : "Install now"}
                                    </Button>
                                  </ButtonGroup>
                                  {isInstallExt && isErrorVerifyQuest2 && (
                                    <StyledInlineError>
                                      <Icon source={AlertTriangleIcon}></Icon>
                                      <strong>Incomplete</strong>
                                      <p>{`– Kindly review the quest, and click 'Verify' to proceed`}</p>
                                    </StyledInlineError>
                                  )}
                                </>
                              )}
                            </StyledStepDescription>
                          </StyledStepBody>
                        )}
                      </StyledStepContent>
                    </StyledStep>
                    <StyledStep>
                      <StyledStepIcon
                        status={
                          questLoyalty.three
                            ? "complete"
                            : (!questLoyalty.three &&
                                  questLoyalty.two &&
                                  questLoyalty.one) ||
                                isShowQuestThree
                              ? "progress"
                              : ""
                        }
                        step="3"
                      >
                        {questLoyalty.three ? (
                          <Icon source={CheckIcon}></Icon>
                        ) : (
                          <Icon source={CursorIcon}></Icon>
                        )}
                      </StyledStepIcon>
                      <StyledStepContent
                        status={
                          questLoyalty.three || isShowQuestThree
                            ? "complete"
                            : ""
                        }
                      >
                        <div
                          onClick={() =>
                            setIsShowQuestThree((val: boolean) => !val)
                          }
                        >
                          <Text variant="headingSm" as="h6">
                            Generate a product bundle
                          </Text>
                        </div>
                        {((questLoyalty.one &&
                          questLoyalty.two &&
                          !questLoyalty.three) ||
                          isShowQuestThree) && (
                          <StyledStepBody>
                            <StyledStepDescription step="3">
                              <Text variant="bodyMd" as="p">
                                {`Product bundles can enhance sales by providing customers with cost savings through discounts, simplifying decision-making, and creating opportunities for cross-selling complementary items. Create a product bundle now, either manually or using M-Sell AI, and witness the magic.`}
                              </Text>
                              {!questLoyalty.three && (
                                <>
                                  <ButtonGroup>
                                    <Button
                                      size="slim"
                                      loading={isLoadingQuest3}
                                      onClick={() => onNextStep(3)}
                                    >
                                      Verify
                                    </Button>
                                    <Button
                                      variant="tertiary"
                                      onClick={() => openChat()}
                                    >
                                      Have trouble, need help
                                    </Button>
                                  </ButtonGroup>
                                  {isErrorVerifyQuest3 && (
                                    <StyledInlineError>
                                      <Icon source={AlertTriangleIcon}></Icon>
                                      <strong>Incomplete</strong>
                                      <div>
                                        {`– Please check `}
                                        <Link
                                          onClick={() =>
                                            openUrl(
                                              LINK_GENERATE_PRODUCT_BUNDLE
                                            )
                                          }
                                        >
                                          this article
                                        </Link>
                                        {` to learn how to generate a bundle. Once you're finished, click 'Verify' to proceed`}
                                      </div>
                                    </StyledInlineError>
                                  )}
                                </>
                              )}
                            </StyledStepDescription>
                          </StyledStepBody>
                        )}
                      </StyledStepContent>
                    </StyledStep>
                    <StyledStepLine></StyledStepLine>
                  </StyledSteps>
                </Box>
                <Box paddingBlockEnd="200">
                  <BlockStack gap="400">
                    <Text variant="bodyLg" as="p" fontWeight="semibold">
                      {!questLoyalty.apply
                        ? !questLoyalty.two || !questLoyalty.three
                          ? `You do not meet the eligibility criteria for the M-Sell Loyalty Program at this time`
                          : `You are now eligible to apply for the M-Sell Loyalty Program`
                        : `Enjoy Loyalty benefits temporarily in 24 hours while we review your store`}
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {!questLoyalty.apply
                        ? !questLoyalty.two || !questLoyalty.three
                          ? `To enroll in the M-Sell Loyalty Program, ensure you've successfully completed both Quest 2 and Quest 3. Refer to your criteria checklist for details on what's required to fulfill each quest.`
                          : `Congratulations! You've met all our automatically-checked criteria. Take the next step to enjoy the perks of being a Loyalty member by applying for entry. We'll promptly confirm your eligibility for this ultimate achievement!`
                        : `Congratulations on taking the first step towards becoming a M-Sell Loyalty member! `}
                    </Text>
                    {questLoyalty?.apply ? (
                      <StyledApplyStatus>
                        <Text variant="bodyMd" as="p">
                          Few things to notes:👇🏻
                        </Text>
                        <ul>
                          <li>
                            <span>1</span>
                            <div>
                              {`During the evaluation process, we're delighted to provide you with temporary access to the benefits of a Loyalty member.`}
                            </div>
                          </li>
                          <li>
                            <span>2</span>
                            <div>
                              {`For a duration of no more than 24 hours, our dedicated Loyalty team will thoroughly assess your store to determine its qualification. If, however, your store does not meet our criteria, your Loyalty status will be revoked.`}
                            </div>
                          </li>
                          <li>
                            <span>3</span>
                            <div>
                              {`Please ensure you monitor your email`} {` `}
                              <strong style={{ fontWeight: "600" }}>
                                {questLoyalty?.email
                                  ? `${questLoyalty?.email}`
                                  : "{email}"}
                              </strong>{" "}
                              {` `}
                              <Popover
                                active={popoverActive}
                                activator={
                                  <span onClick={() => togglePopoverActive()}>
                                    <Icon source={EditIcon}></Icon>
                                  </span>
                                }
                                onClose={togglePopoverActive}
                                ariaHaspopup={false}
                                sectioned
                              >
                                <FormLayout>
                                  <TextField
                                    label="Update new store email"
                                    type="email"
                                    value={emailValue}
                                    onChange={handleEmailValueChange}
                                    prefix={<Icon source={EmailIcon}></Icon>}
                                    clearButton
                                    onClearButtonClick={() =>
                                      handleEmailValueChange("")
                                    }
                                    autoComplete="off"
                                    error={
                                      checkValidEmail(emailValue)
                                        ? ""
                                        : "Store email is invalid"
                                    }
                                    connectedRight={
                                      <Button
                                        disabled={
                                          !checkValidEmail(emailValue) ||
                                          emailValue == store?.email
                                        }
                                        loading={isLoadingUpdateShop}
                                        onClick={() =>
                                          mutationUpdateShop({
                                            email: emailValue,
                                          })
                                        }
                                      >
                                        Save
                                      </Button>
                                    }
                                  />
                                </FormLayout>
                              </Popover>
                              {` `}
                              {`regularly for updates on our review process.`}
                            </div>
                          </li>
                        </ul>
                        <Text variant="bodyMd" as="p">
                          Thank you for your patience and understanding.
                        </Text>
                      </StyledApplyStatus>
                    ) : null}
                    <StyledActionApplyStatus>
                      {!questLoyalty.apply ? (
                        <Button
                          variant="primary"
                          disabled={!questLoyalty.two || !questLoyalty.three}
                          onClick={() => onApplyNow()}
                          loading={isLoadingApply}
                        >
                          Apply now
                        </Button>
                      ) : (
                        <Badge tone="success" icon={CheckCircleIcon}>
                          Applied
                        </Badge>
                      )}
                    </StyledActionApplyStatus>
                  </BlockStack>
                </Box>
              </BlockStack>
            </Card>
            {questLoyalty.apply && (
              <StyledRating ref={bottomEl}>
                <StyledRatingImage>
                  <Image
                    alt=""
                    src={ratingImage.src}
                    width="64"
                    height="64"
                  ></Image>
                </StyledRatingImage>
                <StyledRatingContent>
                  <p>
                    While awaiting the review process, share your experience and
                    contribute to our ongoing improvement efforts
                  </p>
                  <Button variant="primary" onClick={() => openUrl(LINK_RATE)}>
                    Rate us now
                  </Button>
                </StyledRatingContent>
              </StyledRating>
            )}
          </Card>
        </StyledProgress>
      )}

      {toast.active ? (
        <Toast
          content={toast.content}
          error={toast.error}
          onDismiss={toggleActiveToast}
        />
      ) : null}
    </Container>
  );
};

export default LoyaltyPage;
