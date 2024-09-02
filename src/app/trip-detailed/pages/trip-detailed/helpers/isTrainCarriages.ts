import { TrainCarriages } from '@/app/shared/models/trainCarriages.model';

import { isCarriage } from './isCarriage';

export const isTrainCarriages = (data: unknown): data is TrainCarriages =>
  typeof data === 'object' && data !== null && Object.values(data).every(isCarriage);
