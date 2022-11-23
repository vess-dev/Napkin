const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getUserList() {
  return new Promise((resolve, reject) =>{
    db.pool.query('select username, count(session_id) as "sessions" from Users LEFT join sessions on Users.user_id = session.user_id group by user_id',
      function(error, results) {
        console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {  
          console.log('results is', results)             
          return resolve(results);        
        }
    });
  });
}

/**
 *  Given a user object, attempts to add that user
 */ 
function addNewUser(userObject) {
  return new Promise((resolve, reject) =>{
    // Ensure username and password are present
    console.log('userObject has', userObject)
    if (!userObject.user_email || !userObject.user_password) {
      return reject(new BaseError("Missing Fields", 400, "Email and Password are required fields"));
    }

    bcrypt.genSalt(10).then((salt) => {              
      bcrypt.hash(userObject.user_password, salt).then((hash) =>{        
        // Store hash in the database
        console.log('hash is ', hash)
        insertUser(userObject.user_first_name, userObject.user_last_name, userObject.user_email, hash, userObject.user_handle, userObject.user_status)
        .then(response=>resolve(response))          
        .catch((error)=> {          
            return reject(error);
        });                 
      })      
    })
  });
}

/**
 *  Given a username, password, and other option details, attempts to insert that user into the 
 *  datbase. 
 *  If user is created successfull, the promise is reolved and userid is returned. 
 *  Else, promise is rejected and an error message is returned.
 */ 
function insertUser(user_first_name, user_last_name, user_email, user_password, user_handle, user_status) {
  return new Promise((resolve, reject) =>{
    db.pool.query('INSERT INTO users SET ?', 
      {user_first_name: user_first_name, user_password: user_password, user_last_name: user_last_name, user_email: user_email, user_handle: user_handle, user_status: user_status}, 
      function(error, results, fields) {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {          
            return reject(new BaseError("DB Error", 400, "Username already exists"));
          }
          else {
            return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
          }
        }
        else {
          // rows added          
          return resolve(results.insertId);        
        }
    });
  });
}

module.exports = {addNewUser, insertUser, getUserList}
