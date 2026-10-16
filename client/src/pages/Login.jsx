import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box, TextField, Button, Typography, Paper, InputAdornment,
    IconButton, Alert, CircularProgress, Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { motion } from 'framer-motion';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleGoogleCredential = async (credential) => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle(credential);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Determine if input is email
            const isEmail = identifier.includes('@');
            await login(isEmail ? identifier : undefined, password, !isEmail ? identifier : undefined);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    className="glass-card"
                    sx={{
                        p: 4,
                        width: '100%',
                        maxWidth: 400,
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--card-border)'
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom fontWeight="bold" className="gradient-text">
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                        Enter your credentials to access your account
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email or Username"
                            variant="outlined"
                            margin="normal"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: 'var(--text-secondary)' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--text-primary)',
                                    '& fieldset': { borderColor: 'var(--card-border-strong)' },
                                    '&:hover fieldset': { borderColor: 'var(--primary-color)' },
                                },
                                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: 'var(--text-secondary)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: 'var(--text-secondary)' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--text-primary)',
                                    '& fieldset': { borderColor: 'var(--card-border-strong)' },
                                    '&:hover fieldset': { borderColor: 'var(--primary-color)' },
                                },
                                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: 'linear-gradient(to right, var(--primary-strong), var(--secondary-color))',
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </form>

                    <Divider sx={{ my: 2, borderColor: 'var(--card-border)' }}>OR</Divider>

                    <GoogleSignInButton onCredential={handleGoogleCredential} disabled={loading} />

                    <Typography align="center" sx={{ color: 'var(--text-secondary)', mt: 2 }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Register
                        </Link>
                    </Typography>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Login;
