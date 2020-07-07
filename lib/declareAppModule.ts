/*
 * Take a Module
 * Return a function that -
 * Takes a router
 * And mounts the package to the router it recieved */

import { Module, MountableModule } from '@interfaces';
import * as Router from 'koa-router';

export const declareAppModule = ({ httpMethod, path, handler }: Module): MountableModule => {
    return (router: Router) => {
        switch (httpMethod) {
            // Self-Explanatory.
            case 'GET':
                router.get(path, handler);
                break;
            // Self-Explanatory.
            case 'POST':
                router.post(path, handler);
                break;
            // Replace all instances of target.
            case 'PUT':
                router.put(path, handler);
                break;
            // Self-Explanatory.
            case 'DELETE':
                router.delete(path, handler);
                break;
            // Partial Modifications to the target.
            case 'PATCH':
                router.patch(path, handler);
                break;
            // Same as a GET but without response body.
            case 'HEAD':
                router.head(path, handler);
                break;
            // Retrieve communication options and methods available.
            case 'OPTIONS':
                router.options(path, handler);
                break;
            // Just bind this, no matter what method.
            case 'ALL':
                router.all(path, handler);
                break;
        };

        return router;
    };
};
