import express from "express";

import {generateResponse, strongParams} from "../common/methods";
import { DonationEventItemService } from "../services/DonationEventItemService";
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';


const router = express.Router();
const donationEventItemRepository= new DonationEventItemRepository();
const donationEventItemService = new DonationEventItemService(donationEventItemRepository);

router.get('/items-by-donation-event-id', async (req, res) => {
  try {
    const params = req.body;
    const allowedParams = ["donationEventId"];
    const filteredParams = strongParams(params, allowedParams);

    const {donationEventId} = filteredParams;
    if (!donationEventId || donationEventId.toString().trim() === "") {
      return generateResponse(res, 404, {
        message: "Donation event id parameter is required",
      });
    }

    const items = await donationEventItemService.getDonationEventItembyDonationEventId(donationEventId);
    console.log(items)
    return generateResponse(res, 200, {items});
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {
      error: "Failed to retrieve items by donation event id",
    });
  }
});

export default router;
