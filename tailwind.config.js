tailwind.config = {
  theme: {
    extend: {
      fontFamily: { nunito: ['Cinzel', 'serif'], poppins: ['Poppins', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#6b3f00', light: '#aa6d11', soft: '#fff3e0', border: '#e8d0b0' }
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
      },
      animation: { 'fade-up': 'fadeUp 0.6s ease forwards' }
    }
  }
}
