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
  let comment_content = commentObject.comment_content
  let post_id = commentObject.post_id
  console.log(comment_content, post_id)
  return new Promise((resolve, reject) =>{
     db.pool.query('INSERT INTO comments SET ?', {commenter_id: userID, comment_content: comment_content, comment_timestamp: NOW(), post_id: post_id},
      function(error, results) {
        console.log('error:',error)
        console.log('results',results)
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
