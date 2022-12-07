const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getUserList() {
  return new Promise((resolve, reject) =>{
    db.pool.query('select user_handle, users.user_id, user_image, user_first_name, count(session_id) as "#sessions" from users LEFT join sessions on sessions.user_id = users.user_id group by users.user_id',
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

function searchUsers(searchstring, userID) {
  // badly documented overload to avoid touching server.js & resulting merge-fest.
  if (searchstring == "EXACTLYME") {
    return new Promise((resolve, reject) =>{
      db.pool.query('select user_handle, users.user_id, admin_flag, user_image, user_first_name from users WHERE user_id=?', 
        [userID],
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
    })
  
  } else {
  searchstring = '%'+searchstring+'%'
  console.log('got into searchUsers and searchstring is', searchstring)
  return new Promise((resolve, reject) =>{
    db.pool.query('select user_handle, users.user_id, user_image, user_first_name from users WHERE (user_first_name LIKE ?) OR (user_last_name LIKE ?) OR (user_handle LIKE ?)', 
      [searchstring, searchstring, searchstring],
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
}}

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

    if (!userObject.user_status) {userObject.user_status = 'accepted'}
    if (!userObject.age) {userObject.age = 0}
    console.log('starting bcrypt')
    bcrypt.genSalt(10).then((salt) => {              
      bcrypt.hash(userObject.user_password, salt).then((hash) =>{        
        // Store hash in the database
        console.log('hash is ', hash)
        insertUser(userObject.user_first_name, userObject.user_last_name, userObject.user_email, hash, userObject.user_handle, userObject.user_status, userObject.age)
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
 *  database. 
 *  If user is created successfull, the promise is resolved and userid is returned. 
 *  Else, promise is rejected and an error message is returned.
 */ 
function insertUser(user_first_name, user_last_name, user_email, user_password, user_handle, user_status, age) {
  return new Promise((resolve, reject) =>{
    db.pool.query('INSERT INTO users SET ?', 
      {user_first_name: user_first_name, user_password: user_password, user_last_name: user_last_name, user_email: user_email, user_handle: user_handle, user_status: user_status, user_age: age}, 
      function(error, results, fields) {
        if (error) {
          console.log('error:', error)
          console.log('results:', results)
          if (error.code === 'ER_DUP_ENTRY') {          
            return reject(new BaseError("DB Error", 400, "Username already exists"));
          }
          else {
            return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
          }
        }
        else {        
          return resolve(results.insertId);        
        }
    });
  });
}
function changeUserPassword(newpassword, userID){
  return new Promise((resolve, reject) =>{
  bcrypt.genSalt(10).then((salt) => {              
    bcrypt.hash(newpassword, salt).then((hash) =>{        
      // Store hash in the database
      changePasswordDB(hash, userID)
      .then(response=>resolve(response))          
      .catch((error)=> {          
          return reject(error);
      })
    })
  })
})}

function changePasswordDB(hash,userID) {
  return new Promise((resolve, reject) =>{
    console.log('db got', hash, userID)
    db.pool.query('update users set user_password = ? where user_id= ? ', [hash, userID],
      function(error, results, fields) {
        if (error) {

            return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
        }
        else {
          // rows added          
          return resolve(results);        
        }
    });
  });
}

function updateUser(userObject,userID) {
  return new Promise((resolve, reject) =>{
    if (userObject && userObject.admin_flag ) { userObject.remove(admin_flag)}
    db.pool.query('update users set ? where user_id= ? ', [userObject, userID],
      function(error, results, fields) {
        if (error) {

            return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
        }
        else {
          // rows added          
          return resolve(results);        
        }
    });
  });
}

module.exports = {addNewUser, insertUser, getUserList, searchUsers, changeUserPassword, updateUser}
