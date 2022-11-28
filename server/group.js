const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');
const { group } = require( 'console' );


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getGroupList(user_id) {
  console.log('getGroupList was called')
  return new Promise((resolve, reject) =>{
    db.pool.query(`SELECT group_id, group_name, group_ranking FROM groups WHERE owner_id ='${user_id}'`,
      function(error, results, fields) {
        console.log(error, results, fields)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }

    })});

};


/**
 *  Given a group object, attempts to add that group
 */ 

function addNewGroup(groupObject) {
  console.log('called addNewGroup with ',groupObject)
  return new Promise((resolve, reject) =>{
    // Ensure required fields are included
    if (!groupObject.group_name || !groupObject.owner_id ) {
      return reject(new BaseError("Missing Fields", 400, "Group name and owner_id are required"));
    }
    if (!groupObject.group_ranking) {groupObject.group_ranking = 4}
    insertGroup(groupObject.group_name, groupObject.owner_id, groupObject.group_ranking)
    .then(response=>resolve(response))          
    .catch((error)=> {          
        return reject(error);
    });                 
    })
  };


function insertGroup(group_name, owner_id, group_ranking) {
  return new Promise((resolve, reject) =>{

    db.pool.query('INSERT INTO groups SET ?', {group_name: group_name, owner_id: owner_id, group_ranking: group_ranking},
      function(error, results, fields) {
        console.log(error, results, fields)
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {          
            return reject(new BaseError("DB Error", 400, "Group already exists"));
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

module.exports = {getGroupList, addNewGroup}