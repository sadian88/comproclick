import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Custom palette colors directly usable in Tailwind
        'blanco-puro': 'hsl(var(--color-blanco-puro))',
        'azul-cielo-super-suave': 'hsl(var(--color-azul-cielo-super-suave))',
        'azul-cielo-suave': 'hsl(var(--color-azul-cielo-suave))',
        'lila-pastel': 'hsl(var(--color-lila-pastel))',
        'rosa-claro': 'hsl(var(--color-rosa-claro))',
        'gris-translucido': 'hsl(var(--color-gris-translucido))',
        'dorado-metalico': 'hsl(var(--color-dorado-metalico))',
        'negro-suave': 'hsl(var(--color-negro-suave))',
        'azul-profundo': 'hsl(var(--color-azul-profundo))',
        'morado-electrico': 'hsl(var(--color-morado-electrico))',
        'azul-glass-base': 'hsl(var(--color-azul-glass-base))',
        'turquesa-claro': 'hsl(var(--color-turquesa-claro))',
      },
      borderRadius: {
        lg: 'var(--radius)', // 0.75rem
        xl: 'calc(var(--radius) + 4px)', // 1rem
        '2xl': 'calc(var(--radius) + 8px)', // 1.25rem
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(-2deg)' },
          '50%': { transform: 'translateY(0px) rotate(0deg)' },
          '75%': { transform: 'translateY(-5px) rotate(2deg)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 5s ease-in-out infinite', // Slower, more gentle float
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)', // Softer large shadow
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.2)',  // Even larger
        'inner-lg': 'inset 0 2px 4px 0 rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
