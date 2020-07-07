/*
 * This middleware's purpose is to detect JWT tokens.
 * It does so by reading the Authorazation header
 * After that - it injects the detected user id into app.context.state.user.
 * So that other functions and even packages are able to dictate whether we have a logged-in user or not.
 * */

import { declareAppModule } from '@lib/index';

const handler = () => {};

export default declareAppModule({
    path: '*',
    handler,
    method: 'all'
});
