import styled from "styled-components";

export const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  /* height: 100%; */
`;

export const StyledContent = styled.div<any>`
  overflow: auto;
  background: #f7f7f7;
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 8px;
  height: 100%;
`;
export const StyledHeader = styled.div<any>`
  border-bottom: 1px solid #babfc4;
  padding: 12px 16px;
`;

export const StyledBadges = styled.div<any>`
  --msell-social-media-buttons-width: var(--msell-social-media-buttons-width-desktop);
  --msell-social-media-buttons-height: var(--msell-social-media-buttons-height-desktop);
  --msell-social-media-buttons-border-radius: var(--msell-social-media-buttons-border-radius-desktop);
  --msell-social-media-buttons-display: var(--msell-social-media-buttons-display-desktop);
  --msell-social-media-buttons-left: var(--msell-social-media-buttons-left-desktop);
  --msell-social-media-buttons-right: var(--msell-social-media-buttons-right-desktop);
  --msell-social-media-buttons-bottom: var(--msell-social-media-buttons-bottom-desktop);
  @media (max-width: 768px) {
    --msell-social-media-buttons-width: var(--msell-social-media-buttons-width-mobile);
    --msell-social-media-buttons-height: var(--msell-social-media-buttons-height-mobile);
    --msell-social-media-buttons-border-radius: var(--msell-social-media-buttons-border-radius-mobile);
    --msell-social-media-buttons-display: var(--msell-social-media-buttons-display-mobile);
    --msell-social-media-buttons-left: var(--msell-social-media-buttons-left-mobile);
    --msell-social-media-buttons-right: var(--msell-social-media-buttons-right-mobile);
    --msell-social-media-buttons-bottom: var(--msell-social-media-buttons-bottom-mobile);
  }
  position: absolute;
  z-index: 9999;
  bottom: var(--msell-social-media-buttons-bottom);
  left: var(--msell-social-media-buttons-left);
  right: var(--msell-social-media-buttons-right);
  top: unset;
  display: var( --msell-social-media-buttons-display);
  gap: 8px;

  @media screen and (min-width: 768px) {
    &[data-style-desktop='vertical'] {
      flex-direction: column;
    }
  }
  @media only screen and (max-width: 768px) {
    &[data-style-mobile='vertical'] {
      flex-direction: column;
    }
  }

  .Msell-Social-Media-Buttons__Item {
    cursor: pointer;
    width: var(--msell-social-media-buttons-width);
    height: var(--msell-social-media-buttons-height);
    text-decoration: none;
    &:hover{
      text-decoration: none;
    }
    img {
      width: var(--msell-social-media-buttons-width);
      height: var(--msell-social-media-buttons-height);
      border-radius: var(--msell-social-media-buttons-border-radius);
      transition: transform .3s linear;
    }
    &:hover{
      img {
        transform: scale(1.05);
      }
    }
  }
`;