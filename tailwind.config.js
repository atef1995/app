import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Base prose styles
            maxWidth: 'none',
            color: theme('colors.gray.700'),

            // Headings
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '800',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              marginTop: '0',
              marginBottom: '1.5rem',
            },
            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h4: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },

            // Paragraphs
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
              lineHeight: '1.75',
            },

            // Lists
            ul: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            ol: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },

            // Code
            code: {
              color: theme('colors.pink.600'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },

            // Pre (code blocks)
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              overflowX: 'auto',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              padding: '0',
            },

            // Links
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },

            // Blockquotes
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.gray.300'),
              paddingLeft: '1rem',
              color: theme('colors.gray.600'),
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },

            // Strong text
            strong: {
              fontWeight: '700',
              color: theme('colors.gray.900'),
            },
          },
        },

        // Dark mode styles
        invert: {
          css: {
            color: theme('colors.gray.300'),

            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },

            code: {
              color: theme('colors.pink.400'),
              backgroundColor: theme('colors.gray.800'),
            },

            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
            },

            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },

            blockquote: {
              borderLeftColor: theme('colors.gray.600'),
              color: theme('colors.gray.400'),
            },

            strong: {
              color: theme('colors.gray.100'),
            },
          },
        },

        // Large prose variant
        lg: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '1.75',

            h1: {
              fontSize: '2.5rem',
              lineHeight: '1.2',
              marginBottom: '1.5rem',
            },
            h2: {
              fontSize: '2rem',
              lineHeight: '1.3',
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
            },
            h3: {
              fontSize: '1.625rem',
              lineHeight: '1.4',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h4: {
              fontSize: '1.375rem',
              lineHeight: '1.5',
              marginTop: '1.75rem',
              marginBottom: '0.75rem',
            },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
};

export default config;
