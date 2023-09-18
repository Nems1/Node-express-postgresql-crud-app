console.clear();
// Server configuration
const appRoutes = require('./routes/app_route');
const express = require('express');
const path = require('path');
const server = express();
const { Pool, Client } = require('pg');
require('dotenv').config();
const port = process.env.HOST_PORT;
const host = process.env.HOST_URL;
//Configure templating engine
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, '/views'));
// Set assets resources
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "public")));
// Set home route and render it
const db_credentials = {
    user: process.env.DB_USER,
    host: process.env.HOST_URL,
    port: process.env.DB_PORT,
    password: process.env.DB_USER_PASSWD,
    database: process.env.DB_NAME
};

// Establish connection to database
const db = new Pool(db_credentials);
// Run some tests
const db_data_obj = {
    sql_stmt: `select * from customer order by customer_id limit 10`,
}

server.get('/', (req, res) => { 
    db.query(db_data_obj.sql_stmt, (err, result) => { 
        if (err) {
            return console.error(err.message);
        }
      
        res.render('home', {
            customers: result.rows,
            title: 'Home page'
        });
    }); 
});

server.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

server.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
 });

server.listen(port, () => { 
    console.clear();
    console.log(`\t\t    Server started\n\t\t http://${host}:${port}`);
});