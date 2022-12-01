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
          "post_id": "1", 
          "poster_id": "3", 
          "poster_name": "Billy Bob",
          "poster_image": null,
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
          "post_id": "2", 
          "poster_id": "2", 
          "poster_name": "Mary Sue",
          "poster_image": "https://images.unsplash.com/photo-1627161683077-e34782c24d81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&w=80&q=80",
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

function createPost(postObject, userID) {
  //TODO
  // call API, then...
  
  updatePostWeight(1)
  updatePostWeight(2)
  return true 
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
          let time_elapsed = Math.min(0.05,((now_time-post_time) /(1000*60*60*24) )) 
          let rank = (1/time_elapsed) * (post_comment_count + post_likes_score + 1) * max_ranking
          console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
          console.log('raw data: ',time_elapsed, (post_comment_count+post_likes_score+1), max_ranking )
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
            let time_elapsed = Math.min(0.05,((now_time-post_time) /(1000*60*60*24) )) 
            let rank = (1/time_elapsed) * (post_comment_count + post_likes_score + 1) * max_ranking
            console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
            console.log('raw data: ',time_elapsed, (post_comment_count+post_likes_score+1), max_ranking )
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
          let time_elapsed = Math.min(0.05,((now_time-post_time) /(1000*60*60*24) )) 
          let rank = (1/time_elapsed) * (post_comment_count + post_likes_score + 1) * max_ranking
          console.log('for viewer_id, post_id, rank is:', viewer_id, post_id, rank)
          console.log('raw data: ',time_elapsed, (post_comment_count+post_likes_score+1), max_ranking )
          updatePostWeightTable(viewer_id, post_id, rank)
        }
        return 
      }
    })
  }


}

function getPostsFeed(userID) {
  // Taylor working on it!
}

module.exports = {getPostList, createPost, updatePostWeight, updateAllPostWeights, getPostsFeed}
