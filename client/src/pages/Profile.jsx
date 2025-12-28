import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Box, Typography, Paper, TextField, Button, Grid, Avatar,
    Alert, CircularProgress, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [cfHandle, setCfHandle] = useState(user?.codeforces_handle || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Update user profile via API
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/users/profile`,
                { email, codeforces_handle: cfHandle },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateUser(res.data);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={800} mx="auto">
            <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold">
                Profile Settings
            </Typography>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper className="glass-card" sx={{ p: 4, mt: 2 }}>
                    <Box display="flex" alignItems="center" gap={3} mb={4}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: 'var(--primary-color)',
                                fontSize: '2.5rem'
                            }}
                        >
                            {user?.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {user?.username}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Member since {new Date(user?.created_at).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                    {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={user?.username || ''}
                                    disabled
                                    InputProps={{
                                        startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                    }}
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: 'rgba(255,255,255,0.5)',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Codeforces Handle"
                                    value={cfHandle}
                                    onChange={(e) => setCfHandle(e.target.value)}
                                    helperText="Link your Codeforces account to see your stats"
                                    InputProps={{
                                        startAdornment: <CodeIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                    sx={{
                                        background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                                        minWidth: 150
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Profile;
