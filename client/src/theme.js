import { createTheme } from '@mui/material/styles';

const paletteByMode = {
    dark: {
        background: { default: '#0f172a', paper: '#1e293b' },
        text: { primary: '#f8fafc', secondary: '#94a3b8' },
        divider: 'rgba(255, 255, 255, 0.14)',
    },
    light: {
        background: { default: '#f3f6fc', paper: '#ffffff' },
        text: { primary: '#172033', secondary: '#5d6b83' },
        divider: 'rgba(23, 32, 51, 0.16)',
    },
};

const createAppTheme = (mode = 'dark') => createTheme({
    palette: {
        mode,
        primary: { main: mode === 'dark' ? '#6366f1' : '#4f46e5' },
        secondary: { main: '#a855f7' },
        ...paletteByMode[mode],
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& fieldset': { borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(23, 32, 51, 0.24)' },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#6366f1' : '#4f46e5' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#6366f1' : '#4f46e5' },
                },
                input: {
                    '&:-webkit-autofill': {
                        WebkitBoxShadow: `0 0 0 100px ${mode === 'dark' ? '#1e293b' : '#ffffff'} inset`,
                        WebkitTextFillColor: mode === 'dark' ? '#f8fafc' : '#172033',
                        caretColor: mode === 'dark' ? '#f8fafc' : '#172033',
                        borderRadius: 'inherit',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: paletteByMode[mode].text.secondary,
                    '&.Mui-focused': { color: mode === 'dark' ? '#818cf8' : '#4f46e5' },
                },
            },
        },
    },
});

export default createAppTheme;
