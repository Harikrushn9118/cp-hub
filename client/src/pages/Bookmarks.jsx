import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, Typography, Grid, Paper, Chip, IconButton, Button, CircularProgress,
    TextField, InputAdornment, Alert, Stack
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { motion, AnimatePresence } from 'framer-motion';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookmarks();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBookmarks(bookmarks);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredBookmarks(bookmarks.filter(b => 
                b.problem_name?.toLowerCase().includes(query) || 
                b.problem_id?.toLowerCase().includes(query)
            ));
        }
    }, [bookmarks, searchQuery]);

    const fetchBookmarks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/users/bookmarks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookmarks(res.data);
            setFilteredBookmarks(res.data);
        } catch (error) {
            console.error('Error fetching bookmarks', error);
            setError('Failed to fetch bookmarks');
        } finally {
            setLoading(false);
        }
    };

    const deleteBookmark = async (bookmarkId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/users/bookmarks/${bookmarkId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        } catch (error) {
            console.error('Error deleting bookmark', error);
            setError('Failed to delete bookmark');
        }
    };

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="gradient-text" fontWeight="bold">
                My Bookmarks
            </Typography>

            <Paper className="glass-card" sx={{ p: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search bookmarks..."
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

            {filteredBookmarks.length === 0 ? (
                <Paper className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        {bookmarks.length === 0 ? 'No bookmarks yet.' : 'No bookmarks match your search.'}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    <AnimatePresence>
                        {filteredBookmarks.map((bookmark) => (
                            <Grid item xs={12} md={6} lg={4} key={bookmark.id}>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <Paper className="glass-card" sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                                            <Typography variant="h6" fontWeight="bold" color="#fff">
                                                {bookmark.problem_name || bookmark.problem_id}
                                            </Typography>
                                            <IconButton onClick={() => deleteBookmark(bookmark.id)} size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                        <Box mb={2} display="flex" flexWrap="wrap" gap={0.5}>
                                            {bookmark.tags?.map((tag, idx) => (
                                                <Chip key={idx} label={tag} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }} />
                                            ))}
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                                            <Typography fontWeight="bold" sx={{ color: getRatingColor(bookmark.rating) }}>
                                                {bookmark.rating ? `Rating: ${bookmark.rating}` : 'N/A'}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                href={`https://codeforces.com/problemset/problem/${bookmark.problem_id.slice(0, -1)}/${bookmark.problem_id.slice(-1)}`}
                                                target="_blank"
                                                sx={{ background: 'var(--primary-color)' }}
                                            >
                                                Solve
                                            </Button>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}
        </Box>
    );
};

export default Bookmarks;
