import { ANPRService } from './ANPRService'
import { MapDataService } from './MapDataService'
import { FormulaService } from './FormulaService'
import { BaseShardService } from './base/BaseShardService'

export class ServiceFactory {
  private static instance: ServiceFactory
  private services: Map<string, BaseShardService> = new Map()

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory()
    }
    return ServiceFactory.instance
  }

  async getANPRService(): Promise<ANPRService> {
    if (!this.services.has('anpr')) {
      const service = new ANPRService()
      await service.initialize()
      this.services.set('anpr', service)
    }
    return this.services.get('anpr') as ANPRService
  }

  async getMapDataService(): Promise<MapDataService> {
    if (!this.services.has('mapData')) {
      const service = new MapDataService()
      await service.initialize()
      this.services.set('mapData', service)
    }
    return this.services.get('mapData') as MapDataService
  }

  async getFormulaService(): Promise<FormulaService> {
    if (!this.services.has('formula')) {
      const service = new FormulaService()
      await service.initialize()
      this.services.set('formula', service)
    }
    return this.services.get('formula') as FormulaService
  }
}