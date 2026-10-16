import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Compare = lazy(() => import('./pages/Compare'));
const Problems = lazy(() => import('./pages/Problems'));
const Contests = lazy(() => import('./pages/Contests'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Profile = lazy(() => import('./pages/Profile'));

const appPages = [
    ['/dashboard', Dashboard], ['/compare', Compare], ['/problems', Problems],
    ['/contests', Contests], ['/bookmarks', Bookmarks], ['/profile', Profile],
];

class PageErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('Page rendering failed:', error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <Box role="alert" className="glass-card" sx={{ p: 3 }}>
                    <Typography variant="h6">We couldn’t load this page.</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>Refresh the page and try again.</Typography>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>Refresh page</Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

const PageLoader = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
    </Box>
);

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="80vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

function PersistentAppPages() {
    const { pathname } = useLocation();
    const activePath = pathname === '/' ? '/dashboard' : pathname;
    const [visitedPaths, setVisitedPaths] = useState(() => new Set([activePath]));
    const previousPath = useRef(activePath);

    useLayoutEffect(() => {
        if (previousPath.current !== activePath) window.scrollTo(0, 0);
        previousPath.current = activePath;
    }, [activePath]);

    useEffect(() => {
        setVisitedPaths((visited) => visited.has(activePath) ? visited : new Set([...visited, activePath]));
    }, [activePath]);

    if (!appPages.some(([path]) => path === activePath)) return <Navigate to="/" replace />;

    return (
        <>
            {appPages.map(([path, Page]) => (visitedPaths.has(path) || activePath === path) && (
                <div key={path} className="persistent-page" hidden={activePath !== path} aria-hidden={activePath !== path}>
                    <PageErrorBoundary><Page /></PageErrorBoundary>
                </div>
            ))}
        </>
    );
}

function App() {
    const { user, loading } = useAuth();

    return (
        <div className="app">
            <Navbar />
            <div className="page-container">
                <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={loading ? <PageLoader /> : user ? <Navigate to="/dashboard" replace /> : <Landing />} />
                    <Route path="*" element={<PrivateRoute><PersistentAppPages /></PrivateRoute>} />
                </Routes>
                </Suspense>
            </div>
        </div>
    );
}

export default App;
