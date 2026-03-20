import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';

const LanguageDropdown = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    // Fermer quand on clique dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = async (langCode) => {
        await i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setIsOpen(false);
        
        // Dispatcher un événement pour recharger les données
        window.dispatchEvent(
            new CustomEvent('languageChanged', { 
                detail: { language: langCode } 
            })
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-texteCouleur hover:text-Cprimary transition-colors duration-200"
            >
                <FaGlobe className="text-lg" />
                <span className="text-xl">{currentLanguage?.flag}</span>
                <span className="hidden md:inline font-medium">
                    {currentLanguage?.code.toUpperCase()}
                </span>
                <FaChevronDown 
                    className={`text-sm transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                                i18n.language === lang.code 
                                    ? 'bg-yellow-50 text-Cprimary' 
                                    : 'text-texteCouleur'
                            }`}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-medium flex-1">{lang.name}</span>
                            {i18n.language === lang.code && (
                                <span className="text-Cprimary">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown;