import { useState } from "react";
import { Button, Badge } from "@shopify/polaris";
import { InfoIcon } from "@shopify/polaris-icons";
import { StyledAnalyze } from "./styled-components";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";

type Props = {};

const Analyze = ({}: Props) => {
  const [modalRequireExtension, setModalRequireExtension] = useState(false);

  return (
    <>
      <StyledAnalyze>
        <Badge tone="warning" icon={InfoIcon}>
          Your theme needs analysis to use this feature
        </Badge>
        <div style={{ marginTop: "12px" }}>
          <Button
            variant="primary"
            size="slim"
            onClick={() => setModalRequireExtension(true)}
          >
            Analyze now
          </Button>
        </div>
      </StyledAnalyze>

      <ModalRequireExtension
        open={modalRequireExtension}
        onClose={() => setModalRequireExtension(false)}
        onCancel={() => setModalRequireExtension(false)}
      ></ModalRequireExtension>
    </>
  );
};

export default Analyze;
