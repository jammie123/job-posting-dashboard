/** @type {import('tailwindcss').Config} */

import colors from './src/css/colors';

export default {
    prefix: 'tm-',
    content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            inherit: 'inherit',
            white: '#ffffff',
            black: '#000000',
            gray: colors.gray,
            teamio: {
                dark: colors.brand.dark,
                violet: colors.brand.violet,
                pink: colors.brand.pink,
                blue: colors.brand.blue,
                'light-blue': colors['brand-blue']['300'],
            },
            action: {
                primary: {
                    default: colors['brand-blue']['300'],
                    hover: colors['brand-blue']['400'],
                    active: colors['brand-blue']['500'],
                    disabled: colors.gray['300'],
                },
                secondary: {
                    default: colors['brand-blue']['300'],
                    hover: colors['brand-blue']['400'],
                    active: colors['brand-blue']['500'],
                    disabled: colors.gray['300'],
                },
                link: {
                    default: colors.brand.blue,
                    hover: colors['brand-blue']['600'],
                    active: colors['brand-blue']['700'],
                    disabled: colors.gray['300'],
                },
                'link-inverted': {
                    default: colors['brand-blue']['300'],
                    hover: colors['brand-blue']['400'],
                    active: colors['brand-blue']['500'],
                    disabled: colors.gray['200'],
                },
                selected: {
                    default: colors.brand.blue,
                    hover: colors['brand-blue']['600'],
                    active: colors['brand-blue']['700'],
                    disabled: colors.gray['300'],
                },
                unselected: {
                    default: colors.gray['400'],
                    hover: colors.gray['500'],
                    active: colors.gray['600'],
                    disabled: colors.gray['300'],
                },
                success: {
                    default: colors.green['50'],
                    hover: colors.green['400'],
                    active: colors.green['500'],
                    disabled: colors.gray['300'],
                },
                warning: {
                    default: colors.yellow['100'],
                    hover: colors.yellow['200'],
                    active: colors.yellow['500'],
                    disabled: colors.gray['300'],
                },
                danger: {
                    default: colors.red['50'],
                    hover: colors.red['400'],
                    active: colors.red['500'],
                    disabled: colors.gray['300'],
                },
            },
            text: {
                primary: {
                    default: colors.gray['800'],
                    disabled: colors.gray['300'],
                },
                'primary-inverted': {
                    default: colors.white,
                    disabled: colors.gray['500'],
                },
                secondary: {
                    default: colors.gray['600'],
                    disabled: colors.gray['300'],
                },
                'secondary-inverted': {
                    default: colors.gray['200'],
                    disabled: colors.gray['500'],
                },
                light: {
                    default: colors.gray['400'],
                    disabled: colors.gray['300'],
                },
            },
            emotion: {
                info: {
                    default: colors.blue['400'],
                    hover: colors.blue['500'],
                    active: colors.blue['600'],
                    disabled: colors.gray['200'],
                    background: colors.blue['50'],
                    emphasis: colors.blue['800'],
                },
                success: {
                    default: colors.green['400'],
                    hover: colors.green['500'],
                    active: colors.green['600'],
                    disabled: colors.gray['200'],
                    background: colors.green['50'],
                    emphasis: colors.green['800'],
                },
                warning: {
                    default: colors.yellow['400'],
                    hover: colors.yellow['500'],
                    active: colors.yellow['600'],
                    disabled: colors.gray['200'],
                    background: colors.yellow['50'],
                    emphasis: colors.yellow['800'],
                },
                danger: {
                    default: colors.red['400'],
                    hover: colors.red['500'],
                    active: colors.red['600'],
                    disabled: colors.gray['200'],
                    background: colors.red['50'],
                    emphasis: colors.red['800'],
                },
            },
            border: {
                primary: colors.gray['300'],
                secondary: colors.gray['200'],
                active: colors.brand.blue,
            },
            background: {
                basic: colors.white,
                'cover-light': colors.gray['50'],
                'cover-default': colors.gray['100'],
                'cover-dark': colors.gray['200'],
                inverted: colors.brand.dark,
                interactive: {
                    default: colors.white,
                    hover: colors['brand-blue']['50'],
                    active: colors['brand-blue']['100'],
                },
                'interactive-danger': {
                    default: colors.white,
                    hover: colors.red['50'],
                    active: colors.red['100'],
                },
            },
            brand: {
                jobs: '#19325a',
                prace: '#ca2026',
                linkedin: '#0077b5',
                facebook: '#3b5998',
            },
            file: {
                pdf: '#de231a',
                xls: '#1d6f42',
                doc: '#315b94',
                ppt: '#d04423',
            },
        },
        spacing: {
            radio: '1.625rem',
            checkbox: '1.625rem',
            0: '0',
            px: '1px',
            '0.5': '.125rem',
            1: '.25rem',
            '1.5': '.375rem',
            2: '.5rem',
            3: '.75rem',
            4: '1rem',
            5: '1.25rem',
            6: '1.5rem',
            7: '1.75rem',
            8: '2rem',
            9: '2.25rem',
            10: '2.5rem',
            12: '3rem',
            14: '3.5rem',
            16: '4rem',
            18: '4.5rem',
            20: '5rem',
            '3/4': '75%',
        },
        textColor: ({ theme }) => ({
            ...theme('colors.text'),
            teamio: theme('colors.teamio'),
            action: theme('colors.action'),
            emotion: theme('colors.emotion'),
            gray: theme('colors.gray'),
            inherit: 'inherit',
            current: 'currentColor',
        }),
        borderRadius: {
            none: '0',
            sm: '.25rem',
            DEFAULT: '.5rem',
            md: '.75rem',
            lg: '1rem',
            full: '9999px',
        },
        borderColor: ({ theme }) => ({
            ...theme('colors.border'),
            teamio: theme('colors.teamio'),
            action: theme('colors.action'),
            emotion: theme('colors.emotion'),
            gray: theme('colors.gray'),
            transparent: 'transparent',
        }),
        ringColor: {
            DEFAULT: colors.brand.blue,
        },
        ringOpacity: {
            DEFAULT: 0.6,
        },
        ringWidth: {
            DEFAULT: '2px',
        },
        backgroundColor: ({ theme }) => ({
            ...theme('colors.background'),
            teamio: theme('colors.teamio'),
            action: theme('colors.action'),
            emotion: theme('colors.emotion'),
            text: theme('colors.text'),
            gray: theme('colors.gray'),
            transparent: 'transparent',
            current: 'currentColor',
            inherit: 'inherit',
        }),
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
            mono: ['monospace'],
            inherit: 'inherit',
        },
        fontSize: {
            xs: '.6875rem', // 11px
            sm: '.8125rem', // 13px
            base: '.9375rem', // 15px
            lg: '1.125rem', // 18px
            xl: '1.25rem', // 20px
            '2xl': '1.5rem', // 24px
            '3xl': '1.75rem', // 28px
        },
        letterSpacing: {
            normal: '-.015em',
            wide: '0',
        },
        lineHeight: {
            none: 1,
            tight: 1.3,
            normal: 1.45,
        },
        boxShadow: {
            none: 'none',
            xs: '0px 2px 2px 0px rgba(0 0 0 / .04)',
            sm: '0px 2px 8px rgba(0 13 60 / .12)',
            DEFAULT: '0px 4px 12px rgba(0 13 60 / .16)',
            md: '0px 8px 24px rgba(0 13 60 / .16)',
            lg: '0px 12px 40px rgba(0 8 28 / .16)',
            xl: '0px 24px 64px rgba(0 13 60 / .16)',
        },
        screens: {
            sm: '750px',
            md: '1200px',
            lg: '1400px',
            xl: '1800px',
            'hover-none': { raw: '(hover: none)' },
            // Make sure to list max-width breakpoints in descending order so that they override each other as expected.
            'max-lg': { max: '1799.98px' },
            'max-md': { max: '1399.98px' },
            'max-sm': { max: '1199.98px' },
            'max-xs': { max: '749.98px' },
        },
        extend: {
            minWidth: ({ theme }) => ({
                ...theme('spacing'),
            }),
            minHeight: ({ theme }) => ({
                ...theme('spacing'),
            }),
            maxHeight: {
                none: 'none',
            },
            backgroundImage: {
                'checkbox-checked':
                    'url(\'data:image/svg+xml,%3csvg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="18" height="18"%3e%3cpath d="M7.71 13.29a.996.996 0 0 1-1.41 0L2.71 9.7a.996.996 0 1 1 1.41-1.41L7 11.17l6.88-6.88a.996.996 0 1 1 1.41 1.41l-7.58 7.59Z" style="fill:%23fff"/%3e%3c/svg%3e\')',
                'checkbox-indeterminate':
                    'url(\'data:image/svg+xml,%3csvg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="18" height="18"%3e%3cpath style="fill:%23fff" d="M4 8h10v2H4z"/%3e%3c/svg%3e\')',
            },
            scale: {
                '-100': '-1',
            },
        },
    },
    plugins: [],
    safelist: [],
};