import { Fragment } from "react";

export default function TemplateAmazon({
  getImage,
  getProductName,
  getPrice,
  getContentTimer,
  settings,
  isVertical,
}: any) {
  return (
    <div className="Msell-BAmazon__Wrap">
      <div className="Msell-BAmazon__Header">
        <div className="Msell-BAmazon__HeaderTitle">
          <h2 className="Msell-BAmazon__Title">{settings.title}</h2>
          {settings.subTitle ? <p>{settings.subTitle}</p> : null}
        </div>
      </div>
      <div className="Msell-BAmazon__Content">
        <div className="Msell-BAmazon__Body">
          <msell-swiper style={{ display: "block", position: "relative" }}>
            <div className="Msell-BAmazon__Thumbnails Msell-Swiper__List">
              {Array.apply(1, Array(isVertical ? 3 : 4)).map(
                (item: any, index: number) => {
                  return (
                    <Fragment key={"Fragment-thumbnail-item-" + index}>
                      <div
                        className={`Msell-BAmazon__Thumbnail Msell-Swiper__Item ${index === 0 || index === 2 ? "Msell-BAmazon__Thumbnail--Active" : ""}`}
                      >
                        <div className={`Msell-BAmazon__ThumbnailWrap`}>
                          <img
                            className="Msell-Media"
                            src={getImage(index)}
                            alt=""
                          />
                        </div>
                        <div className="Msell-Swiper__Separator Msell-BAmazon__Thumbnail-Separator">
                          +
                        </div>
                      </div>
                    </Fragment>
                  );
                }
              )}
            </div>
            <div className="Msell-BAmazon__Buttons Msell-Swiper-Buttons">
              <button
                type="button"
                className="Msell-BAmazon-Button"
                name="previous"
                aria-label="Slide previous"
              >
                <svg aria-hidden="true" focusable="false" viewBox="0 0 10 6">
                  <path
                    fill-rule="evenodd"
                    clipRule="evenodd"
                    d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                  ></path>
                </svg>
              </button>
              <div className="Msell-BAmazon__Counter">
                <span className="Msell-Swiper-Counter--Current">1</span>
                <span aria-hidden="true"> / </span>
                <span className="Msell-Swiper-Counter--Total">2</span>
              </div>
              <button
                type="button"
                className="Msell-BAmazon-Button"
                name="next"
                aria-label="Slide next"
              >
                <svg aria-hidden="true" focusable="false" viewBox="0 0 10 6">
                  <path
                    fill-rule="evenodd"
                    clipRule="evenodd"
                    d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                  ></path>
                </svg>
              </button>
            </div>
          </msell-swiper>
          <div className="Msell-BAmazon__List">
            {Array.apply(1, Array(isVertical ? 3 : 4)).map(
              (item: any, index: number) => {
                return (
                  <Fragment key={"Fragment-product-item-" + index}>
                    <ProductItem
                      index={index}
                      settings={settings}
                      getImage={getImage}
                      getProductName={getProductName}
                      getPrice={getPrice}
                      key={"product-item-" + index}
                    ></ProductItem>
                  </Fragment>
                );
              }
            )}
          </div>
        </div>
        <div className="Msell-BAmazon__Box">
          <div className="Msell-BAmazon__BoxFirst">
            <div dangerouslySetInnerHTML={{ __html: getContentTimer }}></div>
          </div>
          <div className="Msell-BAmazon__BoxSecond">
            <div className="Msell-BAmazon__Info">
              <div className="Msell-BAmazon__Total">
                <div className="Msell-BAmazon__SubTotal">
                  <span className="Msell-Bundle__Badge Msell-Bundle__Discount">
                    {settings.contentSave} 10%
                  </span>
                  <div className="Msell-BAmazon__TotalSale">
                    <span className="Msell-Bundle__TotalDefault Msell-BAmazon__TotalDefault">
                      700.00 USD
                    </span>
                    <span className="Msell-Bundle__TotalRegular Msell-BAmazon__TotalRegular">
                      530.00 USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button className="Msell-Button Msell-Button-AddToCart">
              <span>{settings.contentAddToCartButton}</span>
              <div className="Msell-Spinner">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="Msell-Spinner-Svg"
                  viewBox="0 0 66 66"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="Msell-Spinner-Path"
                    fill="none"
                    stroke-width="6"
                    cx="33"
                    cy="33"
                    r="30"
                  ></circle>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductItem({
  index,
  settings,
  getImage,
  getProductName,
  getPrice,
}: any) {
  let isActive = index === 0 || index === 2 ? true : false;
  return (
    <div className="Msell-BAmazon__Item">
      <div className="Msell-BAmazon__ItemWrap">
        <div className="Msell-BAmazon__ItemCheckbox">
          <div className="Msell-Checkbox">
            <input
              id="Bundle-Checkbox"
              aria-label="Choose product"
              name="Bundle-Checkbox"
              type="checkbox"
              checked={isActive ? true : false}
            />
            <label htmlFor="Bundle-Checkbox">
              <svg viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
                ></path>
              </svg>
            </label>
          </div>
        </div>
        <div className="Msell-BAmazon__ItemMedia">
          <img className="Msell-Media" src={getImage(index)} alt="" />
        </div>
        <div className="Msell-BAmazon__ItemContent">
          <a>{getProductName(index)}</a>
          <div className="Msell-BAmazon__ItemPrice">
            {isActive ? (
              <span className="Msell-Bundle__PriceDiscount Msell-BAmazon__ItemPrice--Discount">
                {settings.contentSave} 10%
              </span>
            ) : null}
            <div className="Msell-BAmazon__ItemSubPrice">
              {isActive ? (
                <span className="Msell-Bundle__PriceDefault Msell-BAmazon__ItemPrice--Default">
                  {getPrice(index, "")}
                </span>
              ) : null}
              <span className="Msell-Bundle__PriceRegular Msell-BAmazon__ItemPrice--Regular">
                {getPrice(index, "discount")}
              </span>
            </div>
          </div>
          <div className="Msell-BAmazon__ItemLast">
            <div className="Msell-BAmazon__ItemVariant Msell-Variant">
              <button type="button" className="Msell-Variant__Button">
                <span>M / Red / Classic</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.71967 8.46967C6.01256 8.17678 6.48744 8.17678 6.78033 8.46967L10.25 11.9393L13.7197 8.46967C14.0126 8.17678 14.4874 8.17678 14.7803 8.46967C15.0732 8.76256 15.0732 9.23744 14.7803 9.53033L10.7803 13.5303C10.4874 13.8232 10.0126 13.8232 9.71967 13.5303L5.71967 9.53033C5.42678 9.23744 5.42678 8.76256 5.71967 8.46967Z"
                  />
                </svg>
              </button>
            </div>
            {settings.useQuantity ? (
              <div className="Msell-Bundle__Quantity">
                <button
                  className="Msell-Bundle__Quantity-Button"
                  name="minus"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 10C6 9.58579 6.33579 9.25 6.75 9.25H13.25C13.6642 9.25 14 9.58579 14 10C14 10.4142 13.6642 10.75 13.25 10.75H6.75C6.33579 10.75 6 10.4142 6 10Z"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  name="quantity"
                  readOnly
                  value="1"
                  min="1"
                  max=""
                />
                <button
                  className="Msell-Bundle__Quantity-Button"
                  name="plus"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.75 6.75C10.75 6.33579 10.4142 6 10 6C9.58579 6 9.25 6.33579 9.25 6.75L9.25 9.25H6.75C6.33579 9.25 6 9.58579 6 10C6 10.4142 6.33579 10.75 6.75 10.75H9.25L9.25 13.25C9.25 13.6642 9.58579 14 10 14C10.4142 14 10.75 13.6642 10.75 13.25V10.75H13.25C13.6642 10.75 14 10.4142 14 10C14 9.58579 13.6642 9.25 13.25 9.25H10.75V6.75Z" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="Msell-BAmazon__Separator">+</div>
    </div>
  );
}
