import { useState, useRef, useMemo, Fragment } from "react";
import { Text, InlineStack, Select } from "@shopify/polaris";
import { Loading } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledContentWrapper,
  StyledInfo,
  StyledQuantity,
  StyledButtonCart,
  StyledButtonBuyNow,
  StyledButtonDenomination,
} from "./styled-components";
import { _queryKey } from "@/constants/react-query";

const Preview = ({
  form,
  type = "customization",
  tiers = null,
  useCountdownTimer = true,
  countdownTimer,
}: any) => {
  const [typePreview, setTypePreview] = useState("vertical");
  const ref: any = useRef(null);

  const isHorizontal = useMemo(() => {
    if (typePreview == "horizontal") {
      return true;
    }
    return false;
  }, [typePreview]);

  const getVariablesStyleBundle: any = useMemo(() => {
    return {
      "--msell-card-background-color": form.cardBackgroundColor,
      "--msell-primary-color": form.primaryColor,
      "--msell-secondary-color": form.secondaryColor,
      "--msell-outstand-color": form.outstandColor,
      "--msell-border-radius": `${form.borderRadius}px`,
      "--msell-border-color": form.borderColor,
      "--msell-image-fit": form.imageFit,
    };
  }, [form]);

  const tiersData = useMemo(() => {
    console.log("tiers", tiers);
    if (tiers) {
      return tiers;
    }
    return [
      {
        id: 1,
        name: "Single",
        salePrice: "$20.00",
        regularPrice: "$20.00",
        message: "",
        quantity: 1,
        discountValue: "",
        useDiscount: false,
      },
      {
        id: 2,
        name: "Duo",
        salePrice: "$40.00",
        regularPrice: "$36.00",
        message: "Buy {quantity} and get a {discount_value} OFF",
        quantity: 2,
        discountValue: "10%",
        useDiscount: true,
        isPopular: true,
      },
      {
        id: 3,
        name: "Trio",
        salePrice: "$60.00",
        regularPrice: "$48.00",
        message: "Buy {quantity} and get a {discount_value} OFF",
        quantity: 3,
        discountValue: "20%",
        useDiscount: true,
      },
    ];
  }, [tiers]);

  const getContentTimer = useMemo(() => {
    let newVal = countdownTimer || 150.59;
    if (!newVal) {
      newVal = 0;
    } else if (newVal <= 0) {
      newVal = 1;
    } else if (newVal > 5999) {
      newVal = 5999;
    }
    let days = Math.floor(newVal / (60 * 24));
    let hours = Math.floor((newVal / 60) % 24);
    let minutes = newVal % 60;
    let hour1 = hours > 9 ? `${hours}`.substring(0, 1) : `0`;
    let hour2 = hours > 9 ? `${hours}`.substring(1) : `${hours}`;
    let minute1 = minutes > 9 ? `${minutes}`.substring(0, 1) : `0`;
    let minute2 = minutes > 9 ? `${minutes}`.substring(1) : `${minutes}`;
    return `
      <div class="Msell-CountdownTimer">
        ${
          days
            ? `
          <div class="Msell-CountdownTimer-Card Msell-CountdownTimer-Days">
            <span>${days} days</span>
          </div>
        `
            : ""
        }
        <div class="Msell-CountdownTimer-Card Msell-CountdownTimer-Hours">
          <div class="Msell-CountdownTimer-FlipCard">
            <div class="Msell-CountdownTimer-Top">${hour1}</div>
            <div class="Msell-CountdownTimer-Bottom">${hour1}</div>
          </div>
          <div class="Msell-CountdownTimer-FlipCard">
            <div class="Msell-CountdownTimer-Top">${hour2}</div>
            <div class="Msell-CountdownTimer-Bottom">${hour2}</div>
          </div>
        </div>
        <div class="Msell-CountdownTimer-Card Msell-CountdownTimer-Minutes">
          <div class="Msell-CountdownTimer-FlipCard">
            <div class="Msell-CountdownTimer-Top">${minute1}</div>
            <div class="Msell-CountdownTimer-Bottom">${minute1}</div>
          </div>
          <div class="Msell-CountdownTimer-FlipCard">
            <div class="Msell-CountdownTimer-Top">${minute2}</div>
            <div class="Msell-CountdownTimer-Bottom">${minute2}</div>
          </div>
        </div>
        <div class="Msell-CountdownTimer-Card Msell-CountdownTimer-Seconds">
          <div class="Msell-CountdownTimer-FlipCard">
            <div class="Msell-CountdownTimer-Top">0</div>
            <div class="Msell-CountdownTimer-Bottom">0</div>
          </div>
          <div class="Msell-CountdownTimer-FlipCard">
            <div class="Msell-CountdownTimer-Top">0</div>
            <div class="Msell-CountdownTimer-Bottom">0</div>
          </div>
        </div>
      </div>
    `;
  }, [countdownTimer]);

  const renderFeature = () => {
    return (
      <div className={`Msell-VD`} style={getVariablesStyleBundle}>
      <div
        className={`Msell-VD__Header ${form.title && useCountdownTimer ? "Msell-VD__Header--multi" : ""}`}
      >
        {form.title ? (
          <span className="Msell-VD__HeaderTitle">{form.title}</span>
        ) : null}
        {useCountdownTimer ? (
          <div className="Msell-VD__CountdownTimer">
            <div
              dangerouslySetInnerHTML={{ __html: getContentTimer }}
            ></div>
          </div>
        ) : null}
      </div>
      <div className="Msell-VD__Content">
        {tiersData.map((item: any, index: number) => {
          return (
            <Fragment key={"Fragment-tier-item-" + index}>
              <TierItem
                index={index}
                tier={item}
                key={"tier-item-" + index}
                form={form}
              ></TierItem>
            </Fragment>
          );
        })}
      </div>
      <div className="Msell-VD__Footer">
        <button className="Msell-Button Msell-Button-AddToCart">
          <span>{form.contentAddToCartButton}</span>
          <div className="Msell-Spinner">
            <svg
              aria-hidden="true"
              focusable="false"
              className="Msell-Spinner-Svg"
              viewBox="0 0 66 66"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="Msell-Spinner-Path"
                fill="none"
                stroke-width="6"
                cx="33"
                cy="33"
                r="30"
              ></circle>
            </svg>
          </div>
        </button>
      </div>
    </div>
    )
  }

  return (
    <StyledContainer ref={ref}>
      <StyledHeader>
        <div>
          <Text as="span" variant="bodyMd">
            Preview
          </Text>
        </div>
      </StyledHeader>
      <StyledContent>
        <StyledContentWrapper type={type}>
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
            { !form.override ? (
              <>
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
                {form.position == "above" ? (
                  <div style={{margin: "20px 0"}}>
                    {renderFeature()}
                  </div>
                ) : null }
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
              </>
            ) : null }
            {form.position == "below" || form.override ? (
              <div style={{marginTop: "20px"}}>
                {renderFeature()}
              </div>
            ) : null }
          </StyledInfo>
        </StyledContentWrapper>
      </StyledContent>
    </StyledContainer>
  );
};

