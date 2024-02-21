import { DonationEventItem } from '../entities/DonationEventItem';
import { Item } from '../entities/Item';
import { AppDataSource } from '../config/data-source';

// Interacts database open close
export class DonationEventItemRepository {
  async createDonationEventItem(donationEventItem: DonationEventItem) {
    return await AppDataSource.getRepository(DonationEventItem).save(
      donationEventItem
    );
  }

  async retrieveDonationEventItemById(id: number) {
    return await AppDataSource.getRepository(DonationEventItem).findOne({
      where: {
        id: id,
      },
    });
  }

  // Retrieves all donationEventItems by donationEventId with itemName, unit, and eventTypeId
  async getDonationEventItembyDonationEventId(donationEventId: number) {

    return await AppDataSource.getRepository(DonationEventItem)
    .createQueryBuilder('dei')
    .select(['dei.id', 'dei.minQty', 'dei.pointsPerUnit', 'item.id', 'item.name', 'item.unit', 'eventType.id'])
    .leftJoin('dei.item', 'item')
    .leftJoin('item.eventType', 'eventType')
    .where('dei.donationEvent.id = :donationEventId', { donationEventId })
    .cache("donation-event-items", 60000)
    .getMany();
  }
}
