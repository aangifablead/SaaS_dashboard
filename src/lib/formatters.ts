export function formatCurrency(amount: number, defaultCurrencySetting: string = "USD ($)") {
  // Extract the currency code from "USD ($)" -> "USD"
  const match = defaultCurrencySetting.match(/^([A-Z]{3})/);
  const currencyCode = match ? match[1] : "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string | Date, dateFormatSetting: string = "MM/DD/YYYY", timezoneSetting: string = "UTC") {
  const date = new Date(dateStr);
  
  // A naive implementation to respect format strings, though Intl.DateTimeFormat is safer.
  // For simplicity we will manually format based on the known drop-down options:
  // "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"
  
  // Format parts to local timezone if possible
  const tzOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezoneSetting === "UTC" ? "UTC" : undefined, // Browsers handle specific string Timezones best
  };
  
  if (timezoneSetting !== "UTC") {
    tzOptions.timeZone = timezoneSetting;
  }

  let formattedDate = "";
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      ...tzOptions,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    // Formatter usually returns MM/DD/YYYY for en-US
    const parts = formatter.formatToParts(date);
    const mm = parts.find(p => p.type === 'month')?.value || "01";
    const dd = parts.find(p => p.type === 'day')?.value || "01";
    const yyyy = parts.find(p => p.type === 'year')?.value || "2000";

    if (dateFormatSetting === "DD/MM/YYYY") {
      formattedDate = `${dd}/${mm}/${yyyy}`;
    } else if (dateFormatSetting === "YYYY-MM-DD") {
      formattedDate = `${yyyy}-${mm}-${dd}`;
    } else {
      formattedDate = `${mm}/${dd}/${yyyy}`;
    }
  } catch (e) {
    // Fallback if timezone is invalid
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    formattedDate = `${mm}/${dd}/${yyyy}`;
  }

  return formattedDate;
}
