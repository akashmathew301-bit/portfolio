/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#000000',
          950: '#05070A',
          900: '#0A0E14',
          800: '#11161F',
        },
        blue: {
          deep: '#004B93',
          main: '#0A6CFF',
          glow: '#2D9CFF',
        },
        muted: '#CBD4E0',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        /* no webfont download: the brief editor uses whatever mono the OS has */
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(10,108,255,0.55)',
        'glow-lg': '0 0 90px -20px rgba(45,156,255,0.65)',
        'glow-sm': '0 0 20px -6px rgba(10,108,255,0.6)',
      },
      backgroundImage: {
        'blue-grad': 'linear-gradient(100deg,#2D9CFF 0%,#0A6CFF 45%,#004B93 100%)',
        'glass': 'linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))',
      },
      screens: {
        xs: '400px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22,1,0.36,1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        900: '900ms',
      },
    },
  },
  plugins: [],
}
