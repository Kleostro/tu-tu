import { inject, Injectable } from '@angular/core';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { SegmentOccupiedSeats } from '@/app/api/models/search';
import { CarriageCountMap } from '@/app/shared/models/carriageCountMap.model';
import { CarriageInfo } from '@/app/shared/models/carriageInfo.model';
import { CarriageNameMap } from '@/app/shared/models/carriageNameMap.model';
import { FreeSeatsMap } from '@/app/shared/models/freeSeatsMap.model';
import { PriceMap } from '@/app/shared/models/priceMap.model';
import { TrainCarriages } from '@/app/shared/models/trainCarriages.model';
import { TripIndices } from '@/app/shared/models/tripIndices.model';

@Injectable({
  providedIn: 'root',
})
export class TripCarriagesService {
  private carriagesService = inject(CarriageService);

  private generateCarriageInfo(
    carriageNameMap: CarriageNameMap,
    carriageCountMap: CarriageCountMap,
    freeSeatsMap: FreeSeatsMap,
    priceMap: PriceMap,
  ): CarriageInfo[] {
    return Object.keys(carriageCountMap).map((carriage) => ({
      name: carriageNameMap[carriage],
      type: carriage,
      freeSeats: freeSeatsMap[carriage] ?? 0,
      price: priceMap[carriage] ?? 0,
    }));
  }

  private countCarriages(carriages: string[]): CarriageCountMap {
    const carriageCountMap: CarriageCountMap = {};
    carriages.forEach((carriage) => {
      if (!carriageCountMap[carriage]) {
        carriageCountMap[carriage] = { count: 0, occupiedSeats: [] };
      }
      carriageCountMap[carriage].count += 1;
    });
    return carriageCountMap;
  }

  private findOccupiedSeats(
    segments: SegmentOccupiedSeats[],
    tripStationIndices: TripIndices,
    firstSeat: number,
    lastSeat: number,
  ): number[] {
    return Array.from(
      new Set(
        segments
          .slice(tripStationIndices.start, tripStationIndices.end)
          .flatMap((segment) => segment.occupiedSeats)
          .filter((seat) => seat >= firstSeat && seat <= lastSeat),
      ),
    );
  }

  private createCarriageNameMap(carriages: string[]): CarriageNameMap {
    const allCarriages = this.carriagesService.allCarriages();
    const carriageMap: CarriageNameMap = {};

    allCarriages.forEach(({ code, name }) => {
      carriageMap[code] = name;
    });

    const result: { [key: string]: string } = {};
    carriages.forEach((carriageTypeCode) => {
      if (carriageMap[carriageTypeCode]) {
        result[carriageTypeCode] = carriageMap[carriageTypeCode];
      }
    });

    return result;
  }

  private calculateTotalSeats(rows: number, leftSeats: number, rightSeats: number): number {
    return rows * (leftSeats + rightSeats);
  }

  public countTrainCarriages(
    carriages: string[],
    segments: SegmentOccupiedSeats[],
    tripStationIndices: TripIndices,
  ): TrainCarriages {
    const allCarriages = this.carriagesService.allCarriages();
    const trainCarriages: TrainCarriages = {};
    let currentFirstSeat = 1;

    carriages.forEach((carriageTypeCode, index) => {
      const info = allCarriages.find((crg) => crg.code === carriageTypeCode);
      if (info) {
        const { rows, leftSeats, rightSeats, name } = info;
        const totalSeats = this.calculateTotalSeats(rows, leftSeats, rightSeats);
        const firstSeat = currentFirstSeat;
        const lastSeat = firstSeat + totalSeats - 1;
        const occupiedSeats = this.findOccupiedSeats(segments, tripStationIndices, firstSeat, lastSeat);

        const key = (index + 1).toString();
        trainCarriages[key] = {
          carriageTypeCode,
          carriageOrder: index + 1,
          carriageName: name,
          firstSeat,
          lastSeat,
          occupiedSeats,
          totalSeats,
          freeSeats: totalSeats - occupiedSeats.length,
        };

        currentFirstSeat = lastSeat + 1;
      }
    });

    return trainCarriages;
  }

  public createCarriageInfo(carriages: string[], priceMap: PriceMap, freeSeatsMap: FreeSeatsMap): CarriageInfo[] {
    const carriageCountMap = this.countCarriages(carriages);
    const carriageNameMap = this.createCarriageNameMap(carriages);
    return this.generateCarriageInfo(carriageNameMap, carriageCountMap, freeSeatsMap, priceMap);
  }

  public calculateFreeSeats(trainCarriages: TrainCarriages): FreeSeatsMap {
    const freeSeatsMap: FreeSeatsMap = {};

    Object.entries(trainCarriages).forEach(([, carriage]) => {
      const { freeSeats, carriageTypeCode } = carriage;
      if (freeSeatsMap[carriageTypeCode]) {
        freeSeatsMap[carriageTypeCode] += freeSeats;
      } else {
        freeSeatsMap[carriageTypeCode] = freeSeats;
      }
    });
    return freeSeatsMap;
  }
}
