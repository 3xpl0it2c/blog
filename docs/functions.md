# Functions.

**TL;DR** - Just make sure to `await next();` before everything, and treat repositories like Data Mappers (Martin Fowler).

Functions are a koa middleware that is being exposed as a module (please see interfaces directory).
They are async functions who take a context but first of all they wait for other middleware.
It is the functions that perform actual logic and respond to the client.
They export the object created by `declareAppModule` from the library. (lib directory)

It is very important to remember functions only handle verification and processing before the data is handed over to the repositories.
Repositories are here to abstract and hide -
* Implementation of business logic
* Database interaction (external services all around)

Via exporting dead simple functions and leveraging dependency injection.

For example, say we have a function mounted at /search with method GET.
Before querying the database (or a search engine like ElasticSearch),
In most cases we would like to check the cache.

A function can not directly access the cache.
The Repository code must check the cache before starting a new query.

With this approach the functions (and repositories) are a lot more portable.
When building a new website you could use the verification code of the functions.

Or when the team decides to move to microservices,
All the repository code is destructured and spread with it's matching functions.
In fact, I am pretty confident you can keep the main structure of this project,
But edit a little of the config code and remove some functions, and you could make a microservice out of it.
