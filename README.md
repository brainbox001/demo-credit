# Demo-credit
Respository for a demo wallet application.
### Note :
+ If trying to access the app and it delays to load, that's because the cloud service has spin down the app due to inactivity, you just have to wait for about 2 minutes or less.

### Tech stacks:
+ Node.js(express)
+ Typescript
+ Mysql(knex js ORM)

### Features
  + A basic authentication system that authenticate users with their email and password.
  + Registered users are able to fund their account.
  + Feature that allows users to withdraw from their wallet.
  + Allows users to transfer funds from their wallet to another user's wallet.
  + App handles authorization too, that means it ensures a user can't try to transfer funds from another user's wallet.
  + Users can only transfer or withfraw amounts that are less than their current balance.
  + Users can log back into their account in case they were logged out.
  + Rejects signup request from users found in the adjutor's karma blacklist.
  + Unauthenticated users can't perform :-
    - withdraw
    - fund account
    - transfer funds
### Database schema
  + The database schema e-r diagram link is pasted below:
  + [db e-r diagram](https://dbdesigner.page.link/PU2n88tgMTGbR7jh7)

### Setup
  + git clone https://github.com/brainbox001/demo-credit .
  + Install node js
  + run npm install
  + run npx tsc
  + run npm migrate
  + run npm run dev (for development environment) || npm start (for production environment).
### Endpoints
+ **GET / :**
  - returns a welcome message for unauthenticated users and user's details for authenticated users.
+ **POST /register :**
    - Registers a new user.
    - **params :**
        - name : string *required.
        - email : string *required.
        - password : string *required.
        - phoneNumber : number *required.
        - The request would accept strings for phoneNumber and numbers for password, a parser function will parse them before forwarding to the controller.
+ **POST /login :**
    - Logs in a user.
    - **params :**
        - email : string *required.
        - password : string *required.

