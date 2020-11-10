# Services.

## What are services ?
Services as obvious as it sounds are just a way for the app to communicate with the outer world.
For example, a logger is considered a service and so does a database driver.
But a validator of some sort is not a service. (Maybe if it calls an outer server, then it is a service)
In other words services perform side-effects. They do I/O, and they have internal state.

## What use does the app makes of services ?
All the services are initiated and injected into the app context at "boot time".
And then when in need the functions inject the services to the repositories via currying (a bit like Dependency Injection).
Some middleware might also make use of services, for example rate-limiters might need a cache to implement token-buckets.
