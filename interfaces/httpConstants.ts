/*
Instead of just working with hard-coded http codes,
Use this enum.

This guarantees code readability and correctness.
Nobody remembers (Nor should) every HTTP status code.
So in here I document as much as I can.
*/

export enum HttpStatusCodes {
    // Simply means everything is OK.
    SUCCESS = 200,
    // After a POST (Usually), means that the request has affected something.
    RESOURCE_CREATED = 201,
    // Invalid request made by client.
    BAD_REQUEST = 400,
    // Client is'nt authenticated.
    UNAUTHORIZED = 401,
    // Client does not have access to this resource (maybe he is not an admin?)
    FORBIDDEN = 403,
    // Resource is not found (maybe client looks for a non-existing user?)
    NOT_FOUND = 404,
    // HTTP method is known but unallowed for this resource.
    // You MUST respond with an Allow header containing the allowed methods.
    UNALLOWED = 405,
    // If the client`s demands are unacceptable
    UNACCEPTABLE = 406,
    // Rate-limit. Too much requests per unit of time.
    TOO_MUCH = 429,
    // An error inside our server. (perhaps a DB timeout ?)
    INTERNAL_SERVER_ERROR = 500,
    // Unknown HTTP method (Do not confuse with 405)
    NOT_IMPLEMENTED = 501,
}
