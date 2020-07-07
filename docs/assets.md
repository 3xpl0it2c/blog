# Assets.

## Practical Implementation
The Function "create_article" recieves a request.
It creates a new Article initiative (pre processed-Article)
Passes it over to the handlers which replaces all "asset marks" with generated uuids.

The Function sends back the uuids.
The function writes the initiative to the database.
The client talks to the asset package which handles the processing and storage of the assets.
