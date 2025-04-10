import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import WalletConnect from './components/WalletConnect';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          0G Compute Network
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          지갑 연결 및 서비스 관리
        </Typography>
        <WalletConnect />
      </Box>
    </Container>
  );
}

export default App;
