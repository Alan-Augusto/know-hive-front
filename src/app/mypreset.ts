//mypreset.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { ColorService } from './services/style/color.service';

export const Noir = definePreset(Aura, {
    semantic: {
        primary: {
            0: '#ffffff',
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.500}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}',
            1000: '#09090b'
        },
        accent: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
            950: '#422006'
        },
        colorScheme: {
            light: {
                text: {
                    base: '{zinc.950}',
                    secondary: '{zinc.400}',
                    inverse: '{zinc.50}',
                    accent: '{accent.400}'
                },
                surface: {
                    base: '#ffffff',
                    fluffy: '#f5f5f5',
                    card: '#eaeaea',
                    secondary: '{zinc.200}',
                    inverse: '{zinc.950}'
                },
                feedback: {
                    error: {
                        main: '#dc2626',
                        surface: '#fee2e2'
                    },
                    warning: {
                        main: '#f59e0b',
                        surface: '#fef3c7'
                    },
                    success: {
                        main: '#15803D',
                        surface: '#dcfce7'
                    },
                    info: {
                        main: '#0ea5e9',
                        surface: '#e0f2fe'
                    }
                },
                shadow: {
                    sm: '0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.1)',
                    md: '0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.2)',
                    lg: '0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.4)'
                }
            },
            dark: {
                text: {
                    base: '{zinc.50}',
                    secondary: '{zinc.500}',
                    inverse: '{zinc.950}',
                    accent: '{accent.400}'
                },
                surface: {
                    base: '{zinc.1000}',
                    fluffy: '{zinc.900}',
                    card: '{zinc.800}',
                    secondary: '{zinc.700}',
                    inverse: '{zinc.50}'
                },
                feedback: {
                    error: {
                        main: '#dc2626',
                        surface: '#450a0a'
                    },
                    warning: {
                        main: '#f59e0b',
                        surface: '#451a03'
                    },
                    success: {
                        main: '#16a34a',
                        surface: '#052e16'
                    },
                    info: {
                        main: '#0ea5e9',
                        surface: '#082f49'
                    }
                },
                shadow: {
                    sm: '0 0.0625rem 0.125rem 0 rgba(255, 255, 255, 0.15)',
                    md: '0 0.25rem 0.375rem -0.0625rem rgba(255, 255, 255, 0.2)',
                    lg: '0 0.625rem 0.9375rem -0.1875rem rgba(255, 255, 255, 0.2)'
                }

            }
        }
    }
});
