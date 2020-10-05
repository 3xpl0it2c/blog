/*
Upon a POST to /users/verify_email
This function should:

1.Aqcuire a token from the url.
2.Verify it for safety.
3.Using the repository:
    Find a user with the corresponding token.
    If the difference between the date of registration and now is bigger than 1 day:
        Delete the user's account.
        And Respond with a message explaining the timeout.
    Else:
        Set the user as verified.
        Respond with a successful message.

*/

export const stub = '';