import { MountableMiddleware } from '@interfaces';

import jwt from './jwt';
import logger from './logger';

export default [jwt, logger] as MountableMiddleware[];
