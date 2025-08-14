import React, { useMemo } from "react";
import { SkeletonContainer } from "./styled-components";
import {
  SkeletonBodyText,
  IndexTable,
  SkeletonDisplayText,
} from "@shopify/polaris";
import { Switch } from "@/components/core";

const PriceSuggestionSkeletonTable = ({
  lines = 8,
  isCheckBox = true,
}: any) => {
  const rowMarkup = Array(lines)
    .fill(null)
    .map((_, i) => i)
    .map((item: any, index: number) => (
      <IndexTable.Row id={item} key={item} position={index} disabled={true}>
        <IndexTable.Cell className="skeletion-table__name">
          <div>
            <SkeletonBodyText lines={1} />
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell className="skeletion-table__status">
          <div>
            <SkeletonBodyText lines={1} />
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell className="skeletion-table__market">
          <div>
            <SkeletonBodyText lines={1} />
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "50px", marginTop: "8px" }}>
              <SkeletonDisplayText size="small" />
            </div>
            <div style={{ width: "50px", marginTop: "8px", marginLeft: "8px" }}>
              <SkeletonDisplayText size="small" />
            </div>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ));

  const getHeadings: any = useMemo(() => {
    return [
      {
        id: "skeleton-1",
        title: (
          <div style={{ width: "150px", marginTop: "8px" }}>
            <SkeletonBodyText lines={1} />
          </div>
        ),
      },
      {
        id: "skeleton-2",
        title: (
          <div style={{ width: "80px", marginTop: "8px" }}>
            <SkeletonBodyText lines={1} />
          </div>
        ),
      },
      {
        id: "skeleton-3",
        title: (
          <div style={{ width: "80px", marginTop: "8px" }}>
            <SkeletonBodyText lines={1} />
          </div>
        ),
      },
      {
        id: "skeleton-4",
        title: (
          <div style={{ width: "80px", marginTop: "8px" }}>
            <SkeletonBodyText lines={1} />
          </div>
        ),
      },
    ];
  }, [isCheckBox]);

  return (
    <SkeletonContainer className="animation--skeleton">
      <IndexTable
        itemCount={lines}
        hasMoreItems
        headings={getHeadings}
        selectable={isCheckBox}
      >
        {rowMarkup}
      </IndexTable>
    </SkeletonContainer>
  );
};

export default PriceSuggestionSkeletonTable;
