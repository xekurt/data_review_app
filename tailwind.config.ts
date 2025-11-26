import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        },
        fontSize: {
            xs: ['0.75rem', { lineHeight: '1rem' }],
            sm: ['0.875rem', { lineHeight: '1.25rem' }],
            base: ['1rem', { lineHeight: '1.5rem' }],
            lg: ['1.125rem', { lineHeight: '1.75rem' }],
            xl: ['1.25rem', { lineHeight: '1.75rem' }],
            '2xl': ['1.5rem', { lineHeight: '2rem' }],
        },

        extend: {
            colors: {
                'brand-primary': '#1A56A6',
                'brand-dark': '#1E40AF',
                'brand-light': '#60A5FA',

                'status-approved': {
                    DEFAULT: '#15803D',
                    light: '#D1FAE5',
                },
                'status-fix': {
                    DEFAULT: '#DC2626',
                    light: '#FEE2E2',
                },
                'status-pending': {
                    DEFAULT: '#6B7280',
                    light: '#E5E7EB',
                },

                'neutral-dark': '#1F2937',
                'neutral-subtle': '#6B7280',
                'bg-app': '#F9FAFB',
                'bg-panel': '#FFFFFF',
                'border-subtle': '#E5E7EB',
            },

            spacing: {
                '10': '2.5rem',
                '12': '3rem',
            },

            boxShadow: {
                'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },

            borderRadius: {
                'lg': '0.5rem',
            }
        },
    },
    plugins: [],
};

export default config;