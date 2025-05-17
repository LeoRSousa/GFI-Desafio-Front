'use client';

import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NavBarHeader() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove("user_id");
    router.push('/');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit-profile');
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer' }}
          onClick={handleGoToProfile}
        >
          Controle de Investimentos
        </Typography>
        
        <Box>
          <IconButton color="inherit" onClick={handleEditProfile}>
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
