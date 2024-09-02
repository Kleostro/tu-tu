import { Injectable } from '@angular/core';

import { SegmentPrice } from '@/app/api/models/search';
import { CarriageInfo } from '@/app/shared/models/carriageInfo.model';
import { PriceMap } from '@/app/shared/models/priceMap.model';
import { TripIndices } from '@/app/shared/models/tripIndices.model';

@Injectable({
  providedIn: 'root',
})
export class TripPriceService {
  public aggregatePrices(segments: SegmentPrice[], indices: TripIndices): PriceMap {
    const priceMap: PriceMap = {};
    segments.slice(indices.start, indices.end).forEach((segment) => {
      Object.keys(segment.price).forEach((carriage) => {
        if (priceMap[carriage]) {
          priceMap[carriage] += segment.price[carriage];
        } else {
          priceMap[carriage] = segment.price[carriage];
        }
      });
    });

    return priceMap;
  }

  public getCarriagePrice(carriage: string, carriageInfo: CarriageInfo[]): number {
    const carriageDetails = carriageInfo.find((info) => info.name === carriage);
    return carriageDetails ? carriageDetails.price : 0;
  }
}
