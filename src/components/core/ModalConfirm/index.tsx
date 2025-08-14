import { useState, useCallback, useEffect } from "react";
import { Text, Button } from "@shopify/polaris";
import { Modal } from "@/components/core";
import { StyledModalContent, StyledModalFooter } from "./styled-components";

type Props = {
  open: boolean;
  title: string;
  content: string;
  type?: string;
  cancelText?: string;
  okText?: string;
  typeOk?: string;
  onClose?: Function | null;
  onOk?: Function | null;
  onCancel?: Function | null;
  width?: string;
};

const ModalConfirm = ({
  title,
  content,
  open,
  okText,
  cancelText,
  typeOk = "primary",
  onClose = () => {},
  onOk,
  onCancel,
  width = "620px",
}: Props) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={() => onClose && onClose()}
      width={width}
    >
      <StyledModalContent>
        <Text as="p" variant="bodyMd">
          <span dangerouslySetInnerHTML={{ __html: content }}></span>
        </Text>
      </StyledModalContent>
      <StyledModalFooter>
        {onCancel && (
          <Button onClick={() => onCancel()}>{cancelText || "Cancel"}</Button>
        )}
        {onOk && (
          <Button
            variant="primary"
            tone={typeOk == "destructive" ? "critical" : undefined}
            onClick={() => onOk()}
          >
            {okText || "Remove"}
          </Button>
        )}
      </StyledModalFooter>
    </Modal>
  );
};

export default ModalConfirm;
