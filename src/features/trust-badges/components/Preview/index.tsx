import {
  useState,
  useEffect,
  useRef,
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
  StyledBadges,
  StyledBadgesList,
  StyledBadgesItem,
} from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { _queryKey } from "@/constants/react-query";
import { ROOT_CDN } from "@/config/env";

const Preview = ({ form }: any) => {
  const [{ store }]: any = useAuthContext();
  const [widthPreview, setWidthPreview] = useState(0);
  const [typePreview, setTypePreview] = useState("horizontal");
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
          </Card>
        </StyledContent>
      </Card>
    </StyledContainer>
  );
};

export default Preview;
