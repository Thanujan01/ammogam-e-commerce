const axios = require('axios');

// In-memory cache for exchange rates
let cachedRates = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Country code to currency code mapping
const COUNTRY_TO_CURRENCY = {
    'LK': 'LKR', // Sri Lanka
    'IN': 'INR', // India
    'US': 'USD', // USA
    'CA': 'USD', // Canada (uses USD in this context)
    'GB': 'GBP', // United Kingdom
    'AU': 'AUD', // Australia
    'AE': 'AED', // UAE
};

/**
 * Get currency code from country code
 */
const getCurrencyFromCountry = (countryCode) => {
    return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
};

/**
 * Fetch exchange rates from exchangerate.host (FREE - No API key needed)
 */
const fetchExchangeRates = async () => {
    try {
        // Check if cache is still valid
        if (cachedRates && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            console.log('Using cached exchange rates');
            return cachedRates;
        }

        console.log('Fetching fresh exchange rates from exchangerate.host...');

        // Fetch rates with USD as base currency
        const response = await axios.get('https://api.exchangerate.host/latest', {
            params: {
                base: 'USD',
                // Only fetch currencies we need to reduce response size
                symbols: 'LKR,INR,GBP,AUD,AED,USD'
            }
        });

        if (response.data && response.data.rates) {
            cachedRates = response.data.rates;
            cacheTimestamp = Date.now();
            console.log('Exchange rates updated:', cachedRates);
            return cachedRates;
        } else {
            throw new Error('Invalid response from exchange rate API');
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error.message);

        // Return cached rates if available, even if expired
        if (cachedRates) {
            console.log('Using expired cached rates due to API error');
            return cachedRates;
        }

        // Fallback rates if no cache available
        console.log('Using fallback exchange rates');
        return {
            USD: 1,
            LKR: 300,
            INR: 83,
            GBP: 0.79,
            AUD: 1.52,
            AED: 3.67
        };
    }
};

/**
 * Convert amount from USD to target currency
 */
const convertCurrency = async (amountInUSD, targetCurrency) => {
    try {
        const rates = await fetchExchangeRates();

        if (!rates[targetCurrency]) {
            console.warn(`Currency ${targetCurrency} not found, using USD`);
            return amountInUSD;
        }

        const convertedAmount = amountInUSD * rates[targetCurrency];
        return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
    } catch (error) {
        console.error('Error converting currency:', error.message);
        return amountInUSD; // Return original amount on error
    }
};

/**
 * Get all current exchange rates
 */
const getAllRates = async () => {
    return await fetchExchangeRates();
};

/**
 * Clear the cache (useful for testing)
 */
const clearCache = () => {
    cachedRates = null;
    cacheTimestamp = null;
    console.log('Exchange rate cache cleared');
};

module.exports = {
    getCurrencyFromCountry,
    fetchExchangeRates,
    convertCurrency,
    getAllRates,
    clearCache,
    COUNTRY_TO_CURRENCY
};
