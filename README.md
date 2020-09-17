# Blog Project

Made By 3xpl0it2c.

## About the project:

I realized I have never written anything bigger than a 300-line script,
So I thought I might try and here we are.
This project is far from complex, **it is just a dead-simple social network**.
Think of this like Medium.
Users can sign up with their emails and passwords,
And when they sign in they can publish Articles, comments and read other people's content.
That's it.
I might add in the future analytics and mock payments with [Stripe](https://stripe.com/) (this was never meant to be deployed).
But that's it. This project basically serves as a part of my experience and learning.
Expect a lot of "clean-up" commits, I want this project to be my best code.

### The Tech Stack:
* For the main database I chose PostgreSQL - a very flexible & reliable RDBMS.
* Redis serves as the main cache - everybody uses Redis.
* The Node.js framework of choice is Koa with Koa-router, Koa-cobody, Formidable and Slonik.
* Currently there is no front-end, I don't know whether I need it right now.
* NGINX & certbot proxy over Node.js - NGINX Manages CORS,CSP and so forth.

### Development:
**If all you want is to run the app, just install docker compose and let it do it's job**

However, you might just need these if you want anything more than that:

#### Linting:
* EditorConfig support is crucial if you want to contribute.
* Prettier for linting.
* ESLint for linting & Style Enforcing.

#### Compiling & Building:
* Typescript compiler.
* Node.js (Obviously).
* Yarn dependency manager.

#### Running the app:
* Docker with Docker Compose in order to run the app.

#### Contributing:
* Facebook's Jest for testing.
* Obviously, Git.


### Status:
Consider this list:
- [ ] Redis Caching
- [ ] User CRUD
- [ ] Article CRUD
- [ ] Docker integration
- [x] Build system
- [x] Project Structure
