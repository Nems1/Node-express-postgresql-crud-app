// Server configuration
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const config  = require('./services/configs');
const appRoutes = require('./routes/app_route.js');
const server = express();
const port = config.host.port;
const host = config.host.host;
//Configure templating engine
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, '/views'));
// Set assets resources
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "public")));
// Initialize session instance
server.use(
    session({
        secret: 'nexsm123',
        resave: false,
        saveUninitialized: false,
        cookie:{
            secure:false, // Only set to true if you are using HTTPS.
            httpOnly:false, // Only set to true if you are using HTTPS.
            maxAge:60000 // Session max age in milliseconds.
        } ,
    })
)
// Set home route and render it
server.use('/', appRoutes);
server.listen(port, () => { 
    console.clear();
    console.log(`\t\t    Server started\n\t\t http://${host}:${port}`);
});