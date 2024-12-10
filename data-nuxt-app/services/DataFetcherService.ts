// services/DataFetcherService.ts
import { ServiceFactory } from './ServiceFactory';

export class DataFetcherService {
  private static instance: DataFetcherService;
  private serviceFactory: ServiceFactory;
  private fetchInterval: ReturnType<typeof setInterval> | null = null;
  private readonly FETCH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.serviceFactory = ServiceFactory.getInstance();
  }

  static getInstance(): DataFetcherService {
    if (!DataFetcherService.instance) {
      DataFetcherService.instance = new DataFetcherService();
    }
    return DataFetcherService.instance;
  }

  async startFetching() {
    console.log('Starting data fetching service...');
    
    // Initial fetch
    await this.fetchAllData();

    // Set up periodic fetching using the correct type
    this.fetchInterval = setInterval(async () => {
      await this.fetchAllData();
    }, this.FETCH_INTERVAL_MS);
  }

  stopFetching() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
      this.fetchInterval = null;
    }
  }

  private async fetchAllData() {
    try {
      console.log('Fetching data from all external services...');
      
      // Get service instances
      const [cameraService, externalMapService] = await Promise.all([
        this.serviceFactory.getCameraService(),
        this.serviceFactory.getExternalMapService()
      ]);

      // Fetch and store data in parallel
      await Promise.all([
        this.fetchCameraData(cameraService),
        this.fetchMapData(externalMapService)
      ]);
      
      console.log('Data fetch completed successfully');
    } catch (error) {
      console.error('Error during data fetch:', error);
    }
  }

  private async fetchCameraData(cameraService: any) {
    try {
      console.log('Fetching camera data...');
      await cameraService.fetchAndStoreVideos();
      console.log('Camera data stored successfully');
    } catch (error) {
      console.error('Error fetching camera data:', error);
    }
  }

  private async fetchMapData(mapService: any) {
    try {
      console.log('Fetching map data...');
      await mapService.fetchAndStoreMapData();
      console.log('Map data stored successfully');
    } catch (error) {
      console.error('Error fetching map data:', error);
    }
  }
}