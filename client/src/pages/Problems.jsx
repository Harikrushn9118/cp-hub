import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Box, Typography, Grid, Paper, Chip, IconButton, TextField, Button, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton,
    InputAdornment, Alert, Skeleton, Stack, Switch, FormControlLabel
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';

// Common Codeforces tags
const POPULAR_TAGS = [
    'implementation', 'math', 'greedy', 'dp', 'graphs', 'strings', 'geometry',
    'binary search', 'brute force', 'constructive algorithms', 'sortings',
    'number theory', 'combinatorics', 'two pointers', 'dfs and similar',
    'trees', 'data structures', 'bitmasks', 'hashing', 'shortest paths',
    'divide and conquer', 'games', 'flows', 'probabilities', 'meet-in-the-middle'
];

// Rating ranges - 200 point increments
const RATING_RANGES = [
    { label: 'All', min: 0, max: 5000 },
    { label: '800-1000', min: 800, max: 1000 },
    { label: '1000-1200', min: 1000, max: 1200 },
    { label: '1200-1400', min: 1200, max: 1400 },
    { label: '1400-1600', min: 1400, max: 1600 },
    { label: '1600-1800', min: 1600, max: 1800 },
    { label: '1800-2000', min: 1800, max: 2000 },
    { label: '2000-2200', min: 2000, max: 2200 },
    { label: '2200-2400', min: 2200, max: 2400 },
    { label: '2400-2600', min: 2400, max: 2600 },
];

const getRatingColor = (rating) => {
    if (!rating) return '#94a3b8';
    if (rating < 1200) return '#808080';
    if (rating < 1400) return '#008000';
    if (rating < 1600) return '#03a89e';
    if (rating < 1900) return '#0000ff';
    if (rating < 2100) return '#a0a';
    if (rating < 2400) return '#ff8c00';
    if (rating < 3000) return '#ff0000';
    return '#aa0000';
};

