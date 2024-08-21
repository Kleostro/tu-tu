import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';

export const isOverriddenHttpErrorResponse = (error: unknown): error is OverriddenHttpErrorResponse =>
  typeof error === 'object' &&
  error !== null &&
  'error' in error &&
  typeof error.error === 'object' &&
  error.error !== null &&
  'reason' in error.error;
