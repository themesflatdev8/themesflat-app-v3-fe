import { ModalConfirm } from "@/components/core";
import { StyledContainer } from "./styled-components";
import { useEffect, useState } from "react";
import { SaveBar } from "@shopify/app-bridge-react";

type SaveBarProps = {
  isLoading: boolean;
  isSaveBar: boolean;
  isDisabledBtnSave?: boolean;
  isDisabledBtnCancel?: boolean;
  onSave: () => void;
  onDiscard: () => void;
};

const SaveBarAppBridge = (props: SaveBarProps) => {
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const {
    isLoading,
    isSaveBar,
    isDisabledBtnSave = false,
    isDisabledBtnCancel = false,
    onSave,
    onDiscard,
  } = props;

  const handleDiscard = () => {
    onDiscard();
    setIsConfirm(false);
  };

  useEffect(() => {
    if (isSaveBar) {
      shopify.saveBar.show("my-save-bar");
    } else {
      shopify.saveBar.hide("my-save-bar");
    }
  }, [isSaveBar]);

  return (
    <StyledContainer>
      <ModalConfirm
        open={isConfirm}
        title="Discard all unsaved changes"
        content="If you discard changes, you’ll lose any edits you made since you last saved"
        type="warning"
        okText="Discard changes"
        cancelText="Continue editing"
        typeOk="destructive"
        onOk={handleDiscard}
        onCancel={() => setIsConfirm(false)}
        onClose={() => setIsConfirm(false)}
      ></ModalConfirm>

      <SaveBar id="my-save-bar">
        <button
          disabled={isDisabledBtnSave}
          loading={isLoading ? "" : undefined}
          variant="primary"
          onClick={onSave}
        ></button>
        <button
          disabled={isDisabledBtnCancel || isLoading}
          onClick={handleDiscard}
        />
      </SaveBar>
    </StyledContainer>
  );
};

export default SaveBarAppBridge;
