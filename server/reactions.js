const db = require('./dbi.js');
const bcrypt = require('bcrypt');
const BaseError = require('./BaseError.js');

function getReaction(post_id, user_id) {
    console.log('get reaction called')
    return new Promise((resolve, reject) =>{
        db.pool.query(`select count(user_id) as current_reaction from reactions where user_id=? and post_id=?`
        , [user_id, post_id], 
         function(error, results) {
            console.log(error)
           console.log(results)
           if (error) {                    
             return reject(new BaseError("DB Error", 500, error));
           }
           else {               
            return resolve(results);
                    
           }
         })})

}

function dispatchReaction(post_id, user_id) {
    console.log('dispatch reaction called')
    getReaction(post_id, user_id).then(results => {
        if (results.current_reaction) { 
            console.log('found a current reaction in the db')
            deleteReaction(post_id, user_id)
        } else {
            console.log('no reaction found, add one')
            addReaction(post_id, user_id)
        }
    }
        ).then(() => updateLikes(post_id))
}
function addReaction(post_id, user_id) {
    return new Promise((resolve, reject) =>{
        db.pool.query(`insert into reactions (user_id, post_id) values (?,?) `
        , [user_id, post_id], 
         function(error, results) {
            console.log(error)
           console.log(results)
           if (error) {                    
             return reject(new BaseError("DB Error", 500, error));
           }
           else {               
            return resolve(results);
                    
           }
         })})
}

function deleteReaction(post_id, user_id) {
    return new Promise((resolve, reject) =>{
        db.pool.query(`delete from reactions where user_id=? and post_id=?`
        , [user_id, post_id], 
         function(error, results) {
            console.log(error)
           console.log(results)
           if (error) {                    
             return reject(new BaseError("DB Error", 500, error));
           }
           else {               
            return resolve(results);
                    
           }
         })})
}
function updateLikes(post_id) {

    return new Promise((resolve, reject) =>{
        db.pool.query(`update posts set post_likes_score = (select count(*) from reactions where post_id=?) where post_id=?`
        , [post_id, post_id], 
         function(error, results) {
            console.log(error)
           console.log(results)
           if (error) {                    
             return reject(new BaseError("DB Error", 500, error));
           }
           else {   
            console.log('results from updateLikes:',results)            
            return resolve(results);
                    
           }
         })})
}
module.exports = {dispatchReaction} 