const Problems = () => {
    const { user } = useAuth();
    const [allProblems, setAllProblems] = useState([]);
    const [problemStats, setProblemStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('solved');
    const [showOnlySolved, setShowOnlySolved] = useState(false);
    const [bookmarks, setBookmarks] = useState(new Set());
    const [bookmarkMap, setBookmarkMap] = useState(new Map());
    const [solvedProblems, setSolvedProblems] = useState(new Set());
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookmarks();
        fetchProblems();
        if (user?.codeforces_handle) {
            fetchSolvedProblems();
        }
    }, [user]);

    const fetchBookmarks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/users/bookmarks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const bookmarkedIds = new Set(res.data.map(b => b.problem_id));
            const bookmarkIdMap = new Map(res.data.map(b => [b.problem_id, b.id]));
            setBookmarks(bookmarkedIds);
            setBookmarkMap(bookmarkIdMap);
        } catch (error) {
            console.error('Error fetching bookmarks', error);
        }
    };

    const fetchSolvedProblems = async () => {
        if (!user?.codeforces_handle) return;
        
        try {
            const res = await axios.get(`http://localhost:5001/api/cf/user/${user.codeforces_handle}/status`);
            if (res.data && Array.isArray(res.data)) {
                const solved = new Set();
                res.data.forEach(submission => {
                    if (submission.verdict === 'OK' && submission.problem) {
                        const problemId = `${submission.problem.contestId}${submission.problem.index}`;
                        solved.add(problemId);
                    }
                });
                setSolvedProblems(solved);
            }
        } catch (error) {
            console.error('Error fetching solved problems', error);
        }
    };

    const fetchProblems = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('http://localhost:5001/api/cf/problems');
            if (res.data && res.data.problems) {
                setAllProblems(res.data.problems);
                setProblemStats(res.data.problemStatistics || []);
            } else if (Array.isArray(res.data)) {
                setAllProblems(res.data);
                setProblemStats([]);
            } else {
                setError('No problems found');
            }
        } catch (error) {
            console.error('Error fetching problems', error);
            setError('Failed to fetch problems. Please try again.');
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const toggleBookmark = async (problem) => {
        const problemId = `${problem.contestId}${problem.index}`;
        const isBookmarked = bookmarks.has(problemId);
        const token = localStorage.getItem('token');
        
        try {
            if (isBookmarked) {
                const bookmarkId = bookmarkMap.get(problemId);
                if (bookmarkId) {
                    await axios.delete(`http://localhost:5001/api/users/bookmarks/${bookmarkId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setBookmarks(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(problemId);
                        return newSet;
                    });
                    setBookmarkMap(prev => {
                        const newMap = new Map(prev);
                        newMap.delete(problemId);
                        return newMap;
                    });
                }
            } else {
                const res = await axios.post('http://localhost:5001/api/users/bookmarks', {
                    problem_id: problemId,
                    problem_name: problem.name,
                    rating: problem.rating,
                    tags: problem.tags
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookmarks(prev => new Set(prev).add(problemId));
                setBookmarkMap(prev => new Map(prev).set(problemId, res.data.id));
            }
        } catch (error) {
            console.error('Error toggling bookmark', error);
        }
    };

    const statsMap = useMemo(() => {
        const map = new Map();
        problemStats.forEach(stat => {
            const key = `${stat.contestId}${stat.index}`;
            map.set(key, stat);
        });
        return map;
    }, [problemStats]);

    const filteredProblems = useMemo(() => {
        let filtered = [...allProblems];

        if (showOnlySolved) {
            filtered = filtered.filter(problem => {
                const problemId = `${problem.contestId}${problem.index}`;
                return solvedProblems.has(problemId);
            });
        }

        if (selectedTags.length > 0) {
            filtered = filtered.filter(problem => 
                selectedTags.every(tag => problem.tags?.includes(tag))
            );
        }

        if (selectedRating) {
            filtered = filtered.filter(problem => {
                if (!problem.rating) return false;
                return problem.rating >= selectedRating.min && problem.rating <= selectedRating.max;
            });
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(problem => 
                problem.name?.toLowerCase().includes(query) ||
                `${problem.contestId}${problem.index}`.toLowerCase().includes(query)
            );
        }

        filtered.sort((a, b) => {
            const keyA = `${a.contestId}${a.index}`;
            const keyB = `${b.contestId}${b.index}`;
            const statA = statsMap.get(keyA);
            const statB = statsMap.get(keyB);
            
            switch (sortBy) {
                case 'solved':
                    const solvedA = statA?.solvedCount || 0;
                    const solvedB = statB?.solvedCount || 0;
                    if (solvedB !== solvedA) return solvedB - solvedA;
                    return (a.rating || 9999) - (b.rating || 9999);
                case 'rating-asc':
                    return (a.rating || 9999) - (b.rating || 9999);
                case 'rating-desc':
                    return (b.rating || 0) - (a.rating || 0);
                case 'name':
                    return a.name?.localeCompare(b.name) || 0;
                case 'contest':
                    return b.contestId - a.contestId;
                default:
                    const solvedCountA = statA?.solvedCount || 0;
                    const solvedCountB = statB?.solvedCount || 0;
                    if (solvedCountB !== solvedCountA) return solvedCountB - solvedCountA;
                    return (a.rating || 9999) - (b.rating || 9999);
            }
        });

        return filtered;
    }, [allProblems, problemStats, selectedTags, selectedRating, searchQuery, sortBy, showOnlySolved, solvedProblems, statsMap]);

    if (initialLoad) {
        return (
            <Box>
                <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold">
                    Problem Recommender
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {[...Array(6)].map((_, i) => (
                        <Grid item xs={12} md={6} lg={4} key={i}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold">
                Problem Recommender
            </Typography>

            <Paper className="glass-card" sx={{ p: 3, mb: 3, backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        placeholder="Search problems by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                color: '#ffffff',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.6)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--primary-color)' },
                            },
                            '& .MuiInputBase-input': { color: '#ffffff' }
                        }}
                    />

                    {user?.codeforces_handle && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showOnlySolved}
                                    onChange={(e) => setShowOnlySolved(e.target.checked)}
                                />
                            }
                            label={<Typography sx={{ color: '#e2e8f0' }}>Show My Solved Problems Only</Typography>}
                        />
                    )}

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#e2e8f0', fontWeight: 600 }}>
                            Select Rating Range
                        </Typography>
                        <ToggleButtonGroup
                            value={selectedRating?.label || 'All'}
                            exclusive
                            onChange={(e, value) => {
                                if (value) {
                                    const range = RATING_RANGES.find(r => r.label === value);
                                    setSelectedRating(range?.label === 'All' ? null : range);
                                }
                            }}
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                        >
                            {RATING_RANGES.map((range) => (
                                <ToggleButton 
                                    key={range.label} 
                                    value={range.label}
                                    sx={{ 
                                        color: '#cbd5e1', 
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        '&.Mui-selected': { backgroundColor: 'var(--primary-color)', color: '#fff' }
                                    }}
                                >
                                    {range.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#e2e8f0', fontWeight: 600 }}>
                            Select Topics
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {POPULAR_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onClick={() => toggleTag(tag)}
                                        sx={{
                                            backgroundColor: isSelected ? 'var(--primary-color)' : 'rgba(15, 23, 42, 0.6)',
                                            color: isSelected ? '#ffffff' : '#cbd5e1',
                                            cursor: 'pointer',
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel sx={{ color: '#cbd5e1' }}>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                label="Sort By"
                                sx={{ color: '#ffffff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
                            >
                                <MenuItem value="solved">Most Solved</MenuItem>
                                <MenuItem value="rating-asc">Rating (Low to High)</MenuItem>
                                <MenuItem value="rating-desc">Rating (High to Low)</MenuItem>
                                <MenuItem value="name">Name (A-Z)</MenuItem>
                                <MenuItem value="contest">Contest ID</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Showing {filteredProblems.length} of {allProblems.length} problems
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <CircularProgress />
            ) : filteredProblems.length === 0 ? (
                <Paper className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#cbd5e1' }}>No problems found.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    <AnimatePresence>
                        {filteredProblems.slice(0, 100).map((problem) => {
                            const problemId = `${problem.contestId}${problem.index}`;
                            const isBookmarked = bookmarks.has(problemId);
                            const isSolved = solvedProblems.has(problemId);
                            const ratingColor = getRatingColor(problem.rating);
                            const stat = statsMap.get(problemId);
                            const solvedCount = stat?.solvedCount || 0;

                            return (
                                <Grid item xs={12} md={6} lg={4} key={problemId}>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Paper 
                                            className="glass-card" 
                                            sx={{ 
                                                p: 2.5, 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                border: isSolved ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            <Box display="flex" justifyContent="space-between" mb={1.5}>
                                                <Box flex={1}>
                                                    <Typography variant="h6" fontWeight="bold" color="#fff">
                                                        {problem.index}. {problem.name}
                                                    </Typography>
                                                    {isSolved && <Chip label="Solved" size="small" color="success" variant="outlined" />}
                                                </Box>
                                                <IconButton onClick={() => toggleBookmark(problem)} sx={{ color: isBookmarked ? '#fbbf24' : 'rgba(255,255,255,0.5)' }}>
                                                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                                </IconButton>
                                            </Box>
                                            <Box mb={2} display="flex" flexWrap="wrap" gap={0.5}>
                                                {problem.tags?.slice(0, 3).map(t => (
                                                    <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)', color: '#cbd5e1' }} />
                                                ))}
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                                                <Box>
                                                    <Typography fontWeight="bold" sx={{ color: ratingColor }}>
                                                        {problem.rating ? `Rating: ${problem.rating}` : 'N/A'}
                                                    </Typography>
                                                    <Typography variant="caption" color="#94a3b8">
                                                        {solvedCount.toLocaleString()} solved
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                                                    target="_blank"
                                                    sx={{ background: isSolved ? '#10b981' : 'var(--primary-color)' }}
                                                >
                                                    {isSolved ? 'View' : 'Solve'}
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            );
                        })}
                    </AnimatePresence>
                </Grid>
            )}
        </Box>
    );
};

export default Problems;
