import { authHandlers } from './auth';
import { inventoryHandlers } from './inventory';
import { ordersHandlers } from './orders';
import { productsHandlers } from './products';
import { reviewsHandlers } from './reviews';
import { usersHandlers } from './users';

export const handlers = [
  ...authHandlers,
  ...inventoryHandlers,
  ...ordersHandlers,
  ...productsHandlers,
  ...reviewsHandlers,
  ...usersHandlers,
];
