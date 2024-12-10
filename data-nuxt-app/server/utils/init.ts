import { DataFetcherService } from '../../services/DataFetcherService';

export async function initializeServer() {
  console.log('Initializing server...');
  
  try {
    // Start data fetching service
    const dataFetcher = DataFetcherService.getInstance();
    await dataFetcher.startFetching();
    
    console.log('Server initialization completed');
  } catch (error) {
    console.error('Error during server initialization:', error);
    throw error;
  }
}