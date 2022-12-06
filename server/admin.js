const bcrypt = require('bcrypt');
const crypto = require('crypto');

const db = require('./dbi.js');
const routes = require('./routes');
const BaseError = require('./BaseError.js');

function getUsersForAdmin(statusWanted, userID) {
        return new Promise((resolve, reject) =>{
          db.pool.query(`select * from users where user_status = ? and 1=(select admin_flag from users where user_id=?)`,
           [statusWanted, userID],
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

function setStatusForAdmin(statusWanted, targetUser, adminUserID) {
  /* 
  update users set user_status = 'pending' 
  where user_id=(select * from (select user_id from users where user_id=2 limit 1) tbla)
  and 1=(select * from (select admin_flag from users where user_id=1) tblb)
  */ 
  return new Promise((resolve, reject) =>{
    db.pool.query(`update users set user_status = ? 
    where user_id=(select * from (select user_id from users where user_id=? limit 1) tbla)
    and 1=(select * from (select admin_flag from users where user_id=?) tblb)`,
     [statusWanted, targetUser, adminUserID],
     function(error, results) {
       console.log(results)
       if (error) {                    
         return reject(new BaseError("DB Error", 500, error));
       }
       else { 
         if (statusWanted == 'active') {triggerGroupCreation(targetUser) }         
         return resolve(results);        
       }
 });
})
}

function triggerGroupCreation(userID) {
  let groupObject = {
    group_name: 'All Friends',
    owner_id: userID,
    group_ranking: 4
  }
  db.pool.query(`select from count(*) as rows from groups where group_name='All friends' and user_id = ?`, [userID]).then(
    result => {
      if (result[0].rows == 0) {
        db.pool.query(`insert into groups set ? `, groupObject)
      }
    })

}

module.exports = {triggerGroupCreation, getUsersForAdmin, setStatusForAdmin} ;