function TierItem({ index, tier, form }: any) {
  return (
    <div
      className={`Msell-VD__Item ${tier.isPopular ? "Msell-VD__Item--Active Msell-VD__Item--popular" : ""}`}
    >
      <div className="Msell-VD__ItemContent">
        <div className="Msell-VD__ItemSelect"></div>
        <div className="Msell-VD__ItemInfo">
          <span className="Msell-VD__ItemName">{tier.name}</span>
          {tier.useDiscount ? (
            <span className="Msell-VD__ItemDiscount--Primary">
              {tier.message
                ?.replaceAll("{quantity}", tier.quantity)
                .replaceAll("{discount_value}", tier.discountValue)}
            </span>
          ) : (
            <span className="Msell-VD__ItemDiscount--Subdued">
              {tier.message}
            </span>
          )}
        </div>
        <div className="Msell-VD__ItemPrice">
          {tier.useDiscount ? (
            <>
              <div className="Msell-VD__ItemPrice-Sale">
                <span className="Msell-VD__PriceDefault Msell-VD__ItemPrice--Default">
                  {tier.salePrice}
                </span>
              </div>
              <span className="Msell-VD__PriceRegular Msell-VD__ItemPrice--Regular">
                {tier.regularPrice}
              </span>
            </>
          ) : (
            <span className="Msell-VD__ItemPrice--Regular">
              {tier.regularPrice}
            </span>
          )}
        </div>
      </div>
      <div className="Msell-VD__ItemVariants"></div>
      {tier.isPopular ? (
        <div className="Msell-VD__Badge">
          <span className="Msell-VD__BadgeIcon">+</span>
          {form.contentMostPopular}
        </div>
      ) : null}
    </div>
  );
}

export default Preview;
