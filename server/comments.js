const db = require('./dbi.js');
const BaseError = require('./BaseError.js');
const posts = require('./post.js');

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
     db.pool.query('INSERT INTO comments SET ?', {commenter_id: userID, comment_content: comment_content, post_id: post_id},
      function(error, results) {
        console.log('error:',error)
        console.log('results',results)
        console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else { 
          recalculateComments(post_id);              
          return resolve(results);        
        }

  });
})}

async function recalculateComments(post_id) {
return new Promise((resolve, reject) =>{
db.pool.query('UPDATE posts set post_comment_count = (select count(*) as ccount from comments where post_id=? group by post_id ) where post_id = ?', [post_id, post_id],
function(error, results) {
  console.log('error:',error)
  console.log('results',results)
  console.log(results)
  if (error) {   
    console.log('error on comments', error)                 
    return reject(new BaseError("DB Error", 500, error));
    
  }
  else { 
    console.log('comments updated for ',post_id)
    posts.updatePostWeightByPost(post_id)            
    return resolve(results);        
  }
})})
}

function getCommentsOnPost(post_id, userID) {
  console.log('getCommentsOnPost function called', post_id)
  return new Promise((resolve, reject) =>{
     db.pool.query('SELECT if(? = commenter_id, 1, 0) as comment_toggle, comment_id, commenter_id, user_handle, user_image, comment_content, comment_timestamp FROM comments join users on (commenter_id=user_id) where post_id = ?', [userID, post_id],
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

module.exports = {addComment, getCommentsOnPost}
