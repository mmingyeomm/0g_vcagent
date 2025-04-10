import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../utils/api';

const WalletConnect: React.FC = () => {
  const [privateKey, setPrivateKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [balance, setBalance] = useState<any>(null);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`${API_URL}/connect`, {
        privateKey: privateKey
      });

      if (response.data.success) {
        setIsConnected(true);
        setBalance(response.data.balance);
      } else {
        setError(response.data.error || '지갑 연결에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        지갑 연결
      </Typography>
      
      {!isConnected ? (
        <Box>
          <TextField
            fullWidth
            label="Private Key"
            variant="outlined"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            margin="normal"
            type="password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleConnect}
            disabled={loading || !privateKey}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : '지갑 연결'}
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body1" gutterBottom>
            지갑이 성공적으로 연결되었습니다!
          </Typography>
          {balance && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">잔액 정보:</Typography>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(balance, null, 2)}
              </pre>
            </Box>
          )}
        </Box>
      )}
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default WalletConnect; 