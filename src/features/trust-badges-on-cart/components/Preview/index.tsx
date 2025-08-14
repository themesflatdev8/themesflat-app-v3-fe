import {
  useState,
  useEffect,
  useRef,
} from "react";
import { Text, Card, BlockStack } from "@shopify/polaris";
import { Image } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledButtonBuyNow,
  StyledBadges,
  StyledBadgesList,
  StyledBadgesItem,
  StyledCheckout,
  StyledCheckoutTotal,
  StyledCart,
  StyledCartHeader,
  StyledCartSubHeader,
  StyledCartItem,
  StyledCartQuantity,
} from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { _queryKey } from "@/constants/react-query";
import { ROOT_CDN } from "@/config/env";
import productImage1 from "@/features/bundle-customization/assets/product-1.jpg";

const Preview = ({ form }: any) => {
  const [{ store }]: any = useAuthContext();
  const [widthPreview, setWidthPreview] = useState(0);
  const ref: any = useRef(null);

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
            <StyledCheckout>
              <StyledCheckoutTotal>
                <span>Estimated total</span>
                <strong>$187.00 USD</strong>
              </StyledCheckoutTotal>
              <p>Taxes, discounts and shipping calculated at checkout.</p>
              { form.mobile.position == "above" ? (
                <StyledBadges position="above" template={form.template} borderColor={form.borderColor} backgroundColor={form.backgroundColor}>
                  <p style={{fontSize: `${form.headingSize}px`, lineHeight: `${form.headingSize * 1.2}px`, color: form.textColor}}>{form.heading}</p>
                  { form?.icons?.length > 0 ? (
                    <StyledBadgesList>
                      { form.icons.map((item: any) => (
                        <StyledBadgesItem key={item} style={{width: `${form.desktop.size}px`, height: `${form.desktop.size}px`}}>
                          <Image
                            root={false}
                            src={`${ROOT_CDN}/icons/trust/${item}`}
                            width={form.desktop.size}
                            height={form.desktop.size}
                            alt={item}
                          ></Image>
                        </StyledBadgesItem>
                      ))}
                    </StyledBadgesList>
                  ): null }
                </StyledBadges>
              ) : null }
              <StyledButtonBuyNow>
                <span>Checkout</span>
              </StyledButtonBuyNow>
            </StyledCheckout>
            { form.mobile.position == "below" ? (
              <StyledBadges template={form.template} borderColor={form.borderColor} backgroundColor={form.backgroundColor}>
                <p style={{fontSize: `${form.headingSize}px`, lineHeight: `${form.headingSize * 1.2}px`, color: form.textColor}}>{form.heading}</p>
                { form?.icons?.length > 0 ? (
                  <StyledBadgesList>
                    { form.icons.map((item: any) => (
                      <StyledBadgesItem key={item} style={{width: `${form.desktop.size}px`, height: `${form.desktop.size}px`}}>
                        <Image
                          root={false}
                          src={`${ROOT_CDN}/icons/trust/${item}`}
                          width={form.desktop.size}
                          height={form.desktop.size}
                          alt={item}
                        ></Image>
                      </StyledBadgesItem>
                    ))}
                  </StyledBadgesList>
                ): null }
              </StyledBadges>
            ) : null }
          </Card>
        </StyledContent>
      </Card>
    </StyledContainer>
  );
};

export default Preview;
