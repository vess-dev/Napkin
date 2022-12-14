const bcrypt = require('bcrypt');
const crypto = require('crypto');

const db = require('./dbi.js');
const routes = require('./routes');
const BaseError = require('./BaseError.js');

const test = require('./test.js');

function getUsersForAdmin(statusWanted, userID) {
        return new Promise((resolve, reject) =>{
          db.pool.query(`select * from users where user_status = ? and admin_flag = 0 and 1=(select admin_flag from users where user_id=?)`,
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
         if (statusWanted == 'active') { triggerGroupCreation(targetUser) }         
         return resolve(results);        
       }
 });
})
}

function triggerGroupCreation(userID) {
  let groupObject = {
    group_name: "All Friends",
    owner_id: userID,
    group_ranking: 4
  }

  return new Promise((resolve, reject) =>{
    db.pool.query(`select count(*) as rcount from groups where group_name = 'All Friends' and owner_id = ?`, 
    [userID],
      function(error, results, fields) {
        if (error) {
          return reject(new BaseError("DB Error", 500, error));
        }
        console.log('got row count', results)
        console.log('try result rows', results[0].rcount )
        if ( results[0].rcount == 0 ) {
          db.pool.query(`insert into groups set ? `, groupObject)
          return resolve(results);   
        }
      })
  })
}

module.exports = {triggerGroupCreation, getUsersForAdmin, setStatusForAdmin} ;
