import { MountableMiddleware } from '@interfaces';

import jwt from './jwt';
import logger from './logger';

// local middleware - each function can import this and use what it needs.
export const localMiddleware = {};

// global middleware - applies for all the routes.
export default [logger, jwt] as MountableMiddleware[];
