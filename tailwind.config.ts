import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './emails/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      screens: {
        xs760: '760px'
      },
      colors: {
        midnight: '#142A1C',
        ember: '#7BBF3F',
        sage: '#3F8F65',
        mist: '#F2F7EF',
        slate: '#1E3A2A'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: '1.75rem'
      },
      boxShadow: {
        brand: '0 25px 60px -30px rgba(20, 60, 30, 0.25)'
      },
      animation: {
        float: 'float 12s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
