import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaCheck, FaTimes, FaGlobe } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';

interface CustomerRegisterFormProps {
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

export default function CustomerRegisterForm({ onSuccess, onError }: CustomerRegisterFormProps) {
    const auth = useContext(AuthContext)!;
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to Sri Lanka
    const [localPhone, setLocalPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [touched, setTouched] = useState<{[key: string]: boolean}>({});

    // Validation functions
    const validateName = (value: string) => {
        if (!value.trim()) return 'Name is required';
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
        
        // Check if email contains spaces anywhere (not just at start)
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

    const validatePassword = (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            return 'Password must contain at least one special character (!@#$%^&* etc.)';
        }
        return '';
    };

    const validateConfirmPassword = (value: string) => {
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
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
            case 'password':
                error = validatePassword(password);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(confirmPassword);
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
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(confirmPassword)
        };
        
        setErrors(newErrors);
        setTouched({
            name: true,
            email: true,
            phone: true,
            password: true,
            confirmPassword: true
        });
        
        return !Object.values(newErrors).some(error => error);
    };

    // Format local phone number as user types
    const handlePhoneChange = (value: string) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        // Limit to the country's digit length
        const limitedDigits = digits.slice(0, selectedCountry.digits);
        setLocalPhone(limitedDigits);
    };

    // Handle name change - prevent non-letter characters except spaces
    const handleNameChange = (value: string) => {
        // Only allow letters and spaces
        const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
        setName(filteredValue);
    };

    // Handle email change - prevent ANY spaces in email
    const handleEmailChange = (value: string) => {
        // Remove ALL spaces from email (not just leading spaces)
        const noSpacesValue = value.replace(/\s/g, '');
        setEmail(noSpacesValue);
    };

    // Handle country selection
    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country);
        setShowCountryDropdown(false);
        // Clear phone validation when country changes
        setErrors({...errors, phone: ''});
        setLocalPhone(''); // Clear phone number when country changes
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
            // Combine country code with local number
            const fullPhoneNumber = `${selectedCountry.dialCode}${localPhone}`;
            
            // Only register, NO auto login
            await auth.register({ 
                name, 
                email, 
                password, 
                phone: fullPhoneNumber,
                countryCode: selectedCountry.dialCode
            });
            
            if (onSuccess) onSuccess('Registration successful! Redirecting to login...');
            
            // Clear the form
            setName('');
            setEmail('');
            setLocalPhone('');
            setPassword('');
            setConfirmPassword('');
            setErrors({});
            setTouched({});
            
            // Show success message for 2 seconds then redirect
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err: any) {
            if (onError) onError(err?.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    // Check password requirements
    const passwordRequirements = [
        { test: password.length >= 8, text: 'At least 8 characters' },
        { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
        { test: /[a-z]/.test(password), text: 'One lowercase letter' },
        { test: /[0-9]/.test(password), text: 'One number' },
        { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), text: 'One special character' }
    ];

    const getPasswordStrength = () => {
        if (password.length === 0) return { width: '0%', color: 'bg-gray-300', label: '' };
        
        // Count how many requirements are met
        const metRequirements = passwordRequirements.filter(req => req.test).length;
        const totalRequirements = passwordRequirements.length;
        const percentage = (metRequirements / totalRequirements) * 100;
        
        if (percentage < 40) return { width: `${percentage}%`, color: 'bg-red-500', label: 'Weak' };
        if (percentage < 80) return { width: `${percentage}%`, color: 'bg-yellow-500', label: 'Medium' };
        return { width: `${percentage}%`, color: 'bg-green-500', label: 'Strong' };
    };

    const strength = getPasswordStrength();

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            required
                            className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                                touched.name && errors.name 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                    : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                            }`}
                            placeholder="Enter your full name"
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
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="email"
                            required
                            className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                                touched.email && errors.email 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                    : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                            }`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => handleEmailChange(e.target.value)}
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

                {/* Phone Field with Country Selector */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Phone Number
                    </label>
                    
                    <div className="space-y-3">
                        {/* Country Code Display */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <FaGlobe className="text-green-500" />
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-700">
                                    {selectedCountry.dialCode} ({selectedCountry.name}) {selectedCountry.flag}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="text-sm text-green-600 hover:text-green-800 font-medium px-3 py-1.5 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Change Country
                            </button>
                        </div>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {countries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`p-3 border rounded-lg text-left transition-all ${
                                                selectedCountry.code === country.code
                                                    ? 'border-green-500 bg-green-50 ring-2 ring-green-100'
                                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                            }`}
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

                        {/* Local Phone Number Input */}
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="tel"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                                    touched.phone && errors.phone 
                                        ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                                }`}
                                placeholder={`e.g., ${selectedCountry.example}`}
                                value={localPhone}
                                onChange={e => handlePhoneChange(e.target.value)}
                                onBlur={() => handleBlur('phone')}
                                disabled={loading}
                            />
                        </div>
                        
                        {/* Phone Instructions and Validation */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                                {touched.phone && errors.phone ? (
                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                        <FaTimes className="text-xs" />
                                        {errors.phone}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        Enter your phone number without the country code
                                    </p>
                                )}
                            </div>
                            <div className="text-xs text-gray-400">
                                {localPhone.length}/{selectedCountry.digits} digits • 
                                Will be saved as: <span className="font-semibold text-gray-600">{selectedCountry.dialCode}{localPhone || 'XXXXXXXXXX'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password *
                    </label>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                                touched.password && errors.password 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                    : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                            }`}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {password && (
                        <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${strength.color} transition-all duration-300`}
                                    style={{ width: strength.width }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-600">Password Strength: {strength.label}</span>
                                <span className="text-xs text-gray-500">{Math.round(parseInt(strength.width))}%</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Password Requirements */}
                    {password && (
                        <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Password must contain:</p>
                            <ul className="space-y-1">
                                {passwordRequirements.map((req, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        {req.test ? (
                                            <FaCheck className="text-green-500 text-xs" />
                                        ) : (
                                            <FaTimes className="text-red-400 text-xs" />
                                        )}
                                        <span className={`text-xs ${req.test ? 'text-green-600' : 'text-gray-500'}`}>
                                            {req.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {touched.password && errors.password && (
                        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                            <FaTimes className="text-xs" />
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password *
                    </label>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                                touched.confirmPassword && errors.confirmPassword 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                                    : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white'
                            }`}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur('confirmPassword')}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {confirmPassword && (
                        <div className="mt-1 text-xs flex items-center gap-1.5">
                            <FaCheck className={`text-xs ${password === confirmPassword ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className={password === confirmPassword ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                Passwords {password === confirmPassword ? 'match ✓' : 'do not match'}
                            </span>
                        </div>
                    )}
                    {touched.confirmPassword && errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                            <FaTimes className="text-xs" />
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 mt-6">
                <input
                    type="checkbox"
                    id="customer-terms"
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
                <label htmlFor="customer-terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-600 hover:text-green-800 font-semibold">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-800 font-semibold">
                        Privacy Policy
                    </Link>
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
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-4"
            >
                <div className="flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        'Create Account'
                    )}
                </div>
            </button>
        </form>
    );
}