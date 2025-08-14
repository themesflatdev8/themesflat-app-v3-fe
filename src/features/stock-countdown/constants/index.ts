export const _settingsDefault = {
  visibility: true,
  strategyType: "all", // "specific_products"
  strategySpecific: [],
  schedule: "no", // specific_date
  scheduleStartDate: "",
  scheduleStartTime: "",
  isScheduleEnDate: false,
  scheduleEnDate: "",
  scheduleEndTime: "",
  condition: "always", // stock_quantity
  conditionStock: 10,
  text: `Only {stock_quantity} left in stock. Hurry up!`,
  template: "default", // comfortable
  backgroundColor: "#D4E3F0",
  borderColor: "#ffffff00",
  textColor: "#111111",
}