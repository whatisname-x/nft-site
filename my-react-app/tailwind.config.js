module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          /* Works for WebKit browsers */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Works for Firefox */
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
      });
    },
  ],
};
