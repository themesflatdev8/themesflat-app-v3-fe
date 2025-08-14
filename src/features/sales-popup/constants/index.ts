export const _settingsDefault = {
  visibility: false,
  lastOrders: 7,
  statusDisplayOrder: "all", // open, archived
  text: `{customer_full_name} from {city}, {country_code} bought\n{product_name}\n{time_ago}`,
  placement: "all", // specific
  specificPages: ["index", "product"], // cart, collection, collection_list
  timingFirst: 5,
  timingDelay: 10,
  timingDuration: 5,
  backgroundColor: "#333333",
  borderColor: "#0000001f",
  textColor: "#FFFFFF",
  desktop: {
    visibility: true,
    position: "bottom_left", // bottom_right, top_left, top_right
    positionTop: 20,
    positionBottom: 20,
    positionLeft: 20,
    positionRight: 20,
  },
  mobile: {
    visibility: true,
    position: "top", // bottom
  }
}