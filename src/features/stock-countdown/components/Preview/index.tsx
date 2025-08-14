import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Text, Select, Card, InlineStack, BlockStack } from "@shopify/polaris";
import { Image } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledImage,
  StyledInfo,
  StyledQuantity,
  StyledButtonCart,
  StyledButtonBuyNow,
  StyledButtonDenomination,
  StyledStorefront,
} from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { _queryKey } from "@/constants/react-query";
import { ROOT_CDN } from "@/config/env";

const Preview = ({ form }: any) => {
  const [{ store }]: any = useAuthContext();
  const [widthPreview, setWidthPreview] = useState(0);
  const ref: any = useRef(null);

  const getVariablesStyles = (settings: any) => {
    if (!settings) return "";
    return {
      "--msell-stock-countdown-background-color": settings.backgroundColor,
      "--msell-stock-countdown-border-color": settings.borderColor,
      "--msell-stock-countdown-text-color": settings.textColor,
    };
  }

  const renderStorefront = useMemo(() => {
    return (
      <div 
        className="Msell-Stock-Countdown" 
        data-template={form.template} 
        style={getVariablesStyles(form) as any}
      >
        <div className="Msell-Stock-Countdown__Icon">
          {form.template == "default" ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.4999 13.0999C4.4122 13.0999 1.8999 10.5876 1.8999 7.4999C1.8999 4.4122 4.4122 1.8999 7.4999 1.8999C10.5876 1.8999 13.0999 4.4122 13.0999 7.4999C13.0999 10.5876 10.5876 13.0999 7.4999 13.0999ZM9.105 9.805C8.9258 9.805 8.7466 9.7364 8.6101 9.5999L7.005 7.9948C6.8734 7.8639 6.7999 7.6854 6.7999 7.4999V4.6999C6.7999 4.3135 7.1128 3.9999 7.4999 3.9999C7.887 3.9999 8.1999 4.3135 8.1999 4.6999V7.2101L9.5999 8.6101C9.8736 8.8838 9.8736 9.3262 9.5999 9.5999C9.4634 9.7364 9.2842 9.805 9.105 9.805Z"
              />
            </svg>
          : 
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
              <g clipPath="url(#clip0_64652_5317)">
                <path
                  d="M38.5077 14.7074H38.7077L41.5092 11.9059L38.7077 9.10444L35.7062 12.106C32.8559 10.154 29.5447 8.98128 26.1012 8.7042V4.50202H30.1033V0.5H18.0971V4.50211H22.0991V8.70429C18.6555 8.98138 15.3444 10.154 12.4941 12.1061L9.49254 9.10453L6.69114 11.9059L9.49263 14.7074C1.88096 22.7197 2.20578 35.3854 10.2181 42.9971C18.2304 50.6088 30.8961 50.2841 38.5078 42.2717C45.8448 34.5484 45.8448 22.4307 38.5077 14.7074ZM24.1002 44.5228C15.259 44.5228 8.09184 37.3557 8.09184 28.5145C8.09184 19.6733 15.259 12.5062 24.1002 12.5062C32.9414 12.5062 40.1084 19.6734 40.1084 28.5146C40.1084 37.3558 32.9413 44.5228 24.1002 44.5228Z"
                  fillOpacity="0.7"
                />
                <path
                  d="M24.1003 14.5073C16.3642 14.5073 10.093 20.7786 10.093 28.5146C10.093 36.2505 16.3642 42.5219 24.1003 42.5219C31.8363 42.5219 38.1075 36.2506 38.1075 28.5147C38.1075 20.7787 31.8362 14.5073 24.1003 14.5073ZM25.9012 30.1154C24.9618 31.0548 23.4388 31.0548 22.4994 30.1154C21.56 29.176 21.56 27.653 22.4994 26.7136L32.1044 20.5104L25.9012 30.1154Z"
                  fillOpacity="0.7"
                />
              </g>
            </svg>
          }
        </div>
        <div 
          className="Msell-Stock-Countdown__Content" 
          dangerouslySetInnerHTML={{__html: (form.text || "")?.replaceAll("{stock_quantity}", `<strong>100</strong>`)}}
        ></div>
      </div> 
    )
  }, [form])

  useEffect(() => {
    const onResize = () => {
      setWidthPreview(ref.current?.offsetWidth || 0);
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <StyledContainer ref={ref}>
      <Card padding="0">
        <StyledHeader>
          <BlockStack
            gap="100"
          >
            <Text as="h3" variant="headingMd">Preview</Text>
          </BlockStack>
        </StyledHeader>
        <StyledContent className="scrollbar">
          <Card>
            {/* <StyledImage>
              <Image
                root={true}
                src="/images/gift-card-default-1.png"
                alt=""
                fill
              />
            </StyledImage> */}
            <StyledInfo>
              <span
                style={{
                  fontSize: "13px",
                  color: "#121212",
                  fontWeight: "400",
                  lineHeight: "17px",
                  opacity: 0.7,
                }}
              >
                YOUR STORE
              </span>
              <h2
                style={{
                  fontSize: "30px",
                  color: "#121212",
                  fontWeight: "400",
                  lineHeight: "39px",
                  margin: "0px 0 16px",
                }}
              >
                Product name
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: "#121212",
                  fontWeight: "400",
                  lineHeight: "22px",
                }}
              >
                $100.00 USD
              </p>
              <div style={{ marginTop: "16px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#121212",
                    fontWeight: "400",
                    lineHeight: "17px",
                    marginBottom: "6px",
                    opacity: 0.8,
                  }}
                >
                  Denominations
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <StyledButtonDenomination>
                    Denominations 1
                  </StyledButtonDenomination>
                  <StyledButtonDenomination>
                    Denominations 2
                  </StyledButtonDenomination>
                  <StyledButtonDenomination>
                    Denominations 3
                  </StyledButtonDenomination>
                  <StyledButtonDenomination>
                    Denominations 4
                  </StyledButtonDenomination>
                </div>
              </div>
              <StyledQuantity>
                <label>Quantity</label>
                <div>
                  <button name="minus" type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                      className="icon icon-minus"
                      fill="none"
                      viewBox="0 0 10 2"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                  <input type="number" defaultValue="1" name="quantity" min="1" />
                  <button name="plus" type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                      className="icon icon-plus"
                      fill="none"
                      viewBox="0 0 10 10"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </div>
              </StyledQuantity>
              <StyledStorefront>
                {renderStorefront}
              </StyledStorefront>
              <div>
                <StyledButtonCart
                  type="button"
                >
                 <span>Add to card</span>
                </StyledButtonCart> 
                <StyledButtonBuyNow>
                  <span>Buy it now</span>
                </StyledButtonBuyNow>
              </div>
            </StyledInfo>
          </Card>
        </StyledContent>
      </Card>
    </StyledContainer>
  );
};

export default Preview;
