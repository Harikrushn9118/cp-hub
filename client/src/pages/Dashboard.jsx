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
                <Grid item xs={12} md={4} lg={2}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Paper className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Avatar src={cfData?.titlePhoto} sx={{ width: 80, height: 80, mb: 1 }} />
                            <Typography variant="h6" fontWeight="bold">{cfData?.handle}</Typography>
                            <Chip label={cfData?.rank} color="primary" size="small" />
                        </Paper>
                    </motion.div>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Paper className="glass-card" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <TrendingUpIcon color="primary" />
                                <Typography variant="subtitle2">Rating</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold">{cfData?.rating}</Typography>
                            <Typography variant="caption" color="text.secondary">Max: {cfData?.maxRating}</Typography>
                        </Paper>
                    </motion.div>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Paper className="glass-card" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <EmojiEventsIcon color="secondary" />
                                <Typography variant="subtitle2">Contribution</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold">{cfData?.contribution}</Typography>
                            <Typography variant="caption" color="text.secondary">Friends: {cfData?.friendOfCount}</Typography>
                        </Paper>
                    </motion.div>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Paper className="glass-card" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <CodeIcon color="success" />
                                <Typography variant="subtitle2">Solved</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold">
                                {submissions.filter(s => s.verdict === 'OK').length}
                            </Typography>
                        </Paper>
                    </motion.div>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Paper className="glass-card" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <AssignmentIcon color="warning" />
                                <Typography variant="subtitle2">Submissions</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold">{submissions.length}</Typography>
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
                            <LineChart data={formattedRatingHistory} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    tick={false}
                                    label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    domain={['auto', 'auto']}
                                    label={{ value: 'Rating', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Line type="monotone" dataKey="newRating" stroke="#6366f1" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Last 5 Contests */}
                {/* Last 5 Contests */}
                <Grid item xs={12} lg={4}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400, overflowY: 'auto', overflowX: 'hidden' }}>
                        <Typography variant="h6" gutterBottom>Last 5 Contests</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            {ratingHistory.slice(-5).reverse().map((contest, idx) => {
                                const diff = contest.newRating - contest.oldRating;
                                return (
                                    <Box key={idx} sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">{contest.contestName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Rank: {contest.rank}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{ color: diff >= 0 ? '#4ade80' : '#f87171' }}
                                        >
                                            {diff > 0 ? `+${diff}` : diff}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
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

                <Grid item xs={12} lg={6}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Top Tags</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tagsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={60}
                                    label={{ value: 'Topic', position: 'insideBottom', offset: -50, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }}
                                />
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

                {/* Problems Solved by Rating */}
                <Grid item xs={12}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Problems Solved by Rating</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={
                                (() => {
                                    const ratingCounts = {};
                                    submissions.forEach(s => {
                                        if (s.verdict === 'OK' && s.problem.rating) {
                                            ratingCounts[s.problem.rating] = (ratingCounts[s.problem.rating] || 0) + 1;
                                        }
                                    });
                                    return Object.keys(ratingCounts)
                                        .map(r => ({ rating: parseInt(r), count: ratingCounts[r] }))
                                        .sort((a, b) => a.rating - b.rating);
                                })()
                            }
                                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="rating"
                                    stroke="#94a3b8"
                                    tick={false}
                                    label={{ value: 'Rating', position: 'insideBottom', offset: -35, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Bar dataKey="count" fill="#6366f1" name="Solved By Rating" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid >
        </Box >
    );
};

export default Dashboard;
