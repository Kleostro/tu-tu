import { OrderId } from '@/app/api/models/order';

export const isOrderId = (response: unknown): response is OrderId =>
  typeof response === 'object' && response !== null && 'id' in response && typeof response['id'] === 'number';
