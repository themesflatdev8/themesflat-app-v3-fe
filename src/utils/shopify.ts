export const getPermissionUrl = (
  host: string = "",
  apiKey: string = "",
  redirectUri: string = ""
) => {
  return `https://${host}/admin/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`;
};

export const formatMoney = function (cents: any, format: any = "${{amount}}") {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  // var formatString = (format || this.money_format);

  function defaultOption(opt: any, def: any) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(
    number: any,
    precision: any,
    thousands?: any,
    decimal?: any
  ) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    // number = (number/100.0).toFixed(precision);
    number = number.toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (format.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
    case "amount_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 2, "'", ".");
      break;
  }

  return format.replace(placeholderRegex, value);
};
