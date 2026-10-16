import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import { Box, CircularProgress } from '@mui/material';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Compare = lazy(() => import('./pages/Compare'));
const Problems = lazy(() => import('./pages/Problems'));
const Contests = lazy(() => import('./pages/Contests'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Profile = lazy(() => import('./pages/Profile'));

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

                    <Route path="/" element={loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>
                    ) : user ? <Dashboard /> : <Landing />} />

                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/compare" element={
                        <PrivateRoute>
                            <Compare />
                        </PrivateRoute>
                    } />

                    <Route path="/problems" element={
                        <PrivateRoute>
                            <Problems />
                        </PrivateRoute>
                    } />

                    <Route path="/contests" element={
                        <PrivateRoute>
                            <Contests />
                        </PrivateRoute>
                    } />

                    <Route path="/bookmarks" element={
                        <PrivateRoute>
                            <Bookmarks />
                        </PrivateRoute>
                    } />

                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                </Suspense>
            </div>
        </div>
    );
}

export default App;
