const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');

function createPost(postObject, userID) {
  return new Promise((resolve, reject) =>{
    if (!postObject || !userID || !postObject.post_title || !postObject.post_content) {
      return reject(new BaseError('wrong parameters', 500, "must pass all params"))
    }
    db.pool.query('INSERT INTO posts SET ?', {user_id: userID, 
      post_title: postObject.post_title, post_content: postObject.post_content, 
      post_image: postObject.post_image, post_likes_score: 0, post_comment_count: 0, 
      post_visable: true},
      function(error, results, fields) {
        console.log(error, results, fields)
        if (error) {
            console.log('error creating post:', error)
            return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
        }
        else {
          // rows added     
          console.log('added post with number', results.insertId)   
          updatePostWeightByPost(results.insertId)
          if (postObject.group_id) {
            console.log('calling putPostInGroup with', userID, postObject.group_id, results.insertId)
            if (Number.isInteger(postObject.group_id)) {putPostInGroup(userID, postObject.group_id, results.insertId)}
            else {
              let allgroups = postObject.group_id.split(/[, ]+/)
              for (let onegroup of allgroups) {
                putPostInGroup(userID, onegroup, results.insertId)
              }
            }
          }
          return resolve(results.insertId);        
        }
    });
  });

}

function editPost(postObject, userID) {
  console.log('starting to editPost',postObject)
  return new Promise((resolve, reject) =>{
    if (!postObject || !userID || !postObject.post_title ||!postObject.post_id || !postObject.post_content) {
      return reject(new BaseError('wrong parameters', 500, "must pass all params"))
    }
    console.log('still ok?')
    let postID = postObject.post_id;
    let groupID = postObject.group_id
    delete postObject.post_id
    delete postObject.group_id
    console.log('now have postObject', postObject)
    db.pool.query('update posts SET ? where post_id = ?', [postObject, postID],
      async function(error, results, fields) {
        console.log(error, results, fields)
        if (error) {
            console.log('error editing post:', error)
            return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
        }
        else {
          // rows added     
          console.log('edited post with number', postID)   
          if (postObject.group_id) {
            await removePostFromAllGroups(userID, postID)
            console.log('calling putPostInGroup with', userID, groupID, postID)
            if (Number.isInteger(groupID)) {putPostInGroup(userID, groupID, postID)}
            else {
              let allgroups = groupID.split(/[, ]+/)
              for (let onegroup of allgroups) {
                putPostInGroup(userID, onegroup, postID)
              }
            }
          }
          return resolve(postID);        
        }
    });
  });

}

