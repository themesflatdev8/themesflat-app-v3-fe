import { useCallback, useState, useMemo } from "react";
import { useAuthContext } from "@/features/auth/contexts";
import { Box, Select, Card } from "@shopify/polaris";
import { StyledContainer } from "./styled-components";
import { Modal } from "@/components/core";
import Preview from "@/features/bundle-customization/components/Preview";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";

type Props = {
  data: any;
  open: boolean;
  onClose: Function;
};

const ModalPreview = ({ open, onClose, data }: Props) => {
  const [{ store }]: any = useAuthContext();

  const [template, setTemplate] = useState("1");

  const form = useMemo(() => {
    if (!data) return null;
    if (template == "3") {
      return data?.themeThree;
    } else if (template == "2") {
      return data?.themeTwo;
    } else {
      return data?.themeOne;
    }
  }, [data, template]);

  return (
    <Modal open={open} title="Preview" width="812px" onClose={() => onClose()}>
      <StyledContainer>
        <Box paddingBlockEnd="400">
          <StyledButtonGroup>
            <StyledButton
              active={"1" == template}
              onClick={() => {
                setTemplate("1");
              }}
            >
              {data?.themeOne?.themeName}
            </StyledButton>
            <StyledButton
              active={"2" == template}
              onClick={() => {
                setTemplate("2");
              }}
            >
              {data?.themeTwo?.themeName}
            </StyledButton>
            <StyledButton
              active={"3" == template}
              onClick={() => {
                setTemplate("3");
              }}
            >
              {data?.themeThree?.themeName}
            </StyledButton>
          </StyledButtonGroup>
        </Box>
        <Card padding="0">
          <Preview form={form} type={"bundle"}></Preview>
        </Card>
      </StyledContainer>
    </Modal>
  );
};
export default ModalPreview;
