const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getFriendList(userID) {
  console.log('getFriendList function called')
  return new Promise((resolve, reject) =>{
     db.pool.query(`select friend_id, user_first_name, user_last_name, user_handle, user_image, user_status 
     from friendships join users on friend_id=users.user_id where friendships.user_id = ? `, userID,
      function(error, results) {
        console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }

    
    

  });
})}


module.exports = {getFriendList}
