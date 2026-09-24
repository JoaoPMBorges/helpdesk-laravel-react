/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Tipografia: Plus Jakarta Sans como fonte principal do Design System Horizon
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      // Paleta de cores personalizada do Design System Horizon
      colors: {
        horizonte: {
          // Verde Teal elegante — cor primária de ação
          primario: '#0d9488',      // teal-600
          'primario-hover': '#0f766e', // teal-700
          'primario-leve': '#ccfbf1',  // teal-100

          // Laranja Crepúsculo — cor de destaque/aviso
          destaque: '#f97316',      // orange-500
          'destaque-leve': '#fff7ed', // orange-50

          // Fundos e superfícies
          fundo: '#f8fafc',         // slate-50 (off-white muito limpo)
          superficie: '#ffffff',
          borda: '#e2e8f0',         // slate-200
        },
      },
      // Animações personalizadas para o Skeleton Loader
      animation: {
        'pulse-suave': 'pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Sombras difusas e modernas
      boxShadow: {
        'cartao': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        'elevado': '0 10px 25px -5px rgb(13 148 136 / 0.15)',
      },
    },
  },
  plugins: [],
}
