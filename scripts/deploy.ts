import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

async function main() {
    try {
        // 프로바이더 설정
        const provider = new ethers.JsonRpcProvider('https://evmrpc-testnet.0g.ai');
        
        // 지갑 설정
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('PRIVATE_KEY가 .env 파일에 없습니다.');
        }
        
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log('배포 지갑 주소:', wallet.address);

        // 컨트랙트 ABI와 Bytecode 가져오기
        const artifactPath = path.join(__dirname, '../artifacts/contracts/MyContract.sol/MyContract.json');
        const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
        
        // 컨트랙트 팩토리 생성
        const contractFactory = new ethers.ContractFactory(
            artifact.abi,
            artifact.bytecode,
            wallet
        );

        console.log('컨트랙트 배포 중...');
        
        // 컨트랙트 배포
        const contract = await contractFactory.deploy();
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        
        console.log('컨트랙트가 성공적으로 배포되었습니다!');
        console.log('컨트랙트 주소:', contractAddress);
        
        // 배포 정보 저장
        const deploymentInfo = {
            contractAddress,
            deploymentTime: new Date().toISOString(),
            network: 'OG Testnet',
            deployer: wallet.address
        };
        
        console.log('배포 정보:', deploymentInfo);
        
    } catch (error) {
        console.error('배포 중 에러 발생:', error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }); 