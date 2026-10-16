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
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import { motion } from 'framer-motion';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfHandle, setCfHandle] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, loginWithGoogle, user } = useAuth();
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
            setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Google signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(username, email, password, cfHandle);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="90vh"
            py={4}
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
                        Create Account
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                        Join CP Analyzer to track your progress
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: 'var(--text-secondary)' }} />
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
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            label="Codeforces Handle (Optional)"
                            variant="outlined"
                            margin="normal"
                            value={cfHandle}
                            onChange={(e) => setCfHandle(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CodeIcon sx={{ color: 'var(--text-secondary)' }} />
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                        </Button>
                    </form>

                    <Divider sx={{ my: 2, borderColor: 'var(--card-border)' }}>OR</Divider>

                    <GoogleSignInButton onCredential={handleGoogleCredential} disabled={loading} />

                    <Typography align="center" sx={{ color: 'var(--text-secondary)', mt: 2 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Login
                        </Link>
                    </Typography>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Register;
