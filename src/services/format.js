// Currency formatting utilities
export const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US', position: 'before' },
  EUR: { symbol: '€', locale: 'de-DE', position: 'after' },
  GBP: { symbol: '£', locale: 'en-GB', position: 'before' },
  JPY: { symbol: '¥', locale: 'ja-JP', position: 'before' },
  CNY: { symbol: '¥', locale: 'zh-CN', position: 'before' },
  INR: { symbol: '₹', locale: 'en-IN', position: 'before' },
  AUD: { symbol: '$', locale: 'en-AU', position: 'before' },
  CAD: { symbol: '$', locale: 'en-CA', position: 'before' },
  CHF: { symbol: 'CHF', locale: 'de-CH', position: 'before' },
  TRY: { symbol: '₺', locale: 'tr-TR', position: 'after' },
};

export const formatCurrency = (amount, currencyCode = 'USD') => {
  try {
    const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
    const formattedNumber = new Intl.NumberFormat(currency.locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return currency.position === 'before' 
      ? `${currency.symbol}${formattedNumber}`
      : `${formattedNumber} ${currency.symbol}`;
  } catch (error) {
    console.warn('Error formatting currency:', error);
    return `${CURRENCIES.USD.symbol}${amount.toFixed(2)}`;
  }
};

export const getCurrencySymbol = (currencyCode = 'USD') => {
  return CURRENCIES[currencyCode]?.symbol || CURRENCIES.USD.symbol;
};

export const getAvailableCurrencies = () => {
  return Object.entries(CURRENCIES).map(([code, details]) => ({
    code,
    symbol: details.symbol,
    label: `${code} (${details.symbol})`,
  }));
};
