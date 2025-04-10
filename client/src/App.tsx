import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          0G Compute Network
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          지갑 연결 및 서비스 관리
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
