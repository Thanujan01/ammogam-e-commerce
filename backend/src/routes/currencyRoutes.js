const express = require('express');
const router = express.Router();
const { getAllRates, convertCurrency, getCurrencyFromCountry } = require('../services/currencyService');

/**
 * GET /api/currency/rates
 * Get current exchange rates (USD as base)
 */
router.get('/rates', async (req, res) => {
    try {
        const rates = await getAllRates();
        res.json({
            success: true,
            base: 'USD',
            rates,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error fetching rates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exchange rates',
            error: error.message
        });
    }
});

/**
 * POST /api/currency/convert
 * Convert amount from USD to target currency
 * Body: { amount: number, targetCurrency: string }
 */
router.post('/convert', async (req, res) => {
    try {
        const { amount, targetCurrency } = req.body;

        if (!amount || !targetCurrency) {
            return res.status(400).json({
                success: false,
                message: 'Amount and targetCurrency are required'
            });
        }

        const convertedAmount = await convertCurrency(parseFloat(amount), targetCurrency);

        res.json({
            success: true,
            originalAmount: parseFloat(amount),
            originalCurrency: 'USD',
            convertedAmount,
            targetCurrency,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error converting currency:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to convert currency',
            error: error.message
        });
    }
});

/**
 * GET /api/currency/country/:countryCode
 * Get currency code for a country
 */
router.get('/country/:countryCode', (req, res) => {
    try {
        const { countryCode } = req.params;
        const currency = getCurrencyFromCountry(countryCode);

        res.json({
            success: true,
            countryCode,
            currency
        });
    } catch (error) {
        console.error('Error getting currency for country:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get currency',
            error: error.message
        });
    }
});

module.exports = router;
