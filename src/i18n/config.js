import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    fr: { 
        translation: {
            nav: {
                home: "Accueil",
                about: "À propos de nous",
                lands: "Terrains",
                buildings: "Bâtiments",
                invest: "Investir",
                propose: "Proposer",
                contact: "Contact",
                help: "Aide",
                login: "Connexion",
                register: "Inscription",
                logout: "Déconnexion",
                com: "Commander"
            },

               header: {
                title: "L'innovation au cœur de nos actions Votre propriété, notre priorité.",
            }

            
        }
    },
    en: { 
        translation: {
            nav: {
                home: "Home",
                about: "About Us",
                lands: "Lands",
                buildings: "Buildings",
                invest: "Invest",
                propose: "Propose",
                contact: "Contact",
                help: "Help",
                login: "Login",
                register: "Register",
                logout: "Logout",
                com: "Commander"
            },

               header: {
                title: "Innovation at the heart of our actions.Your property, our priority.",
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr',
        lng: localStorage.getItem('language') || 'fr',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;