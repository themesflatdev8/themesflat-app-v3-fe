import {
  useState,
  useEffect,
  useRef,
} from "react";
import { Text, Card, BlockStack, Box, InlineStack, Icon, Scrollable, TextField, } from "@shopify/polaris";
import { MenuIcon, CartFilledIcon, SearchIcon, ChevronRightIcon } from "@shopify/polaris-icons";
import { Image } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledBadges,
} from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { _queryKey } from "@/constants/react-query";
import { ROOT_CDN } from "@/config/env";

const Preview = ({ form }: any) => {
  const [{ store }]: any = useAuthContext();
  const [widthPreview, setWidthPreview] = useState(0);
  const ref: any = useRef(null);

  const getVariablesStyleSocialMediaButtons = (settings: any) => {
    if (!settings) return "";
    return {
      "--msell-social-media-buttons-display-desktop": settings.desktop.visibility ? "flex" : "none",
      "--msell-social-media-buttons-display-mobile": settings.mobile.visibility ? "flex" : "none",
      "--msell-social-media-buttons-border-radius-desktop": settings.desktop.template == "circle" ? "100%" : "4px",
      "--msell-social-media-buttons-border-radius-mobile": settings.mobile.template == "circle" ? "100%" : "4px",
      "--msell-social-media-buttons-width-desktop": `${settings.desktop.size}px`,
      "--msell-social-media-buttons-width-mobile": `${settings.mobile.size}px`,
      "--msell-social-media-buttons-height-desktop": `${settings.desktop.size}px`,
      "--msell-social-media-buttons-height-mobile":`${settings.mobile.size}px`,
      "--msell-social-media-buttons-left-desktop": settings.desktop.position == "bottom_left" ? `${settings.desktop.position_left + 8}px` : "unset",
      "--msell-social-media-buttons-right-desktop": settings.desktop.position == "bottom_left" ? "unset" : `${settings.desktop.position_right + 8}px`,
      "--msell-social-media-buttons-bottom-desktop": `${settings.desktop.position_bottom + 8}px`,
      "--msell-social-media-buttons-left-mobile": settings.mobile.position == "bottom_left" ? `${settings.mobile.position_left + 8}px` : "unset",
      "--msell-social-media-buttons-right-mobile": settings.mobile.position == "bottom_left" ? "unset" : `${settings.mobile.position_right + 8}px`,
      "--msell-social-media-buttons-bottom-mobile": `${settings.mobile.position_bottom + 8}px`
    };
  }

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
            <Box paddingInline={"400"}>
              <Box paddingBlock={"400"}>
                <InlineStack align='space-between' blockAlign='center'>
                  <Icon source={MenuIcon} />
                  <Text as='span' variant='bodyLg'>
                    THEA BOUTIQUE
                  </Text>
                  <Icon source={CartFilledIcon} />
                </InlineStack>
              </Box>
              <Box paddingBlockEnd={"600"}>
                <TextField
                  label=''
                  labelHidden
                  autoComplete='off'
                  prefix={<Icon source={SearchIcon} />}
                  placeholder='Search product'
                  disabled
                />
              </Box>
              <Box paddingBlockEnd={"400"}>
                <Text as='h1' fontWeight='bold' variant='heading3xl'>
                  Explore the collections
                </Text>
              </Box>
              <Box paddingBlockEnd={"400"}>
                <InlineStack gap='300' blockAlign='center'>
                  <Text as='span' variant='bodyLg'>
                    See all
                  </Text>
                  <Box borderRadius='full' background='bg-fill-hover' padding={"200"}>
                    <Icon source={ChevronRightIcon} />
                  </Box>
                </InlineStack>
              </Box>
              <Scrollable horizontal>
                <InlineStack gap='400' wrap={false}>
                  <Box
                    borderRadius='300'
                    overflowX='hidden'
                    overflowY='hidden'
                    position='relative'
                    minWidth={"275px"}
                    minHeight={"368px"}
                  >
                    <Image
                      src={
                        "https://cdn.shopify.com/s/files/1/0812/3256/0420/files/shop-collection-1.jpg?v=1736958785"
                      }
                      alt='shop-collection-1'
                      width="275"
                      height="368"
                    />
                    <Box
                      position='absolute'
                      insetBlockEnd={"800"}
                      insetInlineStart={"400"}
                      paddingInlineEnd={"3200"}
                    >
                      <Text as='h1' variant='headingLg' tone='text-inverse'>
                        Find your perfect style
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    borderRadius='300'
                    overflowX='hidden'
                    overflowY='hidden'
                    position='relative'
                    minWidth={"275px"}
                    minHeight={"368px"}
                  >
                    <Image
                      src={"https://cdn.trustz.app/assets/images/shop-collection-2.jpg"}
                      alt='shop-collection-2'
                      width="275"
                      height="368"
                    />
                    <Box
                      position='absolute'
                      insetBlockEnd={"800"}
                      insetInlineStart={"400"}
                      paddingInlineEnd={"3200"}
                    >
                      <Text as='h1' variant='headingLg' tone='text-inverse'>
                        New arrivals
                      </Text>
                    </Box>
                  </Box>
                </InlineStack>
              </Scrollable>
              <Box paddingBlockEnd={"400"} paddingBlockStart={"100"}>
                <Text as='h1' fontWeight='bold' variant='heading3xl'>
                  Best Sellers
                </Text>
              </Box>
              <Box paddingBlockEnd={"400"}>
                <InlineStack gap='300' blockAlign='center'>
                  <Text as='span' variant='bodyLg'>
                    See all
                  </Text>
                  <Box borderRadius='full' background='bg-fill-hover' padding={"200"}>
                    <Icon source={ChevronRightIcon} />
                  </Box>
                </InlineStack>
              </Box>
              <Scrollable horizontal>
                <InlineStack gap='400' wrap={false}>
                  <BlockStack gap='400'>
                    <Box
                      borderRadius='200'
                      overflowX='hidden'
                      overflowY='hidden'
                      minWidth={"190px"}
                      minHeight={"190px"}
                    >
                      <Image
                        src={
                          "https://cdn.shopify.com/s/files/1/0812/3256/0420/files/product.png?v=1736957591"
                        }
                        alt='product'
                        width="190"
                        height="190"
                      />
                    </Box>
                    <BlockStack gap={"100"}>
                      <Text as='span' variant='bodyLg'>
                        Sunburst Satchel
                      </Text>
                      <Text as='span' variant='bodyLg' fontWeight='bold'>
                        $ 200
                      </Text>
                    </BlockStack>
                  </BlockStack>
                  <BlockStack gap='400'>
                    <Box
                      borderRadius='200'
                      overflowX='hidden'
                      overflowY='hidden'
                      minWidth={"190px"}
                      minHeight={"190px"}
                    >
                      <Image
                        src={"https://cdn.trustz.app/assets/images/product-1.jpg"}
                        alt='product'
                        width="190"
                        height="190"
                      />
                    </Box>
                    <BlockStack gap={"100"}>
                      <Text as='span' variant='bodyLg'>
                        Calvin Klein Dresses
                      </Text>
                      <Text as='span' variant='bodyLg' fontWeight='bold'>
                        $ 400
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </InlineStack>
              </Scrollable>
            </Box>
          </Card>
        </StyledContent>
      </Card>
      { form?.socials?.length > 0 ? (
        <StyledBadges 
          className="Msell-Social-Media-Buttons"
          style={getVariablesStyleSocialMediaButtons(form)}
          data-style-desktop={form.desktop?.style}
          data-style-mobile={form.mobile?.style}
        >
          { form.socials.map((item: any) => {
            if(!item.link) return null
            return (
              <div key={item.id} className="Msell-Social-Media-Buttons__Item">
                <Image
                  root={false}
                  src={`${ROOT_CDN}/icons/socials/${item.id}-icon.jpg`}
                  width={form.desktop.size}
                  height={form.desktop.size}
                  alt={item.label}
                ></Image>
              </div>
            )
          })}
        </StyledBadges>
      ) : null }
    </StyledContainer>
  );
};

export default Preview;
