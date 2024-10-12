import React, { useContext } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { materialTheme } from '@/theme';
import { AuthContext } from '../context/AuthContext';

// const pages = ['Home', 'Find', 'Lifegroup', 'Ministry'];
const pages = [
    { label: 'Home', path: '/' },
    { label: 'Find Student', path: '/find' },
    { label: 'My Lifegroup', path: '/lifegroup' },
    { label: 'My Ministry', path: '/ministry' },
];
// const settings = ['Profile', 'Account', 'Logout'];
const settings = ['Logout'];

const NavBar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    // Handlers for menu open/close
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Handler for Logout
    const handleLogout = async () => {
        handleCloseUserMenu();
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <ThemeProvider theme={materialTheme}>
            <AppBar position='fixed' color='primary'>
                <Toolbar>
                    {/* Logo */}
                    <Typography
                        variant='h6'
                        noWrap
                        component={Link}
                        to='/'
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <img src='/src/assets/mvcym_logo_w.png' alt='Logo' height='40' />
                    </Typography>

                    {/* Mobile Menu Icon */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                            backgroundColor: 'inherit',
                        }}
                    >
                        <IconButton
                            size='large'
                            aria-label='open navigation menu'
                            onClick={handleOpenNavMenu}
                            color='inherit'
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Mobile Menu */}
                        <Menu
                            id='mobile-menu'
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.label}
                                    onClick={handleCloseNavMenu}
                                    component={Link}
                                    to={page.path}
                                >
                                    <Typography textAlign='center'>{page.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo for Mobile */}
                    <Typography
                        variant='h6'
                        noWrap
                        component={Link}
                        to='/'
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <img src='/src/assets/mvcym_logo_w.png' alt='Logo' height='40' />
                    </Typography>

                    {/* Desktop Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.label}
                                component={Link}
                                to={page.path}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, display: 'block' }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>

                    {/* User Avatar or Login Button */}
                    <Box sx={{ flexGrow: 0 }}>
                        {user ? (
                            <>
                                <Tooltip title='Open settings'>
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar
                                            alt={user.displayName || 'User Avatar'}
                                            src={user.photoURL || undefined}
                                        />
                                    </IconButton>
                                </Tooltip>

                                {/* User Menu */}
                                <Menu
                                    id='user-menu'
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem
                                            key={setting}
                                            onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}
                                            component={setting !== 'Logout' ? Link : Link}
                                            to={
                                                setting !== 'Logout'
                                                    ? `/${setting.replace(' ', '').toLowerCase()}`
                                                    : '/login'
                                            }
                                        >
                                            <Typography textAlign='center'>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Button
                                color='inherit'
                                component={Link}
                                to='/login'
                                sx={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default NavBar;
