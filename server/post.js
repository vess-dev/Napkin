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
            putPostInGroup(userID, postObject.group_id, resultsinsertID)
          }
          return resolve(results.insertId);        
        }
    });
  });

}

function putPostInGroup(user_id, group_id, post_id) {
  //TODO
}

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
          console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
          updatePostWeightTable(viewer_id, post_id, rank)
        }
        return 
      }
    })
  }

  async function updatePostWeightByUser(incoming_user_id) {
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
        on (tab1.owner_id = tab2.viewer_id AND tab1.member_id = tab2.poster_id) having user_id = ?`, incoming_user_id,
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
            console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
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
          console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
          console.log('raw data: ',time_elapsed, (post_comment_count+post_likes_score+1), max_ranking )
          updatePostWeightTable(viewer_id, post_id, rank)
        }
        return 
      }
    })
  }




function getPostList(userID) {
  return new Promise((resolve, reject) =>{
     db.pool.query(`select users.user_handle, users.user_image, post_weight, post_timestamp, tmp.post_id, 
     post_title, post_content, post_image, post_likes_score, post_comment_count
      from (select * from posts_feed where user_id= ? ) tmp 
      inner join posts on posts.post_id=tmp.post_id 
     inner join users on posts.user_id=users.user_id order by post_weight desc;`
     , userID, 
      function(error, results) {
        console.log(results)
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {               
          return resolve(results);        
        }
      })})
}

module.exports = {getPostList, createPost, updatePostWeightByPost, updatePostWeightByUser, updateAllPostWeights}
