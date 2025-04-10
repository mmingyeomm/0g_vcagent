import { Request, Response } from 'express';
import { brokerService } from '../services/brokerService';

// BigInt를 문자열로 변환하는 헬퍼 함수
const convertBigIntToString = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'bigint') {
    return data.toString();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => convertBigIntToString(item));
  }
  
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      result[key] = convertBigIntToString(data[key]);
    }
    return result;
  }
  
  return data;
};

export const connectWallet = async (req: Request, res: Response) => {
    try {
        const { privateKey } = req.body;
            
        if (!privateKey) {
            return res.status(400).json({
                success: false,
                error: 'Private key is required'
            });
        }

        // 지갑 연결 로직 구현
        const balance = await brokerService.getBalance();
        
        const serializedBalance = convertBigIntToString(balance);

        // debugging log
        console.log('Received private key:', privateKey ? privateKey : 'No private key');
        console.log('Serialized balance:', serializedBalance);
        
        res.json({
            success: true,
            message: '지갑이 성공적으로 연결되었습니다',
            balance: serializedBalance
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const disconnectWallet = async (req: Request, res: Response) => {
    try {
        // 지갑 연결 해제 로직 구현
        res.json({
            success: true,
            message: '지갑 연결이 해제되었습니다'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getWalletStatus = async (req: Request, res: Response) => {
    try {
        // 지갑 상태 확인 로직 구현
        const balance = await brokerService.getBalance();
        const serializedBalance = convertBigIntToString(balance);
        
        res.json({
            success: true,
            status: 'connected',
            balance: serializedBalance
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 