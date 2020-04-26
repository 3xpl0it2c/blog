# Spec

## 

## Implementation

* Functions use Repositories which use Connectors.
* A Function is the part that manages the web interaction - validation and so forth.
* A Repository provides a nice simple interface over the Connector (no query lang needed)
* A Repository takes care of domain specific needs. It provides dynamic table names, migrations on demand
* The Connector is simply a singleton containing the database client of choice (slonik, mongo, rethink, so forth)

## Implementation - Conclusion

* You want dynamic and pure db query generators (e.g can be mongo or sql)
* You want a migration framework which will provide identifiers for certain critical objects which are used by the app (function).

## Implementation - Recommendations

* Demand a schema for the entity which the user seeks to tinker with.