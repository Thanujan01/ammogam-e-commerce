import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/api';
import { AuthContext } from './AuthContext';
import { getCurrencyFromCountry, formatPrice, convertAmount } from '../utils/currencyUtils';

interface ExchangeRates {
    [key: string]: number;
}

interface CurrencyContextType {
    currency: string;
    rates: ExchangeRates;
    loading: boolean;
    convertPrice: (priceInUSD: number) => number;
    formatPrice: (priceInUSD: number) => string;
    getCurrencySymbol: () => string;
    refreshRates: () => Promise<void>;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const auth = useContext(AuthContext);
    const [currency, setCurrency] = useState<string>('USD');
    const [rates, setRates] = useState<ExchangeRates>({ USD: 1 });
    const [loading, setLoading] = useState(true);
    const [lastFetch, setLastFetch] = useState<number>(0);

    // Fetch exchange rates from backend
    const fetchRates = async () => {
        try {
            console.log('Fetching exchange rates...');
            const response = await api.get('/currency/rates');

            if (response.data && response.data.rates) {
                setRates(response.data.rates);
                setLastFetch(Date.now());
                console.log('Exchange rates updated:', response.data.rates);
            }
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
            // Use fallback rates
            setRates({
                USD: 1,
                LKR: 300,
                INR: 83,
                GBP: 0.79,
                AUD: 1.52,
                AED: 3.67
            });
        } finally {
            setLoading(false);
        }
    };

    // Update currency when user changes
    useEffect(() => {
        if (auth?.user?.country) {
            const userCurrency = getCurrencyFromCountry(auth.user.country);
            setCurrency(userCurrency);
            console.log(`User currency set to ${userCurrency} based on country ${auth.user.country}`);
        } else {
            setCurrency('USD');
            console.log('No user country, defaulting to USD');
        }
    }, [auth?.user?.country]);

    // Fetch rates on mount and refresh every hour
    useEffect(() => {
        fetchRates();

        // Refresh rates every hour
        const interval = setInterval(() => {
            const timeSinceLastFetch = Date.now() - lastFetch;
            if (timeSinceLastFetch >= 60 * 60 * 1000) { // 1 hour
                fetchRates();
            }
        }, 60 * 60 * 1000); // Check every hour

        return () => clearInterval(interval);
    }, [lastFetch]);

    // Convert price from USD to user's currency
    const convertPrice = (priceInUSD: number): number => {
        if (currency === 'USD') return priceInUSD;

        const rate = rates[currency];
        if (!rate) {
            console.warn(`No exchange rate found for ${currency}, using USD`);
            return priceInUSD;
        }

        return convertAmount(priceInUSD, rate);
    };

    // Format price with currency symbol
    const formatPriceWithSymbol = (priceInUSD: number): string => {
        const convertedPrice = convertPrice(priceInUSD);
        return formatPrice(convertedPrice, currency);
    };

    // Get currency symbol
    const getCurrencySymbol = (): string => {
        const symbols: { [key: string]: string } = {
            'USD': '$',
            'LKR': 'Rs',
            'INR': '₹',
            'GBP': '£',
            'AUD': 'A$',
            'AED': 'د.إ',
        };
        return symbols[currency] || '$';
    };

    // Refresh rates manually
    const refreshRates = async () => {
        setLoading(true);
        await fetchRates();
    };

    const value: CurrencyContextType = {
        currency,
        rates,
        loading,
        convertPrice,
        formatPrice: formatPriceWithSymbol,
        getCurrencySymbol,
        refreshRates,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

// Custom hook for using currency context
export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
