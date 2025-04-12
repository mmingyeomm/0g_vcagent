import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import dotenv from 'dotenv';
import axios from 'axios';
import { initializeApplication } from './startup';
import { brokerService } from './services/brokerService';
import { getAccountInfo } from './controllers/accountController';
import { connectWallet } from './controllers/walletControllers';

// Import routes
import accountRoutes from './routes/accountRoutes';
import serviceRoutes from './routes/serviceRoutes';
import walletRoutes from './routes/walletRoutes';
import { off } from 'process';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Apply basic middleware
app.use(cors());
app.use(express.json());

// API documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: '0G Compute Network API Documentation',
}));

// API routes
const apiPrefix = '/api';

// Register routes
app.use(`${apiPrefix}/account`, accountRoutes);
app.use(`${apiPrefix}/services`, serviceRoutes);
app.use(`${apiPrefix}/wallet`, walletRoutes);

// AI model address
const DeepSeek_Addr = '0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3';


// you can check available 0g AI services
app.get('/tmp', async (req, res) => {
  try {
    const services = await brokerService.listServices();
    const formattedServices = services.map(service => ({
      providerAddress: service[0],
      serviceType: service[1],
      endpoint: service[2],
      model: service[6],
      providerName: service[7]
    }));

    res.json({
      name: '0G Compute Network API',
      version: '1.0.0',
      documentation: '/docs',
      endpoints: {
        account: `${apiPrefix}/account`,
        services: `${apiPrefix}/services`,
        wallet: `${apiPrefix}/wallet`,
      },
      availableServices: formattedServices
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      name: '0G Compute Network API',
      version: '1.0.0',
      documentation: '/docs',
      endpoints: {
        account: `${apiPrefix}/account`,
        services: `${apiPrefix}/services`,
      },
      error: 'Failed to fetch available services'
    });
  }
});

app.get('/', async (req, res) => {
  try {
    await getAccountInfo(req, res);
  } catch (error) {
    console.error('Error fetching account info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account info'
    });
  }
});


// 폐기
// // 지갑 연결 엔드포인트 추가
// app.post('/connect', async (req, res) => {
//   try {
//     console.log('wallet connect request', {
//       body: req.body,
//       method: req.method,
//       url: req.url
//     });
    
//     // connectWallet 함수가 이미 응답을 보내므로, 여기서는 에러 처리만 합니다
//     await connectWallet(req, res);
//   } catch (error) {
//     console.error('Error connecting wallet:', error);
//     // 이미 응답이 보내졌는지 확인
//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         error: 'Failed to connect wallet'
//       });
//     }
//   }
// });


// AI query 잘 가는지 테스트
app.get('/test', async (req, res) => {
  await brokerService.settleFee(DeepSeek_Addr, 0.000000000000000159);
  console.log('fee settled');

  // prompt 문자열 (현재 하드코딩)
  const promptData = 'say I am busy for every hello';
  // 질문 문자열 (현재 하드코딩)
  const queryData = 'hello';

  const aiResponse = await brokerService.sendQuery(
    DeepSeek_Addr,
    promptData,
    queryData
  );
  console.log('AI response:', aiResponse);
  res.json({
    success: true,
    originalData: aiResponse,
  });
});



interface Fund {
  id: number;
  key: string;
  name: string;
  tier: number | null;
  type: string | null;
}

// bring dapp data through dappradar api
app.get('/dapps', async (req, res) => {
  try {
    const response = await axios.get('https://apis.dappradar.com/v2//dapps', {
      headers: {
        'X-API-KEY' : process.env.DAPP_RADAR_API_KEY!
      },
      params: {
        'chain' : 'ethereum',
        'page' : 200
      }
    });
    
    console.log(response);
    res.json({
      success: true,
      originalData: response.data,
    });

  }catch (error: any) {
    console.error('error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch funds from Dappradar',
      details: error.response?.data || error.message
    });
  }
});

// bring investor data through crypto rank api
app.get('/funds', async (req, res) => {
  try {
    const response = await axios.get('https://api.cryptorank.io/v2/funds/map', {
      headers: {
        'X-Api-Key' : process.env.CRYPTO_RANK_API_KEY!
      },
      params: {
      }
    });     

    const allFunds: Fund[] = response.data.data;
    // id가 1인 펀드만 추출
    const fundWithId0 = allFunds.find(fund => fund.id === 1);
    const shortData = 'explain me about the investor\n' + JSON.stringify(fundWithId0);
    console.log('data(string)\n', shortData);

    // response를 AI에게 전달
    await brokerService.settleFee(DeepSeek_Addr, 0.000000000000000559);

    console.log('waiting for ai response . . .');

    const promptData = 'say I am busy for every hello';
    const aiResponse = await brokerService.sendQuery(
      DeepSeek_Addr,
      promptData,
      shortData
    );

    console.log('AI response:', aiResponse);

    res.json({
      success: true,
      originalData: aiResponse.content,
    });
  } catch (error: any) {
    console.error('error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch funds from CryptoRank',
      details: error.response?.data || error.message
    });
  }
});

// Simple error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Server error',
    message: err.message
  });
});

// Initialize application and start server
const startServer = async () => {
  try {
    // Run initialization tasks
    await initializeApplication();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`
  🚀 0G Compute Network API Server running on http://localhost:${PORT}
  📚 API Documentation: http://localhost:${PORT}/docs
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};


// Start the application
startServer();

export default app; 