# Functions.

Functions are a koa middleware that is being exposed as a module (please see interfaces directory).
They are async functions who take a context but they do not wait for next.
Instead, they perform actual logic.

It is very important to remember functions only handle verification and processing before the data is inserted to the db.
Repositories are here to abstract and hide the implementation using dead simple functions and dependency injection.

For example, say we have a function mounted at /search with method POST.
Before querying the database (or a search engine like ElasticSearch),
In most cases we would like to check the cache.
And in this case, the function can not directly access the cache.
The Repository code must check the cache before starting a new query.
Thus the function has to use one method only with processed information.

