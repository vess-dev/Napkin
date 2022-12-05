const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


function getFriendList(userID,statusWanted) {
  console.log('getFriendList function called')
  if (!statusWanted) {
  return new Promise((resolve, reject) =>{
     db.pool.query(`select friend_id, user_first_name, user_last_name, user_handle, user_image, friendship_status, user_status 
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
else {
  return new Promise((resolve, reject) =>{
    db.pool.query(`select friend_id, user_first_name, user_last_name, user_handle, user_image, friendship_status, user_status 
    from friendships join users on friend_id=users.user_id where friendships.user_id = ? and friendship_status = ?`, [userID,statusWanted],
     function(error, results) {
       console.log(results)
       if (error) {                    
         return reject(new BaseError("DB Error", 500, error));
       }
       else {               
         return resolve(results);        
       }
 });
})
}}

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
          console.log(results)
          //console.log('results.friendship_status is', results[0].friendship_status)
          if (results.length == 0) { 
            // make friends! 
            console.log('not yet friends - so request!')
            makeFriendsStatus(friend_id, userID, 'requested')
            makeFriendsStatus(userID, friend_id, 'pending')
            return resolve({"Success": "friendship created"})
          } 
          else if (results[0].friendship_status == 'pending') {
            makeFriendsStatus(friend_id, userID, 'accepted')
            makeFriendsStatus(userID, friend_id, 'accepted')
            console.log('setting to accepted', friend_id, userID)
          }        
          else if (results[0].friendship_status == 'accepted')  {
            return reject(new BaseError("No request needed", 400, "you're already friends"))
          } else if (results.friendship_status == 'blocked'){
            return reject(new BaseError("BLOCKED", 400, "you may not make another request for this user"))
          } 
          return resolve(true);        
        }
  });
})}

async function makeFriendsStatus(friend_id, userID, newStatus) {
  return new Promise((resolve, reject) =>{
    console.log('makeFriendStatus called')
  db.pool.query(`replace into friendships (user_id, friend_id, friendship_status) values
      (?,?,?)`,
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

function getFriendGroups(userID, friendID) {
  return new Promise((resolve, reject) =>{
    db.pool.query(`select group_id, group_name, user_id as inGroup from (select group_id, user_id from group_memberships where user_id=?) b right join groups using (group_id) 
    where group_id in (select group_id from groups where owner_id=?)`, [friendID, userID],
     function(error, results) {
       console.log(results)
       if (error) {                    
         return reject(new BaseError("DB Error", 500, error));
       }
       else {               
         return resolve(results);        
       }
 });
})
}

function deleteFriendEntries(friendID, userID) {
  return new Promise((resolve, reject) =>{
    db.pool.query(`delete from friendships where (user_id=? and friend_id = ? and friendship_status in ('accepted', 'pending', 'blocked')) or (user_id=? and friend_id=? and friendship_status in ('accepted', 'requested', 'rejected')) 
    `, [friendID, userID, userID, friendID],
     function(error, results) {
       console.log(results)
       if (error) {                    
         return reject(new BaseError("DB Error", 500, error));
       }
       else {               
         return resolve(results);        
       }
 });
})
}

function rejectFriend (friendID, userID) {
  makeFriendsStatus(friendID, userID, 'rejected')
  makeFriendsStatus(userID, friendID, 'blocked')

}

module.exports = {rejectFriend, getFriendList, makeFriendRequest, getFriendGroups, deleteFriendEntries}
