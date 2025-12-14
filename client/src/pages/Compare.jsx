import { useState } from 'react';
import axios from 'axios';
import {
    Box, TextField, Button, Typography, Grid, Paper, CircularProgress,
    Alert, Card, CardContent, Stack, Divider, Chip
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from 'recharts';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const Compare = () => {
    const [handle1, setHandle1] = useState('');
    const [handle2, setHandle2] = useState('');
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [rating1, setRating1] = useState([]);
    const [rating2, setRating2] = useState([]);
    const [submissions1, setSubmissions1] = useState([]);
    const [submissions2, setSubmissions2] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async (e) => {
        e.preventDefault();
        if (!handle1 || !handle2) {
            setError('Please enter both handles');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const [u1, u2, r1, r2, s1, s2] = await Promise.all([
                axios.get(`http://localhost:5001/api/cf/user/${handle1}`),
                axios.get(`http://localhost:5001/api/cf/user/${handle2}`),
                axios.get(`http://localhost:5001/api/cf/user/${handle1}/rating`),
                axios.get(`http://localhost:5001/api/cf/user/${handle2}/rating`),
                axios.get(`http://localhost:5001/api/cf/user/${handle1}/status`).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5001/api/cf/user/${handle2}/status`).catch(() => ({ data: [] }))
            ]);
            setData1(u1.data);
            setData2(u2.data);
            setRating1(r1.data);
            setRating2(r2.data);
            setSubmissions1(s1.data || []);
            setSubmissions2(s2.data || []);
        } catch (err) {
            setError('Error fetching data. Please check if the handles are correct.');
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        if (!data1 || !data2) return [];

        const reg1 = data1.registrationTimeSeconds;
        const reg2 = data2.registrationTimeSeconds;
        const twoYearsAgo = Math.floor(Date.now() / 1000) - (2 * 365 * 24 * 60 * 60);
        const minReg = Math.min(reg1, reg2);
        const startTime = Math.max(minReg, twoYearsAgo);

        const allPoints = [];

        const processUserRatings = (ratings, handle) => {
            ratings.forEach(r => {
                if (r.ratingUpdateTimeSeconds >= startTime) {
                    allPoints.push({
                        time: r.ratingUpdateTimeSeconds * 1000,
                        [handle]: r.newRating,
                        dateStr: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
                    });
                }
            });
        };

        processUserRatings(rating1, handle1);
        processUserRatings(rating2, handle2);

        return allPoints.sort((a, b) => a.time - b.time);
    };

    const chartData = getChartData();
    const startTimeMs = chartData.length > 0 ? chartData[0].time : Date.now();

    const calculateStats = (submissions) => {
        const solved = new Set(submissions
            .filter(s => s.verdict === 'OK')
            .map(s => `${s.problem.contestId}${s.problem.index}`)
        ).size;
        return { solved, total: submissions.length };
    };

    const stats1 = calculateStats(submissions1);
    const stats2 = calculateStats(submissions2);

    const comparisonData = [
        { metric: 'Rating', user1: data1?.rating || 0, user2: data2?.rating || 0 },
        { metric: 'Max Rating', user1: data1?.maxRating || 0, user2: data2?.maxRating || 0 },
        { metric: 'Solved Problems', user1: stats1.solved, user2: stats2.solved },
        { metric: 'Total Submissions', user1: stats1.total, user2: stats2.total },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold">
                Compare Profiles
            </Typography>

            <Paper className="glass-card" sx={{ p: 3, mb: 4 }}>
                <form onSubmit={handleCompare}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="Handle 1"
                                value={handle1}
                                onChange={(e) => setHandle1(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="Handle 2"
                                value={handle2}
                                onChange={(e) => setHandle2(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ background: 'var(--primary-color)' }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Compare'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>

            {data1 && data2 && (
                <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Paper className="glass-card" sx={{ p: 3, textAlign: 'center' }}>
                                <Avatar src={data1.titlePhoto} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                                <Typography variant="h5" fontWeight="bold">{data1.handle}</Typography>
                                <Chip label={data1.rank} color="primary" sx={{ mt: 1 }} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper className="glass-card" sx={{ p: 3, textAlign: 'center' }}>
                                <Avatar src={data2.titlePhoto} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                                <Typography variant="h5" fontWeight="bold">{data2.handle}</Typography>
                                <Chip label={data2.rank} color="secondary" sx={{ mt: 1 }} />
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {comparisonData.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>{item.metric}</Typography>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="h6">{item.user1}</Typography>
                                            <Typography variant="h6">{item.user2}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Rating Comparison</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="time" 
                                    type="number" 
                                    domain={[startTimeMs, 'auto']} 
                                    scale="time" 
                                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                                    stroke="#94a3b8"
                                />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip labelFormatter={(time) => new Date(time).toLocaleDateString()} contentStyle={{ backgroundColor: '#1e293b' }} />
                                <Legend />
                                <Line type="monotone" dataKey={handle1} stroke="#6366f1" strokeWidth={2} dot={false} connectNulls />
                                <Line type="monotone" dataKey={handle2} stroke="#a855f7" strokeWidth={2} dot={false} connectNulls />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default Compare;
