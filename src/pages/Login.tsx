import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sheet, Typography, Button, Alert, CircularProgress, Box, Divider } from '@mui/joy';
import GoogleIcon from '@mui/icons-material/Google';

const Login: React.FC = () => {
    const { user, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const from = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
        } catch (err) {
            console.error('Google Login error:', err);
            setError('Failed to log in with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: 2,
            }}
        >
            <Sheet
                variant='outlined'
                color='neutral'
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    p: 4,
                    borderRadius: 'md',
                    boxShadow: 'md',
                    backgroundColor: 'white',
                }}
            >
                <Typography level='h4' component='h1' mb={2} textAlign='center'>
                    Welcome Back!
                </Typography>

                <Typography level='body-md' textAlign='center' mb={3}>
                    Sign in to continue accessing your dashboard.
                </Typography>

                {error && (
                    <Alert variant='solid' color='danger' sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    startDecorator={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    loading={loading}
                    loadingIndicator={<CircularProgress size='sm' color='neutral' />}
                    variant='solid'
                    color='primary'
                    fullWidth
                    sx={{
                        mb: 2,
                        backgroundColor: '#4285F4',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#357ae8',
                        },
                    }}
                >
                    Sign in with Google
                </Button>

                <Divider sx={{ my: 2 }}>or</Divider>

                {/* Future integrations: Email/Password login can be added here */}

                <Typography level='body-sm' textAlign='center' color='neutral'>
                    By signing in, you agree to our{' '}
                    <a href='/terms' style={{ color: '#1976d2', textDecoration: 'underline' }}>
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href='/privacy' style={{ color: '#1976d2', textDecoration: 'underline' }}>
                        Privacy Policy
                    </a>
                    .
                </Typography>
            </Sheet>
        </Box>
    );
};

export default Login;
