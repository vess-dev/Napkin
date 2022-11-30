const db = require('./dbi.js');
const BaseError = require('./BaseError.js');


/**
 *  Assumes the user is authenticated to perform this action
 *  If promise is resolved, returns a list of users
 */ 
function addComment(commentObject, userID) {
  console.log('addComment function called')
  console.log('commentObject is', commentObject)
  console.log('userID is', userID)
  return new Promise((resolve, reject) =>{
     db.pool.query('INSERT INTO comments SET ?', {commenter_id: userID, comment_content: commentObject.comment_content, comment_timestamp: NOW(), post_id: commentObject.post_id},
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


module.exports = {addComment}
