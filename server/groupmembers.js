const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getGroupMembersList(group_id) {
  console.log('getGroupMembersList was called')
  return new Promise((resolve, reject) =>{
    /* db.pool.query('select post_id, post_content as "Sessions" from Users LEFT join Session on Users.userid = Session.userid group by username',
      function(error, results) {
        console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }
    */  
        if (group_id == 'g1') {
        let result = [{       
          
          "friend_id": "user002", 
          "friend_handle": "Billy Bob",
          "friend_image": null,
          
        },
        {       
          "friend_id": "user003", 
          "friend_name": "Mary Sue",
          "friend_image": "https://images.unsplash.com/photo-1627161683077-e34782c24d81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&w=80&q=80",
        }
      ] 
      console.log('result1', result)
      resolve(result)
    } else if (group_id == 'g2') {
        let result = [{       
          
          "friend_id": "user006", 
          "friend_handle": "Bobby Boo",
          "friend_image": null,
          
        },
        {       
          "friend_id": "user003", 
          "friend_name": "Mary Sue",
          "friend_image": "https://images.unsplash.com/photo-1627161683077-e34782c24d81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&w=80&q=80",
        }
      ]   
      console.log('result2', result)
      resolve(result)
      } else {
        result = ""
        reject("didn't find this group")}

        ;  
    });
    
    

  //});
}

/**
 *  Given a user object, attempts to add that user
 */ 
/*function addNewUser(userObject) {
  return new Promise((resolve, reject) =>{
    // Ensure username and password are present
    if (!userObject.username || !userObject.password) {
      return reject(new BaseError("Missing Fields", 400, "Username and Password are required fields"));
    }

    bcrypt.genSalt(10).then((salt) => {              
      bcrypt.hash(userObject.password, salt).then((hash) =>{        
        // Store hash in the database
        insertUser(userObject.username, hash, userObject.fullname)
        .then(response=>resolve(response))          
        .catch((error)=> {          
            return reject(error);
        });                 
      })      
    })
  });
}
*/
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
