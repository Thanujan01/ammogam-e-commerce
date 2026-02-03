// Country code to currency code mapping
export const COUNTRY_TO_CURRENCY: { [key: string]: string } = {
    'LK': 'LKR', // Sri Lanka
    'IN': 'INR', // India
    'US': 'USD', // USA
    'CA': 'USD', // Canada
    'GB': 'GBP', // United Kingdom
    'AU': 'AUD', // Australia
    'AE': 'AED', // UAE
};

// Currency symbols
export const CURRENCY_SYMBOLS: { [key: string]: string } = {
    'USD': '$',
    'LKR': 'Rs',
    'INR': '₹',
    'GBP': '£',
    'AUD': 'A$',
    'AED': 'د.إ',
};

// Currency names
export const CURRENCY_NAMES: { [key: string]: string } = {
    'USD': 'US Dollar',
    'LKR': 'Sri Lankan Rupee',
    'INR': 'Indian Rupee',
    'GBP': 'British Pound',
    'AUD': 'Australian Dollar',
    'AED': 'UAE Dirham',
};

/**
 * Get currency code from country code
 */
export const getCurrencyFromCountry = (countryCode?: string): string => {
    if (!countryCode) return 'USD';
    return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currencyCode: string): string => {
    return CURRENCY_SYMBOLS[currencyCode] || '$';
};

/**
 * Get currency name
 */
export const getCurrencyName = (currencyCode: string): string => {
    return CURRENCY_NAMES[currencyCode] || 'US Dollar';
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (amount: number, currencyCode: string): string => {
    const symbol = getCurrencySymbol(currencyCode);
    const formattedAmount = amount.toFixed(2);

    // For currencies like AED and INR, put symbol after
    if (currencyCode === 'AED') {
        return `${formattedAmount} ${symbol}`;
    }

    // For most currencies, put symbol before
    return `${symbol} ${formattedAmount}`;
};

/**
 * Convert amount using exchange rate
 */
export const convertAmount = (amountInUSD: number, rate: number): number => {
    return Math.round(amountInUSD * rate * 100) / 100;
};
