import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Nav';
import Home from './pages/Home';
import Search from './pages/Search';
import Edit from './pages/Edit';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Toolbar } from '@mui/material';
import Lifegroup from './pages/Lifegroup';
import Ministry from './pages/Ministry';

const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <Toolbar />
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route
                        path='/'
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/find'
                        element={
                            <ProtectedRoute>
                                <Search />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/lifegroup'
                        element={
                            <ProtectedRoute>
                                <Lifegroup />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/ministry'
                        element={
                            <ProtectedRoute>
                                <Ministry />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/edit/:studentId'
                        element={
                            <ProtectedRoute>
                                <Edit />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Suspense>
        </>
    );
};

export default App;
