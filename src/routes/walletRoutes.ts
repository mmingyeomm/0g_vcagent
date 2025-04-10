import express from 'express';
import { connectWallet, disconnectWallet, getWalletStatus } from '../controllers/walletControllers';

const router = express.Router();

// 지갑 연결
router.post('/connect', connectWallet);

// 지갑 연결 해제
router.post('/disconnect', disconnectWallet);

// 지갑 상태 확인
router.get('/status', getWalletStatus);

export default router; 