const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getUserList() {
  return new Promise((resolve, reject) =>{
    db.pool.query('select username, count(sessionuuid) as "Sessions" from Users LEFT join Session on Users.userid = Session.userid group by username',
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
    if (!userObject.username || !userObject.password) {
      return reject(new BaseError("Missing Fields", 400, "Username and Password are required fields"));
    }

    bcrypt.genSalt(10).then((salt) => {              
      bcrypt.hash(userObject.password, salt).then((hash) =>{        
        // Store hash in the database
        insertUser(userObject.username, hash, userObject.fullname)
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
function insertUser(username, password, fullname) {
  return new Promise((resolve, reject) =>{
    db.pool.query('INSERT INTO Users SET ?', 
      {username: username, password: password, fullname: fullname}, 
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
