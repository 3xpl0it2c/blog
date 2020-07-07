# Blog Project

Made By 3xpl0it2c.

## About the project:

I realized I have never written anything bigger than a 300-line script,
So I thought I might try and here we are.
This project is very simple, **it is just a dead-simple blog**.
Users can sign up with their emails and passwords,
And when they sign in they can publish Articles, comments and read other people's content.<br>
That's it.<br>
There is no payment, no tracking and no rules about content.
I believe everyone deserves a chance.


### The Tech Stack:
* For the main database I chose PostgreSQL.
* Redis serves as the main cache.
* The Node.js framework of choice is koa with koa-router, koa-cobody, formidable and slonik.
* Currently there is no front-end, I don't know whether I need an SPA and if so which framework to choose.
* Of course I proxy Node.js with NGINX

### Why X over Y ?
#### PostgreSQL:
I have chosen PostgreSQL because it is flexible and extendable.
It is old and it is quality.
If I want to, I can create my own datatypes, write python extensions and the docs are great.
Postgres is just awesome in my opinion.

#### Redis:
Well... Why not ?<br>
Everybody uses Redis, everybody knows redis and everybody loves Redis.
It fast, reliable and feature-rich. Like a swiss-army knife.


#### Node.js:
I think we can all agree that nobody does I/O like Node.
Node is known to handle big loads with zero effort.
Besides, I really like Typescript and honestly I don't feel like a project this small needs something like Java.
Most of the web stuff is I/O basically so why not just use the best I/O system out there ?

#### NGINX:
Honestly, I am not an expert in this domain,
But from my understanding - Apache is synchronous and it is hard to configure.
NGINX seems simple enough for me, and I saw a lot of people use it, so I stuck to the heard.
