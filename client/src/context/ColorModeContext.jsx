import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createAppTheme from '../theme';

const ColorModeContext = createContext({ mode: 'dark', toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export function ColorModeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('cp-hub-color-mode');
        return savedMode === 'light' ? 'light' : 'dark';
    });

    useEffect(() => {
        document.documentElement.dataset.theme = mode;
        localStorage.setItem('cp-hub-color-mode', mode);
    }, [mode]);

    const value = useMemo(() => ({
        mode,
        toggleColorMode: () => setMode((currentMode) => currentMode === 'dark' ? 'light' : 'dark'),
    }), [mode]);
    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
