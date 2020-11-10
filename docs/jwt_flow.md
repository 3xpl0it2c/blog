# JWT Authentication Flow.

## Storage
Obeying the following limitations is crucial for security.
In the case of a violation **THE APP MIGHT BE VULNERARBLE TO ATTACKS LIKE XSS AND CSRF**

* JWT: stored in memory. As a regular javascript variable. ( **no local/session storage** !)
* Refresh token: stored as a **Secure,HttpOnly,SameSite cookie**.


## The flow
Initially upon the user's login,
The JWT is sent inside the response body.
And is retrieved via the `Authorization` header. (Could be a url parameter too)

Once the JWT token expires, the client contacts the server with it's refresh token,
Requesting a new JWT with which it could interact with our services.

The refresh token contains a random UUID (I recommend nanoid/uuid for nodejs)
Inside the JWT we store the authenticated user's ID, or any valuable information (altough authorization related content is not recommened IMO).

Inside the cache we store the refresh token with an associated counter.
The counter starts from **zero**.
When it goes beyond: **(Refresh Token TTL / JWT TTL) + 1** the token is removed from the cache. (TTL = Time To Live)
For example in our case a jwt is valid for 3 minutes and a refresh token is valid for 15 minutes.
So when the counter goes beyond 6 (15 minutes / 3 minutes = 5, add one we get 6) we remove the refresh token.
As JSON it would look like this:
`
{
    "REFRESH_TOKEN_UUID": 0
}
`

Using the PX flag of Redis we are able to store refresh tokens and verify them easily.
It is simple - if the refresh token exists in the database (Redis) than it is valid, if not - the token's invalid.
And if the user decided to logout, we can just remove the refresh token ourselves.

## Issues with this approach
With this configuration we have given the attacker a (configurable) small time window for attacking.
But then, even if an attacker managed to steal a jwt he will be blocked once the token expires.
The thing is this approach is vulnerable to in-browser attacks like XSS.
The attacker can send AJAX calls from the client's browser every 2 minutes (with the refresh token inside the cookie),
Recieve a jwt and perform malicious actions. (In case of something like XSS)
And unless we handle the logout correctly,
the attacker might be able to steal our tokens (JWT and refresh tokens) and become authenticated forever.
I don't think there is a silver bullet in this context, but I am very confident in this solution.

## Route map:
```
POST /login :
    Recieve params - username & password.
    Retrieve user info by name from db
    If no user found with such name - require the user to re-enter his credentials.
    Hash Password recieved from user
    Compare hashed password from db to user's hased password
    If they don't match - request the user to re-enter his credentials
    Generate refresh_token & jwt
    Send refresh_token and jwt to user

GET /refresh :
    Receieve cookie - refresh_token
    If refresh_token isn't valid - respond with error and redirect to login
    Send jwt in response body

POST /logout :
    Recieve cookie - refresh_token
    If no refresh_token return a 400
    Remove refresh_token from cache
    Client purges JWT from memory
```
