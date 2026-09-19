/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        snd: {
          // Saudi green ramp
          50: '#E7FFF1',
          100: '#BDF5D0',
          200: '#7BDF9A',
          300: '#35C96A',
          400: '#00A94F',
          500: '#008F4A',
          600: '#00763F',
          700: '#005C3A',
          800: '#003F3F',
          900: '#002F32',
          950: '#001F23',
        },
        gold: {
          50: '#F4FFE6',
          100: '#DFFFB6',
          200: '#B9F56A',
          300: '#8CDD37',
          400: '#65C51D',
          500: '#4AA817',
          600: '#398513',
          700: '#2A6411',
          800: '#204A15',
          900: '#173519',
        },
        sand: {
          50: '#F7FFFA',
          100: '#EAF9EF',
          200: '#D5EBDD',
          300: '#B6D0B9',
          400: '#8BAE8D',
          500: '#668665',
        },
      },
      fontFamily: {
        heading: ['"Tajawal"', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', '"Tajawal"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 108, 53, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 108, 53, 0.6)' },
        },
      },
      backgroundImage: {
        'snd-gradient': 'linear-gradient(135deg, #00A94F 0%, #003F3F 100%)',
        'snd-radial': 'radial-gradient(ellipse at center, #008F4A 0%, #003F3F 70%, #002F32 100%)',
        'gold-gradient': 'linear-gradient(135deg, #65C51D 0%, #B9F56A 50%, #65C51D 100%)',
      },
    },
  },
  plugins: [],
};
