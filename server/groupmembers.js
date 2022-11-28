const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getGroupMembersList(group_id, requester_id) {
  console.log('getGroupMembersList was called')
  return new Promise((resolve, reject) =>{
     db.pool.query('SELECT * FROM group_memberships JOIN users ON group_memberships.user_id=users.user_id WHERE group_id = ? ', group_id,
      function(error, results) {
        console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }
      })

      console.log('result1', result)
      resolve(result)
     
    })
  };
    
    

  //});



/**
 *  Given a username, password, and other option details, attempts to insert that user into the 
 *  datbase. 
 *  If user is created successfull, the promise is reolved and userid is returned. 
 *  Else, promise is rejected and an error message is returned.
 */ 
/*function insertUser(username, password, fullname) {
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
*/
module.exports = {getGroupMembersList}
