import { EventType } from '../entities/EventType';
import { AppDataSource } from '../config/data-source';

// Interacts database open close
export class EventTypeRepository {
  async createEventType(eventType: EventType) {
    return await AppDataSource.getRepository(EventType).save(eventType);
  }

  async retrieveEventTypeByName(name: string) {
    return await AppDataSource.getRepository(EventType).findOne({
      where: { name },
    });
  }
}
