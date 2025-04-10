import { brokerService } from './services/brokerService';

async function checkBalance() {
  try {
    console.log('Checking wallet balance...');
    const balance = await brokerService.getBalance();
    console.log('Current balance:', balance);
  } catch (error) {
    console.error('Error checking balance:', error);
  }
}

checkBalance(); 