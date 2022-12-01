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
  updatePostWeight(post_id)
}

function updatePostWeight(post_id) {
    db.pool.query('select comments_count, post_likes_score, post_timestamp, group_ranking from posts join ', [],
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
        recalculateComments(post_id);              
        return resolve(results);        
      }
    })
    }

function updateAllPostWeights() {
  // get all post_ids and call updatePostWeight repeatedly...
}

function getPostsFeed(userID) {
  // Taylor working on it!
}

module.exports = {getPostList, createPost, updatePostWeight, updateAllPostWeights, getPostsFeed}
