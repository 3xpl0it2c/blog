# Services.

### Just a quick note:
*All Services contain their configuration inside their file.*

## What use does the app makes of services ?
All the services are initiated and injected into the app context.
And then when in need the functions inject the services to the repositories via currying (Dependency Injection).
Repositories rely deeply on services, and some services are even global (like the logger service f.e).

