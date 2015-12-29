# the-peace-pledge
A web application in order to take the peace pledge which is signed by all in order to pledge that they want peace no matter what BS their governments want to happen. Goal is to reach all the 7 billion people for sure. :)

LIVE DEMO: https://damp-ridge-2114.herokuapp.com/

This project is made as a GCI Task with organization [FOSSASIA](http://fossasia.com). Thank you FOSSASIA. Please feel free to make open source contributions we need you.

## Local Deployment
In order to run it locally first clone this github repo.

After cloning this repo in the main directory run this command
```bash
npm insall
```

### ENVIRONMENT
The two environment variables you need to configure are
- NODE_ENV (production or development)
- MONGODB_CONNECTION_URL (Connection URL for mongodb database)

You can configure them in config.js file for development environment but for production the procedure can vary.

### Running it
After doing the above steps run command
```
npm start (to start the server)
```

The server listens by default on localhost:3000 but you can change it by configuring these two environment variables

- PORT (Set it to the port you want to listen on)
- HOST (Set it to the host you want to listen on)


#### Some screenshots of the app
- [Index Main Page](docs/assets/screenshots/index.png)
- [Login Page](docs/assets/screeenshots/login.png)
- [Peace Pledgers Page](docs/assets/screenshots/pledgers.png)
- [Signup page](docs/assets/screenshots/signup.png)
- [User page](docs/assets/screeenshots/user.png)


#### LICENSE
GNU GPL v3.0 (see [LICENSE.md](LICENSE.md))
