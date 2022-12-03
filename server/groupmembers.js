const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');
const posts = require('./post.js');

/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getGroupMembersList(group_id) {
  console.log('getGroupMembersList was called and group_id is', group_id)
  return new Promise((resolve, reject) =>{
     db.pool.query('SELECT user_handle, user_image, users.user_id, group_id FROM group_memberships JOIN users ON group_memberships.user_id=users.user_id WHERE group_id = ? ', [group_id],
      function(error, results) {
        console.log(error, results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }
      })
     
    })
  };
  function deleteGroupMember(group_id, friend_id, user_id) {
    return new Promise((resolve, reject) =>{
       db.pool.query(`DELETE FROM group_memberships WHERE group_id = ? 
       AND user_id=? AND 
       group_memberships.group_id IN 
       (select group_id from groups where group_id=? and owner_id= ? )`,
       [group_id, friend_id, group_id, user_id],
        function(error, results) {
          console.log(error, results)
          if (error) {                    
            return reject(new BaseError("DB Error", 500, error));
          }
          else {       
            db.pool.query('DELETE from posts_feed where user_id=?', user_id, updatePostWeightByUser(friend_id))        
            return resolve(results);        
          }
        })
       
      })
    };   

    function addGroupMember(group_id, friend_id, user_id) {
      return new Promise((resolve, reject) =>{
         db.pool.query(`replace INTO group_memberships (group_id, user_id)
         select ?, ? 
         WHERE
         ? IN (select group_id from groups where owner_id=?)
         AND ? IN (select friend_id from friendships where user_id=? and friendship_status='accepted')`, 

         [group_id, friend_id, group_id, user_id, friend_id, user_id],
          function(error, results) {
            console.log(error, results)
            if (error) {                    
              return reject(new BaseError("DB Error", 500, error));
            }
            else {  
              posts.updatePostWeightByUser(friend_id) ;           
              return resolve(results);        
            }
          })
         
        })
      };  



module.exports = {getGroupMembersList, deleteGroupMember, addGroupMember}