function getPostGroups(userID,post_id) {
  // not tested
  return new Promise((resolve, reject) =>{
    db.pool.query(`select group_id, group_name, post_id as inGroup from (select group_id, post_id
      from post_groups where post_id=?) b right join groups using (group_id) 
    where group_id in (select group_id from groups where owner_id=?)`, [post_id, userID],
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


function putPostInGroup(user_id, group_id, post_id) {
  return new Promise((resolve, reject) =>{
  db.pool.query(`replace into post_groups (group_id, post_id)
  select ?, ?
  where 
  ? IN (select group_id from groups where owner_id=? ) 
  and ? IN (select post_id from posts where user_id=? )`, 
  [group_id, post_id, group_id, user_id, post_id, user_id],
  (error, results) => {
       
    if (error) {   
      console.log('error on put post in group', error)
      return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));                
    } else { 
      console.log('post added to group successfully: ')
      updatePostWeightByPost(post_id) 
      return resolve(results.insertId);
   
    }
})})}

async function removePostFromAllGroups(user_id, post_id) {
  // does this code work? needs promises?
  db.pool.query(`delete from post_groups
  where post_id=? 
  and
  group_id IN (select group_id from groups where owner_id=? )`,[post_id, user_id])
  
  return 
}

async function deletePost(post_id, userID) {
  await deleteAllCommentsonPost(post_id, userID)
  await deleteAllReactionsonPost(post_id, userID)
  console.log('start delete post,', post_id)
  return new Promise((resolve, reject) =>{
    db.pool.query(`delete from posts_feed
    where post_id=?`,[post_id],
    (error, results) => {
       
    if (error) {   
      console.log('error on remove post in group', error)
      return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
                     
    } else { 
      console.log('post removed from group successfully: ', results)
      deletePostPart1b(post_id, userID)

      return resolve(results); 
    }
})})
  
}

async function deletePostPart1b(post_id, userID) {
  console.log('start delete post,', post_id)
  return new Promise((resolve, reject) =>{
    db.pool.query(`delete from post_groups
  where post_id=?  `,[post_id],
    (error, results) => {
       
    if (error) {   
      console.log('error on remove post in group', error)
      return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
                     
    } else { 
      console.log('post removed from group successfully: ', results)
      deletePostPart2(post_id, userID)
      return resolve(results); 
    }
})})
  
}

async function deletePostPart2(post_id, userID) {
  console.log('start delete post,', post_id)
  return new Promise((resolve, reject) =>{
    db.pool.query(`delete from posts
  where post_id=? 
  and
  user_id=? `,[post_id, userID],
    (error, results) => {
       
    if (error) {   
      console.log('error on remove post in group', error)
      return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
                     
    } else { 
      console.log('post removed from group successfully: ', results)
      updatePostWeightByPost(post_id) 
      return resolve(results); 
    }
})})
  
}

async function deleteAllCommentsonPost(post_id, userID) {
  console.log('start delete post comments,', post_id)
  return new Promise((resolve, reject) =>{
    db.pool.query(`delete from comments
    where post_id=?`,[post_id],
    (error, results) => {
       
    if (error) {   
      console.log('error on remove post in group', error)
      return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
                     
    } else { 
      console.log('post removed from group successfully: ', results)
      return resolve(results); 
    }
})})
}

async function deleteAllReactionsonPost(post_id, userID) {
  console.log('start delete post reactions,', post_id)
  return new Promise((resolve, reject) =>{
    db.pool.query(`delete from reactions
    where post_id=?`,[post_id],
    (error, results) => {
       
    if (error) {   
      console.log('error on remove post in group', error)
      return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
                     
    } else { 
      console.log('post reactions removed from successfully: ', results)
      return resolve(results); 
    }
})})
}

function removePostFromGroup(user_id, group_id, post_id) {
  return new Promise((resolve, reject) =>{
  db.pool.query(`delete from post_groups
  where group_id=? and post_id=? 
  and
  group_id IN (select group_id from groups where owner_id=? )`, 
  [group_id, post_id, user_id ],
  (error, results) => {
       
    if (error) {   
      console.log('error on remove post in group', error)
      return reject(new BaseError("DB Error", 500, "Error Code: " + error.code));
                     
    } else { 
      console.log('post removed from group successfully: ', results)
      updatePostWeightByPost(post_id) 
      return resolve(results); 
    }
})})}

async function updatePostWeightByPost(incoming_post_id) {
  // note: query returns multiple rows 
  
    db.pool.query(`select viewer_id, poster_id, post_id, max_ranking, post_likes_score, post_comment_count, post_timestamp from (
      select owner_id, member_id, max(group_ranking) as max_ranking from 
      (select groups.group_id, user_id as member_id, owner_id, group_ranking  
      from group_memberships 
      join 
      groups 
      on (groups.group_id=group_memberships.group_id) ) as tab3
      group by owner_id, member_id 
      ) as tab1
      JOIN 
      (select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id,
      posts.post_likes_score, posts.post_comment_count, posts.post_timestamp 
      from 
      (post_groups JOIN group_memberships using (group_id)) 
      JOIN posts using (post_id)) as tab2
      on (tab1.owner_id = tab2.viewer_id AND tab1.member_id = tab2.poster_id) having post_id = ?`, incoming_post_id,
      (error, results) => {
     
      if (error) {   
        console.log('error on post_weight', error)
        return;                 
      } else { 
        for (let onerow of results) {
          let {viewer_id, poster_id, post_id, max_ranking, post_likes_score, post_comment_count, post_timestamp, owner_id, member_id} = onerow
          let post_time = new Date(post_timestamp)
          let now_time = new Date(Date.now())
          let time_elapsed = Math.max(0.05,((now_time-post_time) /(1000*60*60*24) )) 
          let rank = (1000/time_elapsed) * (post_comment_count + post_likes_score + 1) * max_ranking
          //console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
          updatePostWeightTable(viewer_id, post_id, rank)
        }
        return 
      }
    })
  }

  async function updatePostWeightByUser(incoming_user_id) {
    // note: query returns multiple rows 
    // this is currently broken.  having problem, looks like.

    
      db.pool.query(`select viewer_id, poster_id, post_id, max_ranking, post_likes_score, post_comment_count, post_timestamp from (
        select owner_id, member_id, max(group_ranking) as max_ranking from 
        (select groups.group_id, user_id as member_id, owner_id, group_ranking  
        from group_memberships 
        join 
        groups 
        on (groups.group_id=group_memberships.group_id) ) as tab3
        group by owner_id, member_id 
        ) as tab1
        JOIN 
        (select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id,
        posts.post_likes_score, posts.post_comment_count, posts.post_timestamp 
        from 
        (post_groups JOIN group_memberships using (group_id)) 
        JOIN posts using (post_id)) as tab2
        on (tab1.owner_id = tab2.viewer_id AND tab1.member_id = tab2.poster_id) having viewer_id = ?`, incoming_user_id,
        (error, results) => {
       
        if (error) {   
          console.log('error on post_weight', error)
          return;                 
        } else { 
          for (let onerow of results) {
            let {viewer_id, poster_id, post_id, max_ranking, post_likes_score, post_comment_count, post_timestamp, owner_id, member_id} = onerow
            let post_time = new Date(post_timestamp)
            let now_time = new Date(Date.now())
            let time_elapsed = Math.max(0.05,((now_time-post_time) /(1000*60*60*24) )) 
            let rank = (1000/time_elapsed) * (post_comment_count + post_likes_score + 1) * max_ranking
            //console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
            //console.log('raw data: ',time_elapsed, (post_comment_count+post_likes_score+1), max_ranking )
            updatePostWeightTable(viewer_id, post_id, rank)
          }
          return 
        }
      })
    }
  

  async function updatePostWeightTable (user_id, post_id, post_weight) {
    db.pool.query('replace into posts_feed (user_id, post_id, post_weight) values (?,?,?)',[user_id, post_id, post_weight])
    return 
  }

async function updateAllPostWeights() {
    
     db.pool.query(`select viewer_id, poster_id, post_id, max_ranking, post_likes_score, post_comment_count, post_timestamp from (
      select owner_id, member_id, max(group_ranking) as max_ranking from 
      (select groups.group_id, user_id as member_id, owner_id, group_ranking  
      from group_memberships 
      join 
      groups 
      on (groups.group_id=group_memberships.group_id) ) as tab3
      group by owner_id, member_id 
      ) as tab1
      JOIN 
      (select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id,
      posts.post_likes_score, posts.post_comment_count, posts.post_timestamp 
      from 
      (post_groups JOIN group_memberships using (group_id)) 
      JOIN posts using (post_id)) as tab2
      on (tab1.owner_id = tab2.viewer_id AND tab1.member_id = tab2.poster_id) `,[],
      (error, results) => {
     
      if (error) {   
        console.log('error on post_weight', error)
        return;                 
      } else { 
        for (let onerow of results) {
          let {viewer_id, poster_id, post_id, max_ranking, post_likes_score, post_comment_count, post_timestamp, owner_id, member_id} = onerow
          let post_time = new Date(post_timestamp)
          let now_time = new Date(Date.now())
          let time_elapsed = Math.max(0.05,((now_time-post_time) /(1000*60*60*24) )) 
          let rank = (1000/time_elapsed) * (post_comment_count + post_likes_score + 1) * max_ranking
          //console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
          //console.log('raw data: ',time_elapsed, (post_comment_count+post_likes_score+1), max_ranking )
          updatePostWeightTable(viewer_id, post_id, rank)
        }
        return 
      }
    })
  }




function getPostList(userID) {
  return new Promise((resolve, reject) =>{
     db.pool.query(`select users.user_id, users.user_first_name, users.user_last_name, users.user_handle, users.user_image, post_weight, post_timestamp, tmp.post_id, 
     post_title, post_content, post_image, post_likes_score, post_comment_count
      from (select * from posts_feed where user_id= ? ) tmp 
      inner join posts on posts.post_id=tmp.post_id 
     inner join users on posts.user_id=users.user_id order by post_weight desc;`
     , userID, 
      function(error, results) {
        //console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }
      })})
}

function getMyPostList(userID) {
  return new Promise((resolve, reject) =>{
     db.pool.query(`select users.user_id, users.user_first_name, users.user_last_name, users.user_handle, users.user_image, post_timestamp, posts.post_id, 
     post_title, post_content, post_image, post_likes_score, post_comment_count   
     from posts 
     inner join users on posts.user_id=users.user_id 
     where posts.user_id= ?
     order by post_timestamp desc;`
     , userID, 
      function(error, results) {
        //console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }
      })})
}

module.exports = {deletePost, getPostGroups, editPost, getMyPostList, putPostInGroup, removePostFromGroup, getPostList, createPost, updatePostWeightByPost, updatePostWeightByUser, updateAllPostWeights}
