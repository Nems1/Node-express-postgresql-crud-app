const config = require('../services/configs.js');
const { getOffset, emptyOrRows } = require('../utility/helper.js');
const products  = require('../data/products.json');
const { Pool } = require('pg');
// Establish connection to database
const db = new Pool(config.db);
async function showAllUsers() {
    const offset = getOffset(1,config.listPerPage);
    const sql_stmt = `select * from users  OFFSET $1 LIMIT $2`;
    const users = await db.query(sql_stmt,[offset,config.listPerPage]);
    return emptyOrRows(users.rows);
}
// Find user 
async function findUser(email) {
    const sql_stmt = `select * from users where email = $1`;
    const userInfo = await db.query(sql_stmt, [email]);
    return emptyOrRows(userInfo.rows);
}
// Create new user 
async function createNewUser(data) {
    sql_stmt = `insert into users(firstName, lastName, email, password)
                values($1, $2, $3, $4)`;
        await db.query(sql_stmt, [ data.firstName, data.lastName, data.email, data.password ], (err, result) => { 
        if (err) { 
            console.error(err.message);
        }
        console.log('\n\tEmail Id: ', data.email);
        console.log('\n\tCreated successfully');
    });
}
// Create user sign in record 
async function createUserSignInRecord(data) {
    sql_stmt = `insert into login(userid,email)
                values($1, $2)`;
        await db.query(sql_stmt, [ data.userid,data.email ], (err, result) => { 
        if (err) { 
            console.error(err.message);
        }
        console.log(`\n\t User Email ID: ${data.email}`);
        console.log('\n\t  Signed in successsfully');
    });
}
// Create user comment record 
async function createUserComment(data) {
    sql_stmt = `insert into contact(email,userid,comment)
                values($1, $2, $3)`;
        await db.query(sql_stmt, [ data.email,data.userid, data.comment ], (err, result) => { 
        if (err) { 
            console.error(err.message);
        }
        console.log('\n\t  Comment sent successfully');
    });
}
// Get all products
async function getProducts(req, res) {
    const sql_stmt = `select * from products`;
    const items = await db.query(sql_stmt);
    return emptyOrRows(items.rows);    
   }
// Export modules
module.exports = {
    showAllUsers,
    findUser,
    createNewUser,
    createUserSignInRecord,
    createUserComment,
    getProducts,
};
