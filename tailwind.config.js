/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /*
        * body, modal, drawer background & ring-offset-color
        */
        background: colors.white,

        /*
        * body text color
        */
        foreground: colors.gray[600],

        /*
        * border, default flat bg color for input components, tab & dropdown hover color
        */
        muted: colors.gray[200],

        /*
        * primary colors
        */
        primary: {
          lighter: colors.gray[200],
          DEFAULT: colors.gray[800],
          dark: colors.gray[950],
          foreground: colors.white,
        },

        /*
        * secondary colors
        */
        secondary: {
          lighter: colors.indigo[200],
          DEFAULT: colors.indigo[500],
          dark: colors.indigo[700],
          foreground: colors.white,
        },

        /*
        * danger colors
        */
        red: {
          lighter: colors.rose[200],
          DEFAULT: colors.rose[500],
          dark: colors.rose[700],
        },

        /*
        * warning colors
        */
        orange: {
          lighter: colors.amber[200],
          DEFAULT: colors.amber[500],
          dark: colors.amber[700],
        },

        /*
        * info colors
        */
        blue: {
          lighter: colors.sky[200],
          DEFAULT: colors.sky[500],
          dark: colors.sky[700],
        },

        /*
        * success colors
        */
        green: {
          lighter: colors.emerald[200],
          DEFAULT: colors.emerald[500],
          dark: colors.emerald[700],
        },

        'Cprimary': "#1d4e9c",
        'Csecondary1': "#f7a721",
        'Csecondary2': "#FFFFFF",
        'texteCouleur': "#000000",
        'Cprimary-hover': '#f5b029',
        'Csecondary-hover': '#221105',
        'Cred-primary-hover': '#990e0e',
        'Cred-primary': '#bf2222',


        'neutralSilver': '#F5F7FA',
        'neutralDGrey': '#4D4D4D',
        'brandPrimary': '#4CAF4F',
        'neutralGrey': '#717171',
        'gray900': '18191F',
      },
      fontFamily: {
        'montserrat': ["Montserrat"],
        'poppins': ["Poppins"],
        "lato": ['Lato'],

        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}