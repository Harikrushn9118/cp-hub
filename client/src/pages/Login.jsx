import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Alert, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
                    callback: handleGoogleResponse,
                });
            }
        };

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleGoogleResponse = async (response) => {
        try {
            await loginWithGoogle(response.credential);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login with Google');
        }
    };

    const handleGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.prompt();
        } else {
            setError('Google Sign-In is not available. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper className="glass-card" sx={{ p: 4, width: 400, maxWidth: '90vw', backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
                    <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold" textAlign="center">
                        Welcome Back
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ffffff' }}>{error}</Alert>}

                    {/* Google Login Button */}
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                        sx={{
                            mb: 2,
                            py: 1.5,
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: '#ffffff',
                            '&:hover': {
                                borderColor: '#4285f4',
                                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                            }
                        }}
                    >
                        Continue with Google
                    </Button>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', px: 2 }}>
                            OR
                        </Typography>
                    </Divider>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            placeholder="Email"
                            variant="outlined"
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                    color: '#ffffff',
                                    '& fieldset': { 
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        borderWidth: '1.5px'
                                    },
                                    '&:hover fieldset': { 
                                        borderColor: 'rgba(99, 102, 241, 0.6)',
                                    },
                                    '&.Mui-focused fieldset': { 
                                        borderColor: 'var(--primary-color)',
                                        borderWidth: '2px'
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#ffffff',
                                    '&::placeholder': {
                                        color: 'rgba(255,255,255,0.5)',
                                        opacity: 1
                                    }
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            placeholder="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                    color: '#ffffff',
                                    '& fieldset': { 
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        borderWidth: '1.5px'
                                    },
                                    '&:hover fieldset': { 
                                        borderColor: 'rgba(99, 102, 241, 0.6)',
                                    },
                                    '&.Mui-focused fieldset': { 
                                        borderColor: 'var(--primary-color)',
                                        borderWidth: '2px'
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#ffffff',
                                    '&::placeholder': {
                                        color: 'rgba(255,255,255,0.5)',
                                        opacity: 1
                                    }
                                }
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                mb: 2,
                                background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: 'linear-gradient(to right, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9))',
                                }
                            }}
                        >
                            Login
                        </Button>
                    </form>

                    <Typography textAlign="center" sx={{ color: '#cbd5e1' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
                    </Typography>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Login;
