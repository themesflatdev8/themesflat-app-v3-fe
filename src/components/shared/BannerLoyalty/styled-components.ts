import styled from "styled-components";

export const StyledBanner = styled.div`
  /* margin-bottom: 8px; */
  /* margin-top: 32px; */
  .Polaris-CalloutCard__Container {
    border-radius: 8px;
    background: linear-gradient(268deg, #c9d5ff -9.74%, #fff 79.33%);
    box-shadow:
      0px 1px 2px 0px rgba(0, 0, 0, 0.15),
      0px 0px 5px 0px rgba(0, 0, 0, 0.05);
  }
  .Polaris-CalloutCard__Dismiss {
    .Polaris-Button--plain.Polaris-Button--iconOnly svg,
    .Polaris-Button--plain.Polaris-Button--iconOnly:hover svg {
      fill: #000;
    }
  }
  .Polaris-CalloutCard__Title {
    margin-bottom: 8px;
  }
  .Polaris-CalloutCard__Buttons {
    display: none;
    button:not(.Polaris-Button--plain) {
      display: none;
    }
    .Polaris-ButtonGroup__Item--plain:not(:first-child) {
      margin-left: 0;
    }
  }
  .Polaris-CalloutCard__Content {
    .Polaris-Button.Polaris-Button--plain {
      color: #fff;
    }
  }
  img {
    width: 128px;
    margin-right: 0;
  }
`;
