import {
  Modal,
  InlineStack,
  Checkbox,
  Text,
  ExceptionList,
  Scrollable,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { _downgradePlan } from "@/features/charge/constants";
import {
  StyledModalContainer,
  StyledModalInfo,
  StyledModalInfoHeader,
  StyledModalInfoContent,
  StyledModalInfoHeaderPrice,
  StyledModalInfoHeaderOrder,
} from "./styled-components";
import { useCommonContext } from "@/contexts/common";

type Props = {
  open: boolean;
  onClose: Function;
  onOk?: Function;
  currentPlan?: any;
  newPlan?: any;
};

const ModalDowngradePlan = ({
  open,
  onClose,
  onOk = () => {},
  currentPlan,
  newPlan,
}: Props) => {
  let [{ loyalty }]: any = useCommonContext();

  const [checked, setChecked] = useState(false);

  const handleClose = () => {
    setChecked(false);
    onClose();
  };

  const handleCheckbox = useCallback((value: any) => setChecked(value), []);

  return (
    <StyledModalContainer>
      <Modal
        open={open}
        onClose={handleClose}
        title={`Downgrade to ${newPlan && newPlan.name} plan?`}
        primaryAction={{
          content: "Downgrade",
          onAction: () => onOk(),
          disabled: !checked,
          destructive: true,
        }}
        secondaryActions={[
          {
            content: `Keep ${currentPlan && currentPlan.name} plan`,
            onAction: handleClose,
          },
        ]}
      >
        <Modal.Section>
          <StyledModalInfo>
            <StyledModalInfoHeader>
              <h2>{newPlan?.name || "- - -"}</h2>
              <div>
                <StyledModalInfoHeaderPrice>
                  <i>$</i>
                  <strong>{newPlan?.price || "- - -"}</strong>
                  <Text as="span" variant="bodyMd">
                    monthly
                  </Text>
                </StyledModalInfoHeaderPrice>
                {newPlan?.perOrder && (
                  <StyledModalInfoHeaderOrder>
                    {newPlan?.perOrder || "- - -"}
                  </StyledModalInfoHeaderOrder>
                )}
              </div>
            </StyledModalInfoHeader>
            <StyledModalInfoContent>
              <Text as="p" variant="bodyMd">
                Features no longer available in this plan:
              </Text>
              {currentPlan && newPlan && (
                <Scrollable style={{ height: "140px" }} focusable>
                  <ExceptionList
                    items={
                      _downgradePlan[
                        `${currentPlan.code}_${newPlan.code}${loyalty && loyalty.three ? "_REVIEWED" : ""}`
                      ]
                    }
                  />
                </Scrollable>
              )}
            </StyledModalInfoContent>
          </StyledModalInfo>
          <InlineStack>
            <Checkbox
              checked={checked}
              label="I understand the changes and want to downgrade"
              onChange={handleCheckbox}
            />
          </InlineStack>
        </Modal.Section>
      </Modal>
    </StyledModalContainer>
  );
};

export default ModalDowngradePlan;
