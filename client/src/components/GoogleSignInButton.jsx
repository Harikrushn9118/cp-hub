import { useEffect, useRef, useState } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';

let googleScriptPromise;

function loadGoogleIdentityServices() {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (googleScriptPromise) return googleScriptPromise;

    googleScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[data-google-identity="true"]');
        const script = existingScript || document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.dataset.googleIdentity = 'true';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Google sign-in could not be loaded. Check your connection and try again.'));
        if (!existingScript) document.head.appendChild(script);
    });

    return googleScriptPromise;
}

export default function GoogleSignInButton({ onCredential, disabled = false }) {
    const buttonRef = useRef(null);
    const [error, setError] = useState('');
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const callbackRef = useRef(onCredential);
    callbackRef.current = onCredential;

    useEffect(() => {
        let mounted = true;

        if (!clientId) {
            setError('Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to the frontend environment.');
            return () => { mounted = false; };
        }

        loadGoogleIdentityServices()
            .then(() => {
                if (!mounted || !buttonRef.current) return;
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response) => {
                        if (response.credential) callbackRef.current(response.credential);
                        else setError('Google did not return a sign-in credential. Please try again.');
                    },
                    cancel_on_tap_outside: true,
                });
                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: 'outline',
                    size: 'large',
                    shape: 'rectangular',
                    text: 'continue_with',
                    width: Math.min(buttonRef.current.clientWidth || 320, 360),
                });
            })
            .catch((loadError) => {
                if (mounted) setError(loadError.message);
            });

        return () => { mounted = false; };
    }, [clientId]);

    return (
        <Box sx={{ width: '100%', minHeight: 42, display: 'grid', placeItems: 'center', mb: 2 }}>
            {disabled && <CircularProgress size={22} />}
            <Box ref={buttonRef} sx={{ width: '100%', display: disabled ? 'none' : 'flex', justifyContent: 'center' }} />
            {error && <Alert severity="info" sx={{ width: '100%', mt: 1 }}>{error}</Alert>}
        </Box>
    );
}
