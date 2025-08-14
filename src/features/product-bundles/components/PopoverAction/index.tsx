import { useState, useCallback, useMemo } from "react";
import { Popover, ActionList, Button } from "@shopify/polaris";
import {
  MenuHorizontalIcon,
  DeleteIcon,
  EditIcon,
} from "@shopify/polaris-icons";
import { StyledActivatorActionContainer } from "./styled-components";

type Props = {
  record: any;
  onRemove: Function;
  onPublish: Function;
};
const PopoverAction = ({
  record,
  onRemove = () => {},
  onPublish = () => {},
}: Props) => {
  const [popoverActionActive, setPopoverActionActive] = useState(false);
  // Action
  const togglePopoverActionActive = () => {
    closeAllPopoverOverlay();
    setPopoverActionActive(!popoverActionActive);
  };

  const handlePublish = useCallback(() => {
    const data = {
      isPublish: record.status == 1 ? 0 : 1,
      ids: [record.id],
    };
    onPublish(data);
    setPopoverActionActive(false);
  }, [record]);

  const handleRemove = useCallback(() => {
    onRemove(record.id);
    setPopoverActionActive(false);
  }, [record]);

  const activatorAction = (
    <StyledActivatorActionContainer popoverActive={popoverActionActive}>
      <Button
        dataPrimaryLink
        onClick={togglePopoverActionActive}
        icon={MenuHorizontalIcon}
      ></Button>
    </StyledActivatorActionContainer>
  );

  function closeAllPopoverOverlay() {
    const popoverOverlay = document.querySelectorAll(
      ".Polaris-PositionedOverlay.Polaris-Popover__PopoverOverlay.Polaris-Popover__PopoverOverlay--open"
    );
    [].forEach.call(popoverOverlay, function (popover: any) {
      popover.classList.remove("Polaris-Popover__PopoverOverlay--open");
    });
  }

  return (
    <div>
      <Popover
        active={popoverActionActive}
        activator={activatorAction}
        autofocusTarget="first-node"
        onClose={togglePopoverActionActive}
      >
        <Popover.Pane>
          <ActionList
            actionRole="menuitem"
            sections={[
              {
                items: [
                  {
                    content: record.status == 1 ? "Deactivate" : "Activate",
                    onAction: () => {
                      handlePublish();
                    },
                  },
                  {
                    destructive: true,
                    content: "Delete",
                    onAction: () => {
                      handleRemove();
                    },
                  },
                ],
              },
            ]}
          />
        </Popover.Pane>
      </Popover>
    </div>
  );
};
export default PopoverAction;
