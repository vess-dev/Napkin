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

module.exports = {getUsersForAdmin} ;
