import { useCallback } from "react";
import { Text, Link, Icon, InlineGrid, Thumbnail } from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import { StyledContainer, StyledPrice, StyledClose } from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { formatMoney } from "@/utils/shopify";

type Props = {
  data: any;
  onRemove: Function;
};

function Information({ data, onRemove }: Props) {
  const [{ store }]: any = useAuthContext();

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <StyledContainer>
      <Thumbnail
        source={data?.image || "/images/no-img.png"}
        size="large"
        alt="Black choker necklace"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: "1",
        }}
      >
        <InlineGrid columns={1} gap="100">
          <a
            onClick={() =>
              openUrl(
                `https://${store?.shopify_domain}/products/${data.handle}`
              )
            }
            target="_blank"
          >
            {data?.title || "- - -"}
          </a>
          {/* <StyledPrice dangerouslySetInnerHTML={{__html: formatMoney(data?.price, store?.money_format)}}></StyledPrice> */}
        </InlineGrid>
      </div>
      <StyledClose onClick={() => onRemove()}>
        <Icon source={XSmallIcon}></Icon>
      </StyledClose>
    </StyledContainer>
  );
}

export default Information;
