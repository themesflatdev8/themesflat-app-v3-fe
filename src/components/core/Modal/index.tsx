import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { Icon, ButtonGroup, Button } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import {
  StyledModalBody,
  StyledModalHeader,
  StyledModal,
  StyledModalDialog,
  StyledModalContent,
  StyledModalOverlay,
  StyledModalTitle,
  StyledModalContainer,
  StyledModalFooter,
} from "./styled-components";

type ActionProps = {
  content: string;
  onAction: Function;
  disabled?: boolean;
  loading?: boolean;
};

type Props = {
  open: boolean;
  onClose?: Function;
  children: React.ReactNode;
  title?: string;
  width?: string;
  zIndex?: string | number;
  closable?: boolean;
  mask?: boolean;
  className?: string;
  backdrop?: boolean;
  animation?: string;
  primaryAction?: ActionProps | null;
  secondaryAction?: ActionProps | null;
  sectioned?: boolean;
  footerAlign?: string;
  isDestroyClosable?: boolean;
};

const Modal = ({
  open,
  onClose,
  children,
  title,
  width = "500px",
  zIndex = 1000,
  closable = true,
  mask = true,
  className = "",
  backdrop = false,
  animation = "default",
  sectioned = true,
  footerAlign = "right",
  isDestroyClosable = false,
  primaryAction = null,
  secondaryAction = null,
}: Props) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isActive, setIsActive] = useState(open);
  const [classModal, setClassModal] = useState(open ? "modal-open" : "");

  useEffect(() => {
    setIsBrowser(true);
    return () => {
      isDestroyClosable && onClose && onClose();
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    if (isBrowser) {
      if (open) {
        setIsActive(true);
        setClassModal("modal-open");
      } else {
        setClassModal("modal-out");
        setTimeout(() => {
          setIsActive(false);
        }, 500);
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCloseClick = () => {
    onClose && onClose();
  };

  const modalContent = isActive ? (
    <StyledModalContainer
      style={{ zIndex }}
      active={classModal == "modal-open"}
      out={classModal == "modal-out"}
      animation={animation}
    >
      {mask && (
        <StyledModalOverlay
          className="modal-backdrop"
          onClick={() => {
            backdrop && handleCloseClick();
          }}
        ></StyledModalOverlay>
      )}
      <StyledModal className={`modal ${className}`}>
        <StyledModalDialog style={{ maxWidth: width }}>
          <StyledModalContent>
            {closable && (
              <StyledModalHeader>
                <button onClick={() => handleCloseClick()}>
                  <Icon source={XIcon} />
                </button>
              </StyledModalHeader>
            )}

            {title && <StyledModalTitle>{title}</StyledModalTitle>}

            <StyledModalBody style={{ padding: sectioned ? "16px" : "" }}>
              {children}
            </StyledModalBody>
            {(primaryAction || secondaryAction) && (
              <StyledModalFooter
                style={{
                  justifyContent:
                    footerAlign == "center"
                      ? "center"
                      : footerAlign == "left"
                        ? "start"
                        : "end",
                }}
              >
                <ButtonGroup>
                  {secondaryAction && (
                    <Button
                      onClick={() => secondaryAction.onAction()}
                      disabled={secondaryAction.disabled}
                      loading={secondaryAction.loading}
                    >
                      {secondaryAction.content}
                    </Button>
                  )}
                  {primaryAction && (
                    <Button
                      variant="primary"
                      onClick={() => primaryAction.onAction()}
                      disabled={primaryAction.disabled}
                      loading={primaryAction.loading}
                    >
                      {primaryAction.content}
                    </Button>
                  )}
                </ButtonGroup>
              </StyledModalFooter>
            )}
          </StyledModalContent>
        </StyledModalDialog>
      </StyledModal>
    </StyledModalContainer>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      (document as any).getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
