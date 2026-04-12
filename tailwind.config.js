/**
 * After editing Tailwind classes in index.html, regenerate the bundle:
 *   npx tailwindcss@3.4.17 -i ./tailwind-input.css -o ./tailwind-built.css --minify
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./index.html'],
  safelist: [
    'bg-navy-deep/90',
    'backdrop-blur-lg',
    'py-4',
    'shadow-xl',
    'bg-transparent',
    'py-6',
  ],
  theme: {
    extend: {
      colors: {
        'navy-deep': '#05051a',
        'purple-deep': '#0f051a',
        'gold-royal': '#d4af37',
        'blue-vibrant': '#007bff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
