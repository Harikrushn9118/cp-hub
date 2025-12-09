import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Compare from './pages/Compare';
// import Problems from './pages/Problems';
// import Contests from './pages/Contests';
// import Bookmarks from './pages/Bookmarks';
// import Profile from './pages/Profile';

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
                    <Route path="/" element={<div>Welcome to CP Analyzer</div>} />
                    {/* Routes will be added in future commits */}
                </Routes>
            </div>
        </div>
    );
}

export default App;
