import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Text, Card, BlockStack } from "@shopify/polaris";
import { Image } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledButtonBuyNow,
  StyledCheckout,
  StyledCheckoutTotal,
  StyledCart,
  StyledCartHeader,
  StyledCartSubHeader,
  StyledCartItem,
  StyledCartQuantity,
  StyledStorefront,
} from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { _queryKey } from "@/constants/react-query";
import { ROOT_CDN } from "@/config/env";
import productImage1 from "@/features/bundle-customization/assets/product-1.jpg";

const Preview = ({ form }: any) => {
  const [{ store }]: any = useAuthContext();
  const [widthPreview, setWidthPreview] = useState(0);
  const ref: any = useRef(null);

  const getVariablesStyles = (settings: any) => {
    if (!settings) return "";
    return {
      "--msell-countdown-timer-bar-background-color": settings.backgroundColor,
      "--msell-countdown-timer-bar-border-color": settings.borderColor,
      "--msell-countdown-timer-bar-text-color": settings.textColor,
      "--msell-countdown-timer-bar-timer-color": settings.timerColor,
    };
  }

  const renderStorefront = useMemo(() => {
    return (
      <div 
        className="Msell-Countdown-Timer-Bar" 
        data-template={form.template} 
        style={getVariablesStyles(form) as any}
      >
        <div className="Msell-Countdown-Timer-Bar__Icon">
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
          className="Msell-Countdown-Timer-Bar__Content"
          data-template={form.template}
          dangerouslySetInnerHTML={{__html: (form.text || "")?.replaceAll("{timer}", `
            <div class="Msell-Countdown-Timer-Bar__Box">
              <div class="Msell-Countdown-Timer-Bar__Rotor Msell-Countdown-Timer-Bar__Minutes">
                ${form.timer || "00"}
              </div>
              <div class="Msell-Countdown-Timer-Bar__Separator">
              :
              </div>
              <div class="Msell-Countdown-Timer-Bar__Rotor Msell-Countdown-Timer-Bar__Seconds">
                00
              </div>
            </div>  
          `)}}
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
            <StyledCart>
              <StyledCartHeader>
                <h3>Your cart</h3>
                <a>Continue shopping</a>
              </StyledCartHeader>
              <StyledCartSubHeader>
                <span>PRODUCT</span>
                <span>TOTAL</span>
              </StyledCartSubHeader>
              { form.position == "top" ? (
                <StyledStorefront>
                  {renderStorefront}
                </StyledStorefront>
              ) : null }
              <StyledCartItem>
                <img className="ft-img" src={productImage1.src} alt="" />
                <div>
                  <a>Priya Loose Dress</a>
                  <p>Color: Green tea</p>
                  <div>
                    <StyledCartQuantity>
                      <button name="minus" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                          className="icon icon-minus"
                          viewBox="0 0 10 2"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z"
                          ></path>
                        </svg>
                      </button>
                      <input
                        type="number"
                        readOnly
                        defaultValue={1}
                        min="1"
                      />
                      <button name="plus" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                          className="icon icon-plus"
                          viewBox="0 0 10 10"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z"
                          ></path>
                        </svg>
                      </button>
                    </StyledCartQuantity>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.47 5.5H17C17.1326 5.5 17.2598 5.55268 17.3536 5.64645C17.4473 5.74021 17.5 5.86739 17.5 6C17.5 6.13261 17.4473 6.25979 17.3536 6.35355C17.2598 6.44732 17.1326 6.5 17 6.5H15.75V16.5C15.75 16.6326 15.6973 16.7598 15.6036 16.8536C15.5098 16.9473 15.3826 17 15.25 17H6.75C6.47 17 6.25 16.78 6.25 16.5V6.5H5C4.86739 6.5 4.74021 6.44732 4.64645 6.35355C4.55268 6.25979 4.5 6.13261 4.5 6C4.5 5.86739 4.55268 5.74021 4.64645 5.64645C4.74021 5.55268 4.86739 5.5 5 5.5H8.53C8.56454 4.9032 8.77312 4.32958 9.13 3.85C9.56 3.32 10.2 3 11 3C11.8 3 12.44 3.32 12.87 3.85C13.2264 4.32986 13.4349 4.90332 13.47 5.5ZM11 4C10.49 4 10.14 4.19 9.91 4.48C9.72 4.72 9.6 5.08 9.55 5.5H12.45C12.39 5.08 12.29 4.72 12.09 4.48C11.85 4.19 11.51 4 11 4ZM7.25 6.5V16H14.75V6.5H7.25ZM9.19643 7.89645C9.2902 7.80268 9.41738 7.75 9.54999 7.75C9.6826 7.75 9.80977 7.80268 9.90354 7.89645C9.99731 7.99021 10.05 8.11739 10.05 8.25V14.25C10.05 14.3826 9.99731 14.5098 9.90354 14.6036C9.80977 14.6973 9.6826 14.75 9.54999 14.75C9.41738 14.75 9.2902 14.6973 9.19643 14.6036C9.10267 14.5098 9.04999 14.3826 9.04999 14.25V8.25C9.04999 8.11739 9.10267 7.99021 9.19643 7.89645ZM12.0964 7.89645C12.1902 7.80268 12.3174 7.75 12.45 7.75C12.5826 7.75 12.7098 7.80268 12.8035 7.89645C12.8973 7.99021 12.95 8.11739 12.95 8.25V14.25C12.95 14.3826 12.8973 14.5098 12.8035 14.6036C12.7098 14.6973 12.5826 14.75 12.45 14.75C12.3174 14.75 12.1902 14.6973 12.0964 14.6036C12.0027 14.5098 11.95 14.3826 11.95 14.25V8.25C11.95 8.11739 12.0027 7.99021 12.0964 7.89645Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </div>
                <span>$187.00</span>
              </StyledCartItem>
            </StyledCart>
            { form.position == "bottom" ? (
              <StyledStorefront>
                {renderStorefront}
              </StyledStorefront>
            ) : null }
            <StyledCheckout>
              <StyledCheckoutTotal>
                <span>Estimated total</span>
                <strong>$187.00 USD</strong>
              </StyledCheckoutTotal>
              <p>Taxes, discounts and shipping calculated at checkout.</p>
              <StyledButtonBuyNow>
                <span>Checkout</span>
              </StyledButtonBuyNow>
            </StyledCheckout>
          </Card>
        </StyledContent>
      </Card>
    </StyledContainer>
  );
};

export default Preview;
