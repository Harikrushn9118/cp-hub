import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Grid, Paper, Chip, CircularProgress, Button,
    TextField, InputAdornment, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/cf/contests`);
                // Filter for upcoming or current contests (phase: BEFORE or CODING)
                const activeContests = res.data.filter(c => c.phase === 'BEFORE' || c.phase === 'CODING');
                setContests(activeContests);
                setFilteredContests(activeContests);
            } catch (err) {
                console.error('Error fetching contests:', err);
                setError('Failed to fetch contests.');
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredContests(contests);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredContests(contests.filter(c => c.name.toLowerCase().includes(query)));
        }
    }, [searchQuery, contests]);

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const formatStartTime = (seconds) => {
        return new Date(seconds * 1000).toLocaleString();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold">
                Upcoming Contests
            </Typography>

            <Paper className="glass-card" sx={{ p: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search contests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {filteredContests.length === 0 ? (
                <Paper className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">No upcoming contests found.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {filteredContests.map((contest) => (
                        <Grid item xs={12} key={contest.id}>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Paper
                                    className="glass-card"
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        borderLeft: contest.phase === 'CODING' ? '4px solid #10b981' : '4px solid #6366f1'
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="#fff">
                                            {contest.name}
                                        </Typography>
                                        <Box display="flex" gap={3} mt={1} color="text.secondary">
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <EventIcon fontSize="small" />
                                                <Typography variant="body2">{formatStartTime(contest.startTimeSeconds)}</Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <AccessTimeIcon fontSize="small" />
                                                <Typography variant="body2">{formatDuration(contest.durationSeconds)}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexDirection="column" gap={1} alignItems="flex-end">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {contest.phase === 'CODING' ? (
                                                <Chip label="LIVE" color="success" size="small" />
                                            ) : (
                                                ((contest.startTimeSeconds * 1000) - Date.now()) < 172800000 ? (
                                                    // Less than 48 hours (assumed registration open)
                                                    <Typography variant="caption" color="warning.main" fontWeight="bold">
                                                        Registration closes soon
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Registration opens in ~{formatDuration(((contest.startTimeSeconds * 1000) - Date.now() - 172800000) / 1000)}
                                                    </Typography>
                                                )
                                            )}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            href={`https://codeforces.com/contest/${contest.id}`}
                                            target="_blank"
                                            sx={{
                                                bgcolor: contest.phase === 'CODING' ? 'success.main' : 'primary.main',
                                                '&:hover': {
                                                    bgcolor: contest.phase === 'CODING' ? 'success.dark' : 'primary.dark',
                                                }
                                            }}
                                        >
                                            {contest.phase === 'CODING' ? 'Enter Arena' : 'Register / Enter'}
                                        </Button>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Contests;
