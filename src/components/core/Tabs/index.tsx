import { useState, useEffect, useCallback, startTransition } from "react";
import { Icon } from "@shopify/polaris";
import {
  StyledTabs,
  StyledTabsButtons,
  StyledTabsButton,
  StyledTabsContent,
} from "./styled-components";

type ItemT = {
  id: string;
  label: string;
  destination?: string;
  icon?: any;
  iconActive?: any;
};
type Props = {
  children: React.ReactNode;
  selected?: string | number;
  items?: ItemT[];
  width?: "wide" | "default" | undefined;
  onChange?: Function;
};
const Tabs = ({ items = [], selected, onChange, children, width }: Props) => {
  const selectMenu = (active: any) => {
    startTransition(() => {
      onChange?.(active);
    });
  };

  return (
    <StyledTabs>
      <StyledTabsButtons width={width}>
        {items.map((item: any) => (
          <StyledTabsButton
            width={width}
            key={item.id}
            active={item.id == selected}
            onClick={() => item.id != selected && selectMenu(item.id)}
          >
            <span>{item.label}</span>
          </StyledTabsButton>
        ))}
      </StyledTabsButtons>
      <StyledTabsContent>{children}</StyledTabsContent>
    </StyledTabs>
  );
};

export default Tabs;
