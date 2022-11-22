const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function getPostList() {
  console.log('getPostList was called')
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
        let result = [{       
          "post_id": "a0001", 
          "poster_id": "user002", 
          "poster_name": "Billy Bob",
          "post_title": "The best picnic evah", 
          "post_content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.", 
          "post_image": "https://images.unsplash.com/photo-1593034509785-5b17ba49f683?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80", 
          "post_likes_score": 2, 
          "post_comments_count": 12, 
          "post_visible": true, 
          "post_timestamp": "2020-01-01 10:10:10",
          "user_reaction": 1
        },
        {       
          "post_id": "a0002", 
          "poster_id": "user003", 
          "poster_name": "Mary Sue",
          "post_title": "I like cows", 
          "post_content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.", 
          "post_image": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80", 
          "post_likes_score": 0, 
          "post_comments_count": 0, 
          "post_visible": true, 
          "post_timestamp": "2022-01-01 10:10:10",
          "user_reaction": 0
        }
      ]

        resolve(result);  
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
module.exports = {getPostList}
