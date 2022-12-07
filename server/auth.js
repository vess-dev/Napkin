const bcrypt = require('bcrypt');
const crypto = require('crypto');

const db = require('./dbi.js');
const routes = require('./routes');
const BaseError = require('./BaseError.js');

const test = require('./test.js');

/**
 * Given a username and password, returns a sessionid if the hashed password
 *  matches the hashed password associated with that user in the DB
 * Returns error if user not present, or password hashes do not match
 */ 
function handleLoginAttempt (givenUser) {
  console.log('Handling login attempt for ' + givenUser);
  let userObj = null;
  return new Promise((resolve, reject)=>{
    getHashforAuth(givenUser.user_email)
    .then(dbObj=>{
    	userObj = dbObj;
      // Compare hash to entered password 
      console.log('got userObj, admin_flag is', userObj['admin_flag'])  
      console.log('given, dbobj', givenUser.password, dbObj.user_password)   
      if (userObj["user_status"] === "pending") {
        return reject(new BaseError('User is pending', 401, 'User account is pending'));
      } else if (userObj["user_status"] === "blocked") {
        return reject(new BaseError('User is blocked', 402, 'User account is blocked'));
      }
      return bcrypt.compare(givenUser.password, dbObj.user_password);
  	})
    .then((result)=> {        
        // password is valid
        if (result) {
          console.log('Passwords match!');
          return resolve(userObj);
        }
        // password is invalid
        else {          
          return reject(new BaseError('Incorrect Password', 400, 'Passwords do not match'));
        }
    })
    .catch(error=>{  
    	if (error instanceof BaseError) {
    		return reject(error);	
    	}
    	else {
    		return reject(new BaseError("Login Failure", 500, error));
    	}          
    })
	});
}

/**
 * Given a username, returns the password hash associated with that user
 * Returns an error if username not present
 */ 
function getHashforAuth(user_email) {
  console.log('getHashforAuth called with', user_email)
    return new Promise((resolve, reject)=>{
    // Fetch hash from db for username  
    console.log('got user_email is', user_email)  
    db.pool.query(`SELECT user_id, user_password, admin_flag, user_status from users WHERE user_email = '${user_email}'`,      
      function(error, results, fields) {
        console.log(error, results)
        if (error) {                            
          return reject(new BaseError('DB Error', 500, error));
        }
        else {
          if (results.length === 0) {                          
            return reject(new BaseError("Missing User", 400, "User does not exist in database"));            
          }
          else { 
            console.log('will return', results[0])                       
            return resolve(results[0]);
          }
        }
      });
  });
}


/**
 *  Given a session id, make sure it's present
 *  If it is present, return user id
 */ 
function validateSession(session_id, pathname, method) {
  return new Promise((resolve, reject) => {
    console.log('validate session called:', session_id, pathname, method)
    // Resolve for requests that don't need to be authenticated
    if (((pathname === routes.USER) && (method === 'POST')) || 
      (pathname === routes.LOGIN) ||
      (method === 'OPTIONS')) {
      return resolve(null);
    }

    console.log(`query: SELECT user_id from sessions WHERE session_id = '${session_id}'`);
    db.pool.query(`SELECT user_id from sessions WHERE session_id = '${session_id}'`,      
      function(error, results, fields) {        
        if (error) {                            
          return reject(new BaseError("DB Error", 500, error));
        }
        else {
          if (results.length === 0) {                                                       
            return reject(new BaseError('Missing session', 401, 'User not authorized to perform that action'));            
          }
          else {                        
            return resolve(results[0].user_id);
          }
        }
      });
  });
}

/**
 *  Given a user id, generates a new session id and writes to DB
 *  Sets a expiration on the session id for +1 hour
 */ 
function generateSessionId(userObject) {
  return new Promise((resolve, reject)=>{
    // Generate session id
    const sessionid = crypto.randomUUID();
    console.log("Generating Session ID");
    // Write userid, sessionid to DB
    let expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + 1);
    db.pool.query('INSERT INTO sessions SET ?', 
      {user_id: userObject.user_id, session_id: sessionid, 
        
    },
    // maxage: expireTime.toISOString().slice(0, 19).replace('T', ' ')
      function(error, results) {
        if (error) {                    
          return reject(new BaseError("DB Error", 500, error));
        }
        else {
          return resolve(sessionid);
        } 
    });
  });
}

/**
 *  Given a user id, removes ANY sessions with that user id
 *  So, this will log this user out anywhere they are logged in
 */ 
function handleLogout(user_id) {
	return new Promise((resolve, reject) => {
		db.pool.query(`DELETE from sessions WHERE user_id = ?`, {user_id},
	      function(error, results, fields) {        
	        if (error) { 
	        	console.log('logout error code: ' + error.code);   
	        	
	        	return reject(new BaseError("Logout Error", 500, error));
	        }
	        else {
	        	return resolve(user_id);
	        }
	  	});
	});
}

/**
 * 
 */ 
function extractCookie(cname, cookies) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(cookies);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 *  Called to periodically remove expired sessions
 */ 
function expireSessions() {
	db.pool.query(`DELETE from sessions WHERE maxage <= now()`,
      function(error, results, fields) {        
        if (error) {    
        	console.error('Error removing sessions: ' + error);
        }
        else {        	
        	if (results) {
        		console.log('Removed ' + results.affectedRows + ' sessions due to expiration');
        	}
        }        
  });
}


module.exports = {handleLoginAttempt, handleLogout, getHashforAuth, validateSession, generateSessionId, extractCookie, expireSessions};