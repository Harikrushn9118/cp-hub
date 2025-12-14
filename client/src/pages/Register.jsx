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

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfHandle, setCfHandle] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, googleLogin, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Initialize Google Sign-In
    useEffect(() => {
        /* global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with actual Client ID
                callback: handleGoogleResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("googleSignUpDiv"),
                { theme: "filled_black", size: "large", width: "100%" }
            );
        }
    }, []);

    const handleGoogleResponse = async (response) => {
        try {
            setLoading(true);
            await googleLogin(response.credential);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google signup failed');
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
            setError(err.response?.data?.message || 'Failed to register');
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
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom fontWeight="bold" className="gradient-text">
                        Create Account
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ color: '#94a3b8', mb: 3 }}>
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
                                        <PersonIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: '#6366f1' },
                                },
                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                        <EmailIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: '#6366f1' },
                                },
                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                        <CodeIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: '#6366f1' },
                                },
                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                        <LockIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: '#94a3b8' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: '#6366f1' },
                                },
                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                        </Button>
                    </form>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }}>OR</Divider>

                    <Box id="googleSignUpDiv" sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}></Box>

                    <Typography align="center" sx={{ color: '#94a3b8', mt: 2 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>
                            Login
                        </Link>
                    </Typography>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Register;
