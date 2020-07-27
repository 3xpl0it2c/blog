#JWT Authentication Flow and Plan.

JWT is stored in memory. (Expires in 2 min, no local/session storage !)
Refresh token is stored as a Secure,HttpOnly,SameSite cookie. (Expires in 15 min)

The refresh token is sent & retrieved via cookies
JWT is sent via request body and retrieved via a url query param or the Authorization header (Bearer).

Inside the refresh token we store an UUID.
Inside the JWT we store the autehnticated user's ID.
Inside the cache we store the refresh token's expiration date associated to the UUID we store in the refresh token.
As JSON it would look like this:
{
    "REFRESH_TOKEN_UUID": "SOME_DATE_AT_WHICH_THE_TOKEN_STOPS_BEING_VALID"
}

Please note that the expiration date is a unix timestamp.
In case you subtract a later date from a earlier one,
The result is positive (e.g if a is 3PM and 15 Minutes(in unix) and b is 3PM and 13 Minutes(in unix), a - b > 0)
Also, unix timestamps in my opinion are a lot simpler and easier to work with than "regular dates".
They are just numbers, and that makes them simple and powerful.

define path /login method post:
    recieve cookie - refresh token
    if refresh token in cache and is valid - send jwt
    recieve params - username & password.
    Retrieve user info by name from db
    if no user found with such name - require the user to re-enter his credentials.
    Hash Password recieved from user
    Compare hashed password from db to user's hased password
    if they don't match - request the user to re-enter his credentials
    Generate refresh_token & jwt
    Send refresh_token and jwt back to user

define path /refresh method get:
    receieve cookie - refresh_token
    if refresh_token isn't valid - respond with error and redirect to login
    send jwt in response body

define path /logout method post:
    recieve cookie - refresh_token
    remove refresh_token from cache
    client purges JWT from memory.
