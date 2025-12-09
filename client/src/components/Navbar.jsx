import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Button, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)' }}>
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>
                    <span className="gradient-text">CP Analyzer</span>
                </Typography>

                {user ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                        <Button color="inherit" component={Link} to="/compare">Compare</Button>
                        <Button color="inherit" component={Link} to="/problems">Problems</Button>
                        <Button color="inherit" component={Link} to="/contests">Contests</Button>
                        <Button color="inherit" component={Link} to="/bookmarks">Bookmarks</Button>

                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                sx: {
                                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }
                            }}
                        >
                            <MenuItem disabled sx={{ color: 'rgba(255,255,255,0.7)' }}>{user.username}</MenuItem>
                            <MenuItem 
                                onClick={() => { handleClose(); navigate('/profile'); }}
                                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' } }}
                            >
                                Profile
                            </MenuItem>
                            <MenuItem 
                                onClick={handleLogout}
                                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' } }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register" variant="outlined" sx={{ ml: 1 }}>Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
