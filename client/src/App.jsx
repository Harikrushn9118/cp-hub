import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Problems from './pages/Problems';
import Contests from './pages/Contests';
import Compare from './pages/Compare';
// import Bookmarks from './pages/Bookmarks';

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
    return (
        <div className="app">
            <Navbar />
            <div className="page-container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/problems" element={<PrivateRoute><Problems /></PrivateRoute>} />
                    <Route path="/contests" element={<PrivateRoute><Contests /></PrivateRoute>} />
                    <Route path="/compare" element={<PrivateRoute><Compare /></PrivateRoute>} />
                    {/* <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} /> */}
                    <Route path="/" element={<div>Welcome to CP Analyzer</div>} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
