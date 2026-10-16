import { createTheme } from '@mui/material/styles';

const paletteByMode = {
    dark: {
        background: { default: '#0a111b', paper: '#111d2a' },
        text: { primary: '#edf5f7', secondary: '#9aadb5' },
        divider: 'rgba(203, 224, 230, 0.13)',
    },
    light: {
        background: { default: '#f2f7f7', paper: '#ffffff' },
        text: { primary: '#142a31', secondary: '#577078' },
        divider: 'rgba(20, 42, 49, 0.14)',
    },
};

const createAppTheme = (mode = 'dark') => createTheme({
    palette: {
        mode,
        primary: { main: mode === 'dark' ? '#2dd4bf' : '#0f766e' },
        secondary: { main: mode === 'dark' ? '#38bdf8' : '#0369a1' },
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
                    '& fieldset': { borderColor: paletteByMode[mode].divider },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#2dd4bf' : '#0f766e' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#2dd4bf' : '#0f766e' },
                },
                input: {
                    '&:-webkit-autofill': {
                        WebkitBoxShadow: `0 0 0 100px ${paletteByMode[mode].background.paper} inset`,
                        WebkitTextFillColor: paletteByMode[mode].text.primary,
                        caretColor: paletteByMode[mode].text.primary,
                        borderRadius: 'inherit',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: paletteByMode[mode].text.secondary,
                    '&.Mui-focused': { color: mode === 'dark' ? '#5eead4' : '#0f766e' },
                },
            },
        },
    },
});

export default createAppTheme;
