import { useState } from 'react';
import axios from 'axios';
import {
    Box, TextField, Button, Typography, Grid, Paper, CircularProgress,
    Alert, CardContent, Avatar, Chip
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

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
                axios.get(`${import.meta.env.VITE_API_URL}/cf/user/${handle1}`),
                axios.get(`${import.meta.env.VITE_API_URL}/cf/user/${handle2}`),
                axios.get(`${import.meta.env.VITE_API_URL}/cf/user/${handle1}/rating`),
                axios.get(`${import.meta.env.VITE_API_URL}/cf/user/${handle2}/rating`),
                axios.get(`${import.meta.env.VITE_API_URL}/cf/user/${handle1}/status`).catch(() => ({ data: [] })),
                axios.get(`${import.meta.env.VITE_API_URL}/cf/user/${handle2}/status`).catch(() => ({ data: [] }))
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

    const getSolvedByRatingData = () => {
        if (!submissions1 || !submissions2) return [];

        const processSubmissions = (subs) => {
            const counts = {};
            subs.forEach(s => {
                if (s.verdict === 'OK' && s.problem.rating) {
                    counts[s.problem.rating] = (counts[s.problem.rating] || 0) + 1;
                }
            });
            return counts;
        };

        const counts1 = processSubmissions(submissions1);
        const counts2 = processSubmissions(submissions2);

        const allRatings = new Set([...Object.keys(counts1), ...Object.keys(counts2)]);

        return Array.from(allRatings)
            .map(r => ({
                rating: parseInt(r),
                [handle1]: counts1[r] || 0,
                [handle2]: counts2[r] || 0
            }))
            .sort((a, b) => a.rating - b.rating);
    };

    const solvedByRatingData = getSolvedByRatingData();

    const calculateStats = (submissions, ratings) => {
        // Use standard Codeforces problem identifier: contestId + index
        const solved = new Set(submissions
            .filter(s => s.verdict === 'OK')
            .map(s => `${s.problem.contestId}-${s.problem.index}`)
        ).size;

        let avgRank = 0;
        if (ratings.length > 0) {
            avgRank = Math.round(ratings.reduce((acc, curr) => acc + curr.rank, 0) / ratings.length);
        }

        return { solved, total: submissions.length, avgRank };
    };

    const stats1 = calculateStats(submissions1, rating1);
    const stats2 = calculateStats(submissions2, rating2);

    const comparisonData = [
        { metric: 'Current Rating', user1: data1?.rating || 0, user2: data2?.rating || 0, diff: true },
        { metric: 'Max Rating', user1: data1?.maxRating || 0, user2: data2?.maxRating || 0, diff: true },
        { metric: 'Average Rank', user1: stats1.avgRank, user2: stats2.avgRank, diff: true, reverse: true }, // Lower rank is better
        { metric: 'Solved Problems', user1: stats1.solved, user2: stats2.solved, diff: true },
        { metric: 'Total Submissions', user1: stats1.total, user2: stats2.total, diff: false },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold" textAlign="center" mb={4}>
                Profile Comparison
            </Typography>

            <Paper className="glass-card" sx={{ p: 4, mb: 4, maxWidth: 800, mx: 'auto' }}>
                <form onSubmit={handleCompare}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                label="Handle 1"
                                variant="outlined"
                                value={handle1}
                                onChange={(e) => setHandle1(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&:hover fieldset': { borderColor: '#6366f1' },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2} textAlign="center">
                            <Typography variant="h6" fontWeight="bold" color="text.secondary">VS</Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                label="Handle 2"
                                variant="outlined"
                                value={handle2}
                                onChange={(e) => setHandle2(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&:hover fieldset': { borderColor: '#a855f7' },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(to right, #6366f1, #a855f7)',
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Compare Profiles'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>

            {data1 && data2 && (
                <Box>
                    {/* Versus Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} sx={{ flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        {/* User 1 */}
                        <Paper className="glass-card" sx={{ p: 4, width: '100%', maxWidth: 350, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                                background: '#6366f1'
                            }} />
                            <Avatar src={data1.titlePhoto} sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #6366f1' }} />
                            <Typography variant="h4" fontWeight="bold">{data1.handle}</Typography>
                            <Chip label={data1.rank} sx={{ mt: 1, bgcolor: '#6366f1', color: 'white', fontWeight: 'bold' }} />
                        </Paper>

                        <Typography variant="h3" fontWeight="900" className="gradient-text">VS</Typography>

                        {/* User 2 */}
                        <Paper className="glass-card" sx={{ p: 4, width: '100%', maxWidth: 350, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                                background: '#a855f7'
                            }} />
                            <Avatar src={data2.titlePhoto} sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #a855f7' }} />
                            <Typography variant="h4" fontWeight="bold">{data2.handle}</Typography>
                            <Chip label={data2.rank} sx={{ mt: 1, bgcolor: '#a855f7', color: 'white', fontWeight: 'bold' }} />
                        </Paper>
                    </Box>

                    {/* Comparison Stats List */}
                    <Paper className="glass-card" sx={{ p: 0, mb: 4, overflow: 'hidden' }}>
                        {comparisonData.map((item, idx) => {
                            const diffVal = item.user1 - item.user2;
                            const isbetter = item.reverse ? (diffVal < 0) : (diffVal > 0);
                            const color = diffVal === 0 ? 'text.secondary' : isbetter ? '#4ade80' : '#f87171'; // Green if User 1 is better

                            // Determine winner for this row
                            const user1Wins = item.reverse ? (item.user1 < item.user2) : (item.user1 > item.user2);
                            const user2Wins = item.reverse ? (item.user2 < item.user1) : (item.user2 > item.user1);
                            const isTie = item.user1 === item.user2;

                            return (
                                <Box key={idx} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 3,
                                    borderBottom: idx !== comparisonData.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                                }}>
                                    {/* User 1 Value */}
                                    <Box flex={1} textAlign="right">
                                        <Typography variant="h5" fontWeight="bold" color={user1Wins ? '#6366f1' : 'text.secondary'}>
                                            {item.user1}
                                        </Typography>
                                    </Box>

                                    {/* Metric Label */}
                                    <Box flex={1} textAlign="center" px={2}>
                                        <Typography variant="button" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{item.metric}</Typography>
                                        {item.diff && !isTie && (
                                            <Chip
                                                label={`${Math.abs(diffVal)} ${user1Wins ? 'Higher' : 'Lower'}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: user1Wins ? 'rgba(99, 102, 241, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                                                    color: user1Wins ? '#6366f1' : '#a855f7',
                                                    fontWeight: 'bold',
                                                    height: 20,
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* User 2 Value */}
                                    <Box flex={1} textAlign="left">
                                        <Typography variant="h5" fontWeight="bold" color={user2Wins ? '#a855f7' : 'text.secondary'}>
                                            {item.user2}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Paper>

                    {/* Chart */}
                    <Paper className="glass-card" sx={{ p: 4, height: 500, mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">Rating Trajectory</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="time"
                                    type="number"
                                    domain={[startTimeMs, 'auto']}
                                    scale="time"
                                    tick={false}
                                    stroke="#94a3b8"
                                    label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    label={{ value: 'Rating', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }}
                                />
                                <Tooltip labelFormatter={(time) => new Date(time).toLocaleDateString()} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
                                <Legend wrapperStyle={{ paddingTop: 20 }} />
                                <Line type="monotone" name={handle1} dataKey={handle1} stroke="#6366f1" strokeWidth={3} dot={false} connectNulls activeDot={{ r: 6 }} />
                                <Line type="monotone" name={handle2} dataKey={handle2} stroke="#a855f7" strokeWidth={3} dot={false} connectNulls activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>

                    {/* Solved by Rating Chart */}
                    <Paper className="glass-card" sx={{ p: 4, height: 600 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">Problems Solved by Rating</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={solvedByRatingData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="rating"
                                    type="category"
                                    stroke="#94a3b8"
                                    tick={false}
                                    label={{ value: 'Rating', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    type="number"
                                    stroke="#94a3b8"
                                    label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: 20 }} />
                                <Bar dataKey={handle1} name={handle1} fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey={handle2} name={handle2} fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default Compare;
