import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Box, Typography, Grid, Paper, CircularProgress, Button,
    Card, CardContent, Avatar, Chip, Alert
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#6366f1', '#a855f7'];

const Dashboard = () => {
    const { user } = useAuth();
    const [cfData, setCfData] = useState(null);
    const [ratingHistory, setRatingHistory] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.codeforces_handle) {
                setLoading(false);
                return;
            }

            try {
                const [userInfo, ratings, subs] = await Promise.all([
                    axios.get(`http://localhost:5001/api/cf/user/${user.codeforces_handle}`),
                    axios.get(`http://localhost:5001/api/cf/user/${user.codeforces_handle}/rating`),
                    axios.get(`http://localhost:5001/api/cf/user/${user.codeforces_handle}/status`)
                ]);

                setCfData(userInfo.data);
                setRatingHistory(ratings.data);
                setSubmissions(subs.data);
            } catch (err) {
                console.error('Error fetching CF data:', err);
                setError('Failed to fetch Codeforces data. Please check your handle.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!user?.codeforces_handle) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
                <Typography variant="h5" gutterBottom>
                    Please link your Codeforces handle in your Profile to see your stats.
                </Typography>
                <Button variant="contained" href="/profile" sx={{ mt: 2 }}>
                    Go to Profile
                </Button>
            </Box>
        );
    }

    // Process data for charts
    const verdictData = submissions.reduce((acc, sub) => {
        const verdict = sub.verdict === 'OK' ? 'Accepted' : sub.verdict;
        const existing = acc.find(item => item.name === verdict);
        if (existing) {
            existing.value++;
        } else {
            acc.push({ name: verdict, value: 1 });
        }
        return acc;
    }, []);

    const tagsData = submissions.reduce((acc, sub) => {
        if (sub.verdict === 'OK' && sub.problem.tags) {
            sub.problem.tags.forEach(tag => {
                const existing = acc.find(item => item.name === tag);
                if (existing) {
                    existing.value++;
                } else {
                    acc.push({ name: tag, value: 1 });
                }
            });
        }
        return acc;
    }, []).sort((a, b) => b.value - a.value).slice(0, 10);

    const formattedRatingHistory = ratingHistory.map(r => ({
        ...r,
        date: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
    }));

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold">
                Dashboard
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* User Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Paper className="glass-card" sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={cfData?.titlePhoto} sx={{ width: 60, height: 60 }} />
                            <Box>
                                <Typography variant="h6" fontWeight="bold">{cfData?.handle}</Typography>
                                <Typography variant="body2" color="text.secondary">{cfData?.rank}</Typography>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={3}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Paper className="glass-card" sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <TrendingUpIcon color="primary" />
                                <Typography variant="subtitle2">Current Rating</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">{cfData?.rating}</Typography>
                            <Typography variant="caption" color="text.secondary">Max: {cfData?.maxRating}</Typography>
                        </Paper>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={3}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Paper className="glass-card" sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <CodeIcon color="secondary" />
                                <Typography variant="subtitle2">Solved</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                {submissions.filter(s => s.verdict === 'OK').length}
                            </Typography>
                        </Paper>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={3}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Paper className="glass-card" sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <AssignmentIcon color="success" />
                                <Typography variant="subtitle2">Submissions</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">{submissions.length}</Typography>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Rating History</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedRatingHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Line type="monotone" dataKey="newRating" stroke="#6366f1" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Verdicts</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={verdictData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {verdictData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Top Tags</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tagsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Bar dataKey="value" fill="#a855f7" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
