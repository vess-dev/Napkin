const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


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

function makeFriendRequest(friend_id, userID) {
  console.log('starting makefriendrequest route wtih', friend_id, userID)
  return new Promise((resolve, reject) =>{
     db.pool.query(`select friendship_status from friendships 
     WHERE user_id = ? and friend_id = ? `, [userID, friend_id],
      function(error, results) {
        console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else { 
          if (results.length == 0) { 
            // make friends! 
            console.log('not yet friends - so request!')
            makeFriendsStatus(friend_id, userID, 'requested')
            makeFriendsStatus(userID, friend_id, 'pending')
            return resolve({"Success": "friendship created"})
          }             
          if (results.friendship_status == 'accepted')  {
            return reject(new BaseError("No request needed", 400, "you're already friends"))
          } else if (results.friendship_status == 'blocked'){
            return reject(new BaseError("BLOCKED", 400, "you may not make another request for this user"))
          } 
          return resolve(results);        
        }
  });
})}

async function makeFriendsStatus(friend_id, userID, newStatus) {
  return new Promise((resolve, reject) =>{
  db.pool.query(`insert into friendships (user_id, friend_id, friendship_status) values
      ?,?,?`,
      [userID, friend_id, newStatus],
      function(error, results) {
        console.log(results)
        if (error) {    
          console.log('error on makeFriendsStatus', error)                
          return reject(new BaseError("DB Error", 500, error));
        }
        else { 
            return resolve({"Success": "friendship requested"})
        }

})
})};

module.exports = {getFriendList, makeFriendRequest}
