import {
  useState,
  useEffect,
  useRef,
  Fragment,
  useMemo,
  useCallback,
} from "react";
import { Text, Select, Box, InlineStack } from "@shopify/polaris";
import { Loading } from "@/components/core";
import {
  StyledContainer,
  StyledHeader,
  StyledContent,
  StyledContentWrapper,
} from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { _queryKey } from "@/constants/react-query";
import productImage1 from "@/features/bundle-customization/assets/product-1.jpg";
import productImage2 from "@/features/bundle-customization/assets/product-4.jpg";
import productImage3 from "@/features/bundle-customization/assets/product-2.jpg";
import productImage4 from "@/features/bundle-customization/assets/product-3.jpg";
import { PAGE_TYPE_CART } from "@/features/product-bundles/constants";
import TemplateSlider from "./TemplateSlider";
import TemplatePopular from "./TemplatePopular";
import TemplateAmazon from "./TemplateAmazon";
import TemplateClassic from "./TemplateClassic";

const Preview = ({ form, type = "customization" }: any) => {
  const [{ store }]: any = useAuthContext();
  const [widthPreview, setWidthPreview] = useState(0);
  const [typePreview, setTypePreview] = useState("horizontal");
  const ref: any = useRef(null);

  const getContentTimer = useMemo(() => {
    let newVal = 30;
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
  }, []);

  const getVariablesStyleBundle: any = useCallback((form: any) => {
    return {
      "--msell-card-background-color": form.cardBackgroundColor,
      "--msell-primary-color": form.primaryColor,
      "--msell-secondary-color": form.secondaryColor,
      "--msell-outstand-color": form.outstandColor,
      "--msell-border-radius": `${form.borderRadius}px`,
      "--msell-border-color": form.borderColor,
      "--msell-image-fit": form.imageFit,
    };
  }, []);

  const getProductName = useCallback((index: number) => {
    if (index == 0) {
      return "Modern Ao Dai";
    }
    if (index == 1) {
      return "Traditional blue dress";
    }
    return "Traditional red dress";
  }, []);

  const getImage = useCallback((index: number) => {
    if (index == 0) {
      return productImage1.src;
    }
    if (index == 1) {
      return productImage2.src;
    }
    if (index == 2) {
      return productImage3.src;
    }
    if (index == 3) {
      return productImage4.src;
    }
    return productImage1.src;
  }, []);

  const getPrice = useCallback((index: number, type = "") => {
    if (index == 0) {
      if (type == "discount") {
        return "180.00 USD";
      }
      return "200.00 USD";
    }
    if (index == 1) {
      if (type == "discount") {
        return "180.00 USD";
      }
      return "200.00 USD";
    }
    if (index == 2) {
      if (type == "discount") {
        return "170.00 USD";
      }
      return "300.00 USD";
    }
    if (type == "discount") {
      return "180.00 USD";
    }
    return "200.0 USD";
  }, []);

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
      <StyledHeader>
        <InlineStack
          gap="200"
          wrap={false}
          align="space-between"
          blockAlign="center"
        >
          <Select
            label="Preview"
            labelInline={true}
            options={[
              { label: "Desktop", value: "horizontal" },
              { label: "Mobile", value: "vertical" },
            ]}
            value={typePreview}
            onChange={(val: any) => setTypePreview(val)}
          ></Select>
        </InlineStack>
      </StyledHeader>
      <StyledContent className="scrollbar">
        <StyledContentWrapper
          isVertical={typePreview == "vertical"}
          type={type}
        >
          {form.template == "1" ? (
            <div
              className={`Msell-Bundle Bundle-BSwiper ${typePreview == "vertical" ? "Msell-BSwiper--Mobile-SM" : "Msell-BSwiper--Desktop"}`}
              style={getVariablesStyleBundle(form)}
            >
              <TemplateSlider
                getImage={getImage}
                getProductName={getProductName}
                getPrice={getPrice}
                getContentTimer={getContentTimer}
                settings={form}
                isVertical={typePreview == "vertical"}
              ></TemplateSlider>
            </div>
          ) : null}
          {form.template == "2" ? (
            <div
              className={`Msell-Bundle Bundle-BPopular ${typePreview == "vertical" ? "Msell-BPopular--Mobile-SM" : "Msell-BPopular--Desktop"}`}
              style={getVariablesStyleBundle(form)}
            >
              <TemplatePopular
                getImage={getImage}
                getProductName={getProductName}
                getPrice={getPrice}
                getContentTimer={getContentTimer}
                settings={form}
                isVertical={typePreview == "vertical"}
              ></TemplatePopular>
            </div>
          ) : null}
          {form.template == "3" ? (
            <div
              className={`Msell-Bundle Bundle-BAmazon ${typePreview == "vertical" ? "Msell-BAmazon--Mobile-SM" : "Msell-BAmazon--Desktop"}`}
              style={getVariablesStyleBundle(form)}
            >
              <TemplateAmazon
                getImage={getImage}
                getProductName={getProductName}
                getPrice={getPrice}
                getContentTimer={getContentTimer}
                settings={form}
                isVertical={typePreview == "vertical"}
              ></TemplateAmazon>
            </div>
          ) : null}
          {form.template == "4" ? (
            <div
              className={`Msell-Bundle Bundle-BClassic ${typePreview == "vertical" ? "Msell-BClassic--Mobile-SM" : "Msell-BClassic--Desktop"}`}
              style={getVariablesStyleBundle(form)}
            >
              <TemplateClassic
                getImage={getImage}
                getProductName={getProductName}
                getPrice={getPrice}
                getContentTimer={getContentTimer}
                settings={form}
                isVertical={typePreview == "vertical"}
              ></TemplateClassic>
            </div>
          ) : null}
        </StyledContentWrapper>
      </StyledContent>
    </StyledContainer>
  );
};

export default Preview;
