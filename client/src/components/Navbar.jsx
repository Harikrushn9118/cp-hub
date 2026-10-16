import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AppBar, Toolbar, Button, Typography, Box, IconButton,
    Menu, MenuItem, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuRounded from '@mui/icons-material/MenuRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import { useColorMode } from '../context/ColorModeContext';

const appLinks = [
    ['Dashboard', '/dashboard'], ['Compare', '/compare'], ['Problems', '/problems'],
    ['Contests', '/contests'], ['Bookmarks', '/bookmarks'],
];

const ThemeToggle = ({ mode, onToggle }) => (
    <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
        <IconButton
            className="theme-toggle"
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            onClick={onToggle}
            size="small"
        >
            {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
        </IconButton>
    </Tooltip>
);

const Navbar = () => {
    const { user, logout } = useAuth();
    const { mode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const closeMenu = () => setAnchorEl(null);
    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={0} className="site-nav">
            <Toolbar className="site-toolbar">
                <Typography variant="h6" component={Link} to="/" className="brand-link">
                    <span className="brand-mark">C</span><span>CP<span className="brand-accent">-Hub</span></span>
                </Typography>

                {user ? (
                    <>
                        {!isMobile && <Box className="nav-links">{appLinks.map(([label, path]) => <Button key={path} color="inherit" component={Link} to={path}>{label}</Button>)}</Box>}
                        <ThemeToggle mode={mode} onToggle={toggleColorMode} />
                        <IconButton color="inherit" aria-label="Open account menu" onClick={(event) => setAnchorEl(event.currentTarget)}>
                            {isMobile ? <MenuRounded /> : <AccountCircle />}
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                            {isMobile && appLinks.map(([label, path]) => <MenuItem key={path} component={Link} to={path} onClick={closeMenu}>{label}</MenuItem>)}
                            <MenuItem disabled>{user.username}</MenuItem>
                            <MenuItem component={Link} to="/profile" onClick={closeMenu}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Log out</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Box className="nav-actions">
                        {!isMobile && <Button color="inherit" href="/#features">Features</Button>}
                        <Button color="inherit" component={Link} to="/login">Log in</Button>
                        <Button component={Link} to="/register" variant="contained" size="small">Get started</Button>
                        <ThemeToggle mode={mode} onToggle={toggleColorMode} />
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
