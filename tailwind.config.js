/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#F4F6EF',
          100: '#E4E9D6',
          200: '#C9D4AD',
          300: '#A9BB84',
          400: '#8D9E6F',
          500: '#7A8B5E',
          600: '#5C6B4A',
          700: '#4A5A3A',
          800: '#3A4A2E',
          900: '#2A3A22',
        },
        gold: {
          50: '#FDF8EE',
          100: '#F9EDD1',
          200: '#F2D9A0',
          300: '#E8C06E',
          400: '#D4A96A',
          500: '#C9912E',
          600: '#B0781A',
          700: '#8B5E0A',
          800: '#6E4800',
          900: '#5A3B00',
        },
        slate: {
          50: '#EDEDF0',
          100: '#D1D1D9',
          200: '#A8A8B8',
          300: '#7E7E97',
          400: '#555576',
          500: '#3A4A5A',
          600: '#2C3E4F',
          700: '#1E2D3E',
          800: '#141E2E',
          900: '#0A121E',
        },
        cream: '#F5F0E8',
        parchment: '#EDE6D8',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'text-reveal': 'textReveal 1.2s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
