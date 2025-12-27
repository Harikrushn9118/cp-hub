import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1', // Indigo 500
        },
        secondary: {
            main: '#a855f7', // Purple 500
        },
        background: {
            default: '#0f172a', // Slate 900
            paper: '#1e293b',   // Slate 800
        },
        text: {
            primary: '#f8fafc', // Slate 50
            secondary: '#94a3b8', // Slate 400
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        allVariants: {
            color: '#f8fafc',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default gradient overlay in dark mode
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                        borderColor: '#6366f1',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                    },
                },
                input: {
                    color: '#f8fafc', // Explicitly set input text color
                    '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px #1e293b inset',
                        WebkitTextFillColor: '#f8fafc',
                        caretColor: '#f8fafc',
                        borderRadius: 'inherit'
                    },
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#94a3b8',
                    '&.Mui-focused': {
                        color: '#6366f1',
                    }
                }
            }
        }
    },
});

export default theme;
