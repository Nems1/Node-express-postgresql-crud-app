const appModels = require('../models/app_model.js');
const { asyncWrapper, saltAndHashPass,isPassValid} = require('../utility/helper.js');
const bcrypt = require('bcrypt');
const homeRoute = asyncWrapper(async (req, res, next) => {
    const User = req.session.user;
      if (User) {
        console.log('\n\tHome ->User: \n\t', User);
        res.render('index', {
            title: 'Home page',
            name: User.firstname + ' ' + User.lastname,
            isLoggedIn: true
        });
      } else {
        res.render('index', {
            title: 'Home page',
            name: 'Anonymous',
            isLoggedIn: false
        });
     }
}); 

const aboutRoute = async (req, res, next) => {
    const User = req.session.user;
    if (User) {
        res.render('about', {
            title: 'About Us',
            name: `${User.firstname} ${User.lastname}`,
            isLoggedIn: true
        });    
    } else {
        res.redirect('login');
    }
};

const contactRoute = async (req, res, next) => {
    const User = req.session.user;
    if (User) {
        console.log('Contact user from session : ', User);
        console.log(`Contact FirstName: ${User.firstname}, LastName: ${User.lastname}`);
        res.render('contact', {
            title: 'Contact Us',
            User: User,
            isLoggedIn: true
        });
    } else {
        res.redirect('login');
     }     
};

// Shopping Cart route
const shoppingCartRoute = async (req, res, next) => {
    const User = req.session.user;
    if (User) {  
        const items = await appModels.getProducts(req,res);
        console.log('\n\tshoppingCartRoute->Received ->');
        console.log('items is an: ', typeof items);
        //console.log(items);
        items.map(item => { 
            const image = `${item.image.url}${item.image.file}.${item.image.ext}`;
            //console.log('Inside map->item-> ', JSON.stringify(item.fields.image.fields.file.url))
            console.log('Inside map->item-> ', item);
        });
    
        res.render('cart', {
            title: 'Shopping Cart',
            name: `${User.firstname} ${User.lastname}`,
            items: items,
            isLoggedIn: true
        });    
    } else {
        res.redirect('login');
    }
};

const signupRoute = async(req, res, next) =>{
    res.render('signup', {
        title: 'Sign up',
        name: 'Anonymous',
        isLoggedIn: false
    }); 
};

const loginRoute = async (req, res, next) => {
        const User = req.session.user;
        if (User) {
            console.log('User with that credentials is already logged in');
            res.redirect('logout');
        } else {
            res.render('login', {
                title: 'Login',
                name:'Anonymous',
                isLoggedIn: false
            });
        } 
};

// Save new user information to database
const saveNewUser = async (req, res,next) => {
      // Get the form data from the request object
      const { firstName, lastName, email, password,password_2 } = req.body;
      console.log(`\n\t Form Data Captured \n\t firstName ${firstName} \n\t lastName ${lastName} \n\t Email ${email} \n\t Password ${ password} \n\t Password_2 ${ password_2}`);
      //Salt and hash the plain text password to secure it
      const hashedPass = await saltAndHashPass(password);
      //Check if the first password matches the second password
      const matches = password_2 === password;
      console.log('\n\tMatches ', matches);
      // Check if all fields have been filled or not 
      if (firstName && lastName && email && password && matches) {
        // Find if new user already exists in  the database
        const newUser = await appModels.findUser(email);
        console.log(`\n\t New user`, newUser);
        if (!newUser.length > 0) {
            await appModels.createNewUser({ firstName, lastName, email, password: hashedPass });
        } else {
        console.log(`\n\t User record already exists \n\t`, newUser);
        }
        res.status(301);
        // If user exists in the database give warming and send user to signin page
        res.redirect('login');     
      } else {
        console.log('Either some fields are left blank or passwords do not match');
        // Redirect to the signup page
        res.redirect('signup');
      }
}

// Sign in user and save the sign in
const saveUserLogin = async (req, res,next) => {
      // Get the form data from the request object
      const { email, password } = req.body;
      console.log(`\n\t Form Data Captured \n\t Email ${ email } \n\t Password ${ password }`);
      // Fetch user information from the database
      const getUser = await appModels.findUser(email);
      console.log(getUser);
      console.log('getUser.length: ', getUser.length);
      // Check if all fields have been filled or not 
      if (email && password && getUser.length > 0) {    
        //Get the Salted and hashed password from database
        const hashedPass = getUser[0].password;
        //Check if the first password matches the second password
        const matches = await isPassValid(password, hashedPass);
        console.log('\n\tPasswords Matches: ', matches);
        if (matches) {
            //Initialize session with logged in user information
            req.session.user = getUser[0];
            console.log('req.session.user: ', req.session.user);
            await appModels.createUserSignInRecord({ userid: req.session.user.userid, email });
            res.status(200);
            // Send user to home page
            res.redirect('/');
        } else {
            // req.session.user = " ";
            console.log(`\n\t Invalid password \n\t`);
            // Redirect to the signin page
            res.redirect('login');
        }     
      } else if(email && password && getUser.length === 0) {
          console.log(`\n\t User with that email doesn't exist!\n\tYou're been redirected to sign up page `);
            // Redirect to the signup page
            res.redirect('signup');
      }
      else {
          console.log('\n\tYou must provide a valid email or password to login');
          // Redirect to the signup page
          res.redirect('login');
      }
}

// Save new user comment to database
const saveUserComment = async (req, res, next) => {
    const email = req.session.user.email;
    const userid = req.session.user.userid;
    console.log('saveUserComment Email ID: ' + email);
    // Get the form data from the request object
    const comment = req.body.comment;
    console.log(`\n\t Comment Captured \n\t ${comment}`);
    // Check if all fields have been filled or not 
    if (comment) {
        await appModels.createUserComment({ email, userid, comment });
        res.redirect('/');
    } else {
        console.log('You cannot post a blank comment');
        // Redirect to the contact page
        res.redirect('/contact');
    }
}

// User logout route
const logoutRoute = function(req,res,next){
    // clear the session.
    req.session.destroy();
    // Redirect to the login page.
    res.redirect("/login");    
}

// export modules

module.exports = {
    homeRoute,
    aboutRoute,
    contactRoute,
    shoppingCartRoute,
    signupRoute,
    loginRoute,
    saveNewUser,
    saveUserLogin,
    saveUserComment,
    logoutRoute,
};