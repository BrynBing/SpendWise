import React, { useState, useEffect } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

export default function CurrencyConversion() {
  const [fromCurrency, setFromCurrency] = useState('AUD');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = [
    { code: 'AUD', name: 'Australian Dollars' },
    { code: 'USD', name: 'American Dollars' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound' }
  ];

  // Convert currency when amount, fromCurrency, or toCurrency changes
  useEffect(() => {
    if (amount > 0) {
      convertCurrency();
    } else {
      setConvertedAmount('');
    }
  }, [fromCurrency, toCurrency, amount]);

  const convertCurrency = async () => {
    if (amount <= 0 || !fromCurrency || !toCurrency) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const apiKey = import.meta.env.VITE_UNIRATE_API_KEY;
      const url = `https://api.unirateapi.com/api/convert?api_key=${apiKey}&amount=${amount}&from=${fromCurrency}&to=${toCurrency}&format=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        // Format the result to 4 decimal places
        const formattedResult = Number(data.result).toFixed(4);
        setConvertedAmount(formattedResult);
      } else {
        setError(data.message || 'Currency conversion failed');
        console.error('API Error:', data);
      }
    } catch (err) {
      setError('Failed to connect to currency service');
      console.error('Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value, currencyCode) => {
    if (!value) return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(value);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Currency Conversion</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
        {/* From Currency Section */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">From</label>
          <select 
            className="select select-bordered w-full mb-3 bg-white"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map(currency => (
              <option key={`from-${currency.code}`} value={currency.code}>
                {currency.name}
              </option>
            ))}
          </select>
          
          <div className="relative">
            <input 
              type="number"
              className="input input-bordered w-full pl-4 pr-12"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value !== '' ? Number(e.target.value) : '')}
              min="0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{fromCurrency}</span>
            </div>
          </div>
        </div>
        
        {/* Swap Button */}
        <div className="flex justify-center">
          <button 
            className="btn btn-circle btn-primary shadow-md hover:shadow-lg transition-all"
            onClick={swapCurrencies}
          >
            <FaExchangeAlt className="text-xl" />
          </button>
        </div>
        
        {/* To Currency Section */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">To</label>
          <select 
            className="select select-bordered w-full mb-3 bg-white"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map(currency => (
              <option key={`to-${currency.code}`} value={currency.code}>
                {currency.name}
              </option>
            ))}
          </select>
          
          <div className="relative">
            <input 
              type="text"
              className="input input-bordered w-full pl-4 pr-12 bg-gray-50"
              placeholder="Converted Amount"
              value={
                isLoading ? 'Converting...' : 
                error ? 'Error' : 
                convertedAmount ? formatCurrency(convertedAmount, toCurrency) : ''
              }
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{toCurrency}</span>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-md border border-red-200">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </div>
        )}
        
        {/* Exchange Rate Info */}
        {convertedAmount && !error && (
          <div className="text-sm text-gray-600 text-center">
            <p>
              1 {fromCurrency} = {(convertedAmount / amount).toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
