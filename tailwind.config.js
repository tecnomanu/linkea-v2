/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand color (coral/red-orange) - Linkea #ef5844
                brand: {
                    50: '#fef3f2',
                    100: '#ffe1de',
                    200: '#ffc9c3',
                    300: '#ffa399',
                    400: '#ff6f5c',
                    500: '#ef5844', // Main brand color
                    600: '#dc3b26', // Hover state
                    700: '#b92d1a',
                    800: '#992919',
                    900: '#7f281b',
                    950: '#451109',
                },
                // Alias primary = brand
                primary: {
                    50: '#fef3f2',
                    100: '#ffe1de',
                    200: '#ffc9c3',
                    300: '#ffa399',
                    400: '#ff6f5c',
                    500: '#ef5844',
                    600: '#dc3b26',
                    700: '#b92d1a',
                    800: '#992919',
                    900: '#7f281b',
                    950: '#451109',
                },
            },
            fontFamily: {
                display: ['Poppins', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft-xl': '0 20px 27px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 20px rgba(217, 119, 6, 0.4)',
                'glow-lg': '0 0 40px rgba(217, 119, 6, 0.3)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient': 'gradient 8s ease infinite',
            },
            keyframes: {
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                'gradient': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundSize: {
                '300%': '300%',
            },
        },
    },
    plugins: [],
}
