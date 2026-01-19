import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaStore, FaBuilding, FaPhone, FaCheck, FaTimes, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '../../api/api';

interface SellerRegisterFormProps {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

// Country data with name, code, dial code, flag, and example number
const countries = [
    { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰', example: '7458695211', digits: 9 },
    { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', example: '9876543210', digits: 10 },
    { name: 'USA/Canada', code: 'US', dialCode: '+1', flag: '🇺🇸', example: '4112336985', digits: 10 },
    { name: 'UK', code: 'GB', dialCode: '+44', flag: '🇬🇧', example: '2079460958', digits: 10 },
    { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', example: '412345678', digits: 9 },
    { name: 'UAE', code: 'AE', dialCode: '+971', flag: '🇦🇪', example: '501234567', digits: 9 },
];

export default function SellerRegisterForm({ onSuccess, onError }: SellerRegisterFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to Sri Lanka
    const [localPhone, setLocalPhone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [city, setCity] = useState('');
    const [localBusinessPhone, setLocalBusinessPhone] = useState('');
    const [taxId, setTaxId] = useState('');

    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [touched, setTouched] = useState<{[key: string]: boolean}>({});
    
    const nav = useNavigate();

    // Validation functions
    const validateName = (value: string) => {
        if (!value.trim()) return 'Owner name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        
        // Check if name starts with space
        if (value.startsWith(' ')) return 'Name should not start with a space';
        
        // Check if name contains only letters and spaces
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(value)) return 'Name can only contain letters and spaces';
        
        return '';
    };

    const validateEmail = (value: string) => {
        if (!value) return 'Email is required';
        
        // Check if email starts with space
        if (value.startsWith(' ')) return 'Email should not start with a space';
        
        // Check if email contains spaces anywhere
        if (/\s/.test(value)) return 'Email should not contain any spaces';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
    };

    const validatePhone = (value: string) => {
        if (!value) return 'Phone number is required';
        
        // Remove any non-digit characters
        const digitsOnly = value.replace(/\D/g, '');
        
        // Check if it has the correct number of digits for the selected country
        if (digitsOnly.length !== selectedCountry.digits) {
            return `${selectedCountry.name} numbers should be ${selectedCountry.digits} digits`;
        }
        
        // Country-specific validation
        switch (selectedCountry.code) {
            case 'LK': // Sri Lanka
                if (!/^[1-9][0-9]{8}$/.test(digitsOnly)) return 'Invalid Sri Lankan phone number';
                break;
            case 'IN': // India
                if (!/^[6-9][0-9]{9}$/.test(digitsOnly)) return 'Invalid Indian phone number';
                break;
            case 'US': // USA/Canada
                if (!/^[2-9][0-9]{9}$/.test(digitsOnly)) return 'Invalid US/Canada phone number';
                break;
            case 'GB': // UK
                if (!/^[1-9][0-9]{9}$/.test(digitsOnly)) return 'Invalid UK phone number';
                break;
            default:
                // Basic validation for other countries
                if (!/^[0-9]+$/.test(digitsOnly)) return 'Phone number should contain only digits';
        }
        
        return '';
    };

    const validateBusinessName = (value: string) => {
        if (!value.trim()) return 'Business name is required';
        if (value.trim().length < 2) return 'Business name must be at least 2 characters';
        
        // Check if business name starts with space
        if (value.startsWith(' ')) return 'Business name should not start with a space';
        
        // Check if business name contains only letters, numbers, underscores, and spaces
        const businessNameRegex = /^[A-Za-z0-9_\s]+$/;
        if (!businessNameRegex.test(value)) return 'Business name can only contain letters, numbers, underscores, and spaces';
        
        return '';
    };

    const validateBusinessAddress = (value: string) => {
        if (!value.trim()) return 'Business address is required';
        if (value.trim().length < 10) return 'Please provide a complete address';
        return '';
    };

    const validateCity = (value: string) => {
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City must be at least 2 characters';
        
        // Check if city starts with space
        if (value.startsWith(' ')) return 'City should not start with a space';
        
        // Check if city contains only letters, numbers, and spaces
        const cityRegex = /^[A-Za-z0-9\s]+$/;
        if (!cityRegex.test(value)) return 'City can only contain letters, numbers, and spaces';
        
        return '';
    };

    const validateBusinessPhone = (value: string) => {
        if (!value) return 'Business phone number is required';
        
        // Remove any non-digit characters
        const digitsOnly = value.replace(/\D/g, '');
        
        // Check if it has the correct number of digits for the selected country
        if (digitsOnly.length !== selectedCountry.digits) {
            return `${selectedCountry.name} business numbers should be ${selectedCountry.digits} digits`;
        }
        
        // Country-specific validation
        switch (selectedCountry.code) {
            case 'LK': // Sri Lanka
                if (!/^[1-9][0-9]{8}$/.test(digitsOnly)) return 'Invalid Sri Lankan business number';
                break;
            case 'IN': // India
                if (!/^[6-9][0-9]{9}$/.test(digitsOnly)) return 'Invalid Indian business number';
                break;
            case 'US': // USA/Canada
                if (!/^[2-9][0-9]{9}$/.test(digitsOnly)) return 'Invalid US/Canada business number';
                break;
            case 'GB': // UK
                if (!/^[1-9][0-9]{9}$/.test(digitsOnly)) return 'Invalid UK business number';
                break;
            default:
                // Basic validation for other countries
                if (!/^[0-9]+$/.test(digitsOnly)) return 'Business phone should contain only digits';
        }
        
        return '';
    };

    const validateTaxId = (value: string) => {
        if (!value.trim()) return 'Business registration number is required';
        if (value.trim().length < 5) return 'Registration number is too short';
        return '';
    };

    // Handle field blur
    const handleBlur = (field: string) => {
        setTouched({...touched, [field]: true});
        validateField(field);
    };

    // Validate single field
    const validateField = (field: string) => {
        let error = '';
        
        switch (field) {
            case 'name':
                error = validateName(name);
                break;
            case 'email':
                error = validateEmail(email);
                break;
            case 'phone':
                error = validatePhone(localPhone);
                break;
            case 'businessName':
                error = validateBusinessName(businessName);
                break;
            case 'businessAddress':
                error = validateBusinessAddress(businessAddress);
                break;
            case 'city':
                error = validateCity(city);
                break;
            case 'businessPhone':
                error = validateBusinessPhone(localBusinessPhone);
                break;
            case 'taxId':
                error = validateTaxId(taxId);
                break;
        }
        
        setErrors({...errors, [field]: error});
        return error === '';
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            phone: validatePhone(localPhone),
            businessName: validateBusinessName(businessName),
            businessAddress: validateBusinessAddress(businessAddress),
            city: validateCity(city),
            businessPhone: validateBusinessPhone(localBusinessPhone),
            taxId: validateTaxId(taxId)
        };
        
        setErrors(newErrors);
        setTouched({
            name: true,
            email: true,
            phone: true,
            businessName: true,
            businessAddress: true,
            city: true,
            businessPhone: true,
            taxId: true
        });
        
        return !Object.values(newErrors).some(error => error);
    };

    // Format phone number as user types
    const handlePhoneChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        // Limit to the country's digit length
        const limitedDigits = digits.slice(0, selectedCountry.digits);
        setter(limitedDigits);
    };

    // Handle name change - prevent non-letter characters except spaces
    const handleNameChange = (value: string) => {
        // Only allow letters and spaces
        const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
        setName(filteredValue);
    };

    // Handle business name change - allow letters, numbers, underscores, and spaces
    const handleBusinessNameChange = (value: string) => {
        // Allow letters, numbers, underscores, and spaces
        const filteredValue = value.replace(/[^A-Za-z0-9_\s]/g, '');
        setBusinessName(filteredValue);
    };

    // Handle city change - allow letters, numbers, and spaces
    const handleCityChange = (value: string) => {
        // Allow letters, numbers, and spaces
        const filteredValue = value.replace(/[^A-Za-z0-9\s]/g, '');
        setCity(filteredValue);
    };

    // Handle email change - prevent ANY spaces in email
    // const handleEmailChange = (value: string) => {
    //     // Remove ALL spaces from email
    //     const noSpacesValue = value.replace(/\s/g, '');
    //     setEmail(noSpacesValue);
    // };

    // Handle country selection
    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country);
        setShowCountryDropdown(false);
        // Clear phone validation when country changes
        setErrors({...errors, phone: '', businessPhone: ''});
        setLocalPhone(''); // Clear phone numbers when country changes
        setLocalBusinessPhone('');
        setCity(''); // Clear city when country changes
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (onSuccess) onSuccess('');
        if (onError) onError('');

        // Validate all fields
        if (!validateForm()) {
            if (onError) onError('Please fix the errors in the form');
            return;
        }

        if (!termsAccepted) {
            if (onError) onError('Please accept the terms and conditions');
            return;
        }

        setLoading(true);
        try {
            // Combine country codes with local numbers
            const fullPhoneNumber = `${selectedCountry.dialCode}${localPhone}`;
            const fullBusinessPhoneNumber = `${selectedCountry.dialCode}${localBusinessPhone}`;
            
            const registrationData = {
                name,
                email,
                phone: fullPhoneNumber,
                businessName,
                businessAddress,
                city,
                businessPhone: fullBusinessPhoneNumber,
                taxId,
                countryCode: selectedCountry.dialCode,
                country: selectedCountry.name
            };
            
            console.log("FRONTEND DEBUG: Submitting Seller Registration Data:", registrationData);

            const response = await api.post('/sellers/register', registrationData);
            console.log("FRONTEND DEBUG: Registration Response:", response.data);

            if (onSuccess) onSuccess(response.data.message || 'Successfully registered. Admin will contact you soon.');
            
            // Clear the form
            setName('');
            setEmail('');
            setLocalPhone('');
            setBusinessName('');
            setBusinessAddress('');
            setCity('');
            setLocalBusinessPhone('');
            setTaxId('');
            setErrors({});
            setTouched({});
            
            setTimeout(() => nav('/login'), 5000);
        } catch (err: any) {
            if (onError) onError(err?.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-100 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-blue-600" />
                    Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                        <div className="relative">
                            <FaStore className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                                    touched.businessName && errors.businessName 
                                        ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white'
                                }`}
                                placeholder="Official business name"
                                value={businessName}
                                onChange={e => handleBusinessNameChange(e.target.value)}
                                onBlur={() => handleBlur('businessName')}
                                disabled={loading}
                            />
                        </div>
                        {touched.businessName && errors.businessName && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.businessName}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Only letters, numbers, underscores, and spaces are allowed
                        </p>
                    </div>

                    {/* Country Code Display */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl mb-4">
                            <FaGlobe className="text-blue-500" />
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-700">
                                    {selectedCountry.dialCode} ({selectedCountry.name}) {selectedCountry.flag}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                                disabled={loading}
                            >
                                Change Country
                            </button>
                        </div>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 mb-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {countries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`p-3 border rounded-lg text-left transition-all ${
                                                selectedCountry.code === country.code
                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                            disabled={loading}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{country.flag}</span>
                                                <span className="font-medium text-gray-800">{country.name}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">{country.dialCode}</div>
                                            <div className="text-xs text-gray-500 mt-1">Example: {country.example}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Phone *</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                                    touched.businessPhone && errors.businessPhone 
                                        ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white'
                                }`}
                                placeholder={`e.g., ${selectedCountry.example}`}
                                value={localBusinessPhone}
                                onChange={e => handlePhoneChange(e.target.value, setLocalBusinessPhone)}
                                onBlur={() => handleBlur('businessPhone')}
                                disabled={loading}
                            />
                        </div>
                        {touched.businessPhone && errors.businessPhone ? (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.businessPhone}
                            </p>
                        ) : (
                            <p className="mt-1 text-xs text-gray-500">
                                Enter without country code • {localBusinessPhone.length}/{selectedCountry.digits} digits
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Registration No *</label>
                        <input
                            type="text"
                            required
                            className={`w-full px-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                                touched.taxId && errors.taxId 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white'
                            }`}
                            placeholder="Business Registration Number"
                            value={taxId}
                            onChange={e => setTaxId(e.target.value)}
                            onBlur={() => handleBlur('taxId')}
                            disabled={loading}
                        />
                        {touched.taxId && errors.taxId && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.taxId}
                            </p>
                        )}
                    </div>

                    {/* City Field */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                                    touched.city && errors.city 
                                        ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white'
                                }`}
                                placeholder="Enter your city"
                                value={city}
                                onChange={e => handleCityChange(e.target.value)}
                                onBlur={() => handleBlur('city')}
                                disabled={loading}
                            />
                        </div>
                        {touched.city && errors.city && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.city}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Only letters, numbers, and spaces are allowed
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address *</label>
                        <textarea
                            required
                            rows={2}
                            className={`w-full px-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all resize-none ${
                                touched.businessAddress && errors.businessAddress 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white'
                            }`}
                            placeholder="Full physical address of your business"
                            value={businessAddress}
                            onChange={e => setBusinessAddress(e.target.value)}
                            onBlur={() => handleBlur('businessAddress')}
                            disabled={loading}
                        />
                        {touched.businessAddress && errors.businessAddress && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.businessAddress}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-green-600" />
                    Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Full Name *</label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                                    touched.name && errors.name 
                                        ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                                }`}
                                placeholder="Full name of the primary contact"
                                value={name}
                                onChange={e => handleNameChange(e.target.value)}
                                onBlur={() => handleBlur('name')}
                                disabled={loading}
                            />
                        </div>
                        {touched.name && errors.name && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.name}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Only letters and spaces are allowed
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                                    touched.email && errors.email 
                                        ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                                }`}
                                placeholder="email@example.com"
                                value={email}
                                onChange={e => {
                                    // Prevent space at the beginning completely
                                    const newValue = e.target.value;
                                    
                                    // If user tries to type a space at the beginning, ignore it
                                    if (newValue.startsWith(' ')) {
                                        return;
                                    }
                                    
                                    // Remove all spaces from the email
                                    const noSpacesValue = newValue.replace(/\s/g, '');
                                    setEmail(noSpacesValue);
                                }}
                                onKeyDown={(e) => {
                                    // Prevent space key when cursor is at the beginning
                                    if (e.key === ' ' && email.length === 0) {
                                        e.preventDefault();
                                    }
                                }}
                                onPaste={(e) => {
                                    // Prevent pasting content that starts with space
                                    const pastedText = e.clipboardData.getData('text');
                                    if (pastedText.startsWith(' ')) {
                                        e.preventDefault();
                                    }
                                }}
                                onBlur={() => handleBlur('email')}
                                disabled={loading}
                            />
                        </div>
                        {touched.email && errors.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone *</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                                    touched.phone && errors.phone 
                                        ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                                }`}
                                placeholder={`e.g., ${selectedCountry.example}`}
                                value={localPhone}
                                onChange={e => handlePhoneChange(e.target.value, setLocalPhone)}
                                onBlur={() => handleBlur('phone')}
                                disabled={loading}
                            />
                        </div>
                        {touched.phone && errors.phone ? (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FaTimes className="text-xs" />
                                {errors.phone}
                            </p>
                        ) : (
                            <p className="mt-1 text-xs text-gray-500">
                                Enter without country code • {localPhone.length}/{selectedCountry.digits} digits
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                            <FaCheck className="text-green-600" />
                            <span className="font-medium">Your phone numbers will be saved as:</span>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="text-sm">
                                <span className="text-gray-600">Personal: </span>
                                <span className="font-semibold text-green-700">{selectedCountry.dialCode}{localPhone || 'XXXXXXXXXX'}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-600">Business: </span>
                                <span className="font-semibold text-green-700">{selectedCountry.dialCode}{localBusinessPhone || 'XXXXXXXXXX'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3 mt-8">
                <input
                    type="checkbox"
                    id="seller-terms"
                    className={`w-5 h-5 border-2 rounded accent-green-600 focus:ring-2 focus:ring-green-300 transition-colors mt-0.5 ${
                        !termsAccepted && touched.terms ? 'border-red-500' : 'border-gray-300'
                    }`}
                    checked={termsAccepted}
                    onChange={() => {
                        setTermsAccepted(!termsAccepted);
                        setTouched({...touched, terms: true});
                    }}
                    disabled={loading}
                />
                <label htmlFor="seller-terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-600 hover:text-green-800 font-semibold">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-800 font-semibold">Privacy Policy</Link>
                    {' '}for sellers.
                </label>
            </div>
            {touched.terms && !termsAccepted && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                    <FaTimes className="text-xs" />
                    Please accept the terms and conditions
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-4"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing Application...</span>
                    </div>
                ) : (
                    'Submit Seller Registration'
                )}
            </button>
        </form>
    );
}