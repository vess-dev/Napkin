const http = require('http');
const querystring = require('querystring');
const fs = require('fs');

const url = require('url');

const auth = require('./auth.js');
const db = require('./dbi.js');
const user = require('./user.js');
const routes = require('./routes');
const BaseError = require('./BaseError.js');
const post = require('./post.js')
const groupmembers = require('./groupmembers.js')
const group = require('./group.js')
const friend = require('./friendship.js')
const comment = require('./comments.js')
const admin = require('./admin.js');

const port = 3009 || process.argv[2];

const server = http.createServer();


server.on('request', handleHTTPRequests);


/**
 *  Router function - handles incoming requests and routes to correct function
 */ 
function handleHTTPRequests(request, response) {

  console.log('Method: ' + request.method + "\nURL: " + request.url);
  console.log('Headers: ' + request.headers.cookie);

  // Setup CORS
  response.setHeader('Access-Control-Allow-Origin', 'http://cpsc.roanoke.edu');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('content-type', 'application/json');  
  const method = request.method;
  const parsedURL = url.parse(request.url);
  console.log('parsedURL is',parsedURL)
  let URLquery = parsedURL.query
  let queryObject = querystring.parse(URLquery)
  console.log('queryObject:', queryObject)

  let parsedRequestBody = "";
  let userId = null;




//

  let data = '';
  request.on('data', chunk => {
    data += chunk;
  });
  request.on('end', () => {
    if (data) { 
      if (parsedURL.pathname !='/upload'){
        parsedRequestBody = JSON.parse(data);
      } else {console.log('this is an upload, so do not parse the data this way')}
    } 

    const sessionid = auth.extractCookie('sessionid', request.headers.cookie);   
    //console.log('sessionid is ', sessionid)   
    auth.validateSession(sessionid, parsedURL.pathname, method).then(userID=>{
        routeRequests(parsedURL, method, parsedRequestBody, response, userID, queryObject, request.headers);  
      })
    .catch(error=>{
      handleErrorReply(response, error, 401, "Please login to view this page");
    });              
  });
}


/**
 * 
 */   
function routeRequests(url, method, bodyObject, response, userID, queryObject, inbound_file_data) {
  let routeFound = false;
  console.log('urlpathname is', url.pathname)
  try {
    // OPTIONS handling
    if (method === 'OPTIONS') {
        routeFound = true; 
        response.statusCode = 200;
        response.end();       
    }
    if (url.pathname === routes.USERPASSWD) {
      if (method === 'POST') {
        routeFound = true;
        user.changeUserPassword(bodyObject.newpassword, userID).then(reply=>{
          response.statusCode = 200;
          response.write('{"success":"Password change result:' + reply + '"}');          
        })
        .catch(error=>{
          handleErrorReply(response, error, 400);
        })
        .finally(() => {
          response.end();
        });
      }
    }
    // USER routes
    if (url.pathname === routes.USER) {
      // Creating a new user
      if (method === 'POST') {
        routeFound = true;
        user.addNewUser(bodyObject).then(reply=>{
          response.statusCode = 200;
          response.write('{"success":"New user addded with id ' + reply + '"}');          
        })
        .catch(error=>{
          handleErrorReply(response, error, 400);
        })
        .finally(() => {
          response.end();
        });
      }
      if (method === 'PUT') {
        routeFound = true;
        user.updateUser(bodyObject, userID).then(reply=>{
          response.statusCode = 200;
          response.write('{"success":"User updated for user' + reply + '"}');          
        })
        .catch(error=>{
          handleErrorReply(response, error, 400);
        })
        .finally(() => {
          response.end();
        });
      }
      // Get list of all users
      if (method === 'GET' && (!queryObject || !queryObject.search)) {
        routeFound = true;
        // Get list of users
        user.getUserList().then(list=>{
          response.statusCode = 200;
          response.write(JSON.stringify(list));
        })
        .catch(error=>{
          handleErrorReply(response, error);
        })
        .finally(() => {
          response.end(); 
        });
      }
      else if (method === 'GET' && queryObject && queryObject.search) {
        routeFound = true;
        // Get list of users
        user.searchUsers(queryObject.search).then(list=>{
          response.statusCode = 200;
          response.write(JSON.stringify(list));
        })
        .catch(error=>{
          handleErrorReply(response, error);
        })
        .finally(() => {
          response.end(); 
        });
      }
    } 
    // POST routes
    if (url.pathname === routes.POST) {
      console.log('will serve posts stuff')

      // Creating a new POST
      if (method === 'POST') {
        routeFound = true;
        post.createPost(bodyObject, userID).then(reply=>{
          response.statusCode = 200;
          response.write('{"success":"New post added with ID ' + reply + '"}');          
        })
        .catch(error=>{
          handleErrorReply(response, error, 400);
        })
        .finally(() => {
          response.end();
        });
      }
      if (method === 'PUT') {
        routeFound = true;
        post.editPost(bodyObject, userID).then(reply=>{
          response.statusCode = 200;
          response.write('{"success":"Edited post with ID ' + reply + '"}');          
        })
        .catch(error=>{
          handleErrorReply(response, error, 400);
        })
        .finally(() => {
          response.end();
        });
      }
      // Get list of all posts
      if (method === 'GET') {
        console.log('will get posts feed')
        routeFound = true;
        // Get list of posts
        post.getPostList(userID).then(list=>{
          response.statusCode = 200;
          response.write(JSON.stringify(list));
        })
        .catch(error=>{
          handleErrorReply(response, error);
        })
        .finally(() => {
          response.end(); 
        });
      }
    }
// MYPOST routes
    if (url.pathname === routes.MYPOSTS) {
       // Get list of all posts
      if (method === 'GET') {
        console.log('will get own posts')
        routeFound = true;
        // Get list of posts
        post.getMyPostList(userID).then(list=>{
          response.statusCode = 200;
          response.write(JSON.stringify(list));
        })
        .catch(error=>{
          handleErrorReply(response, error);
        })
        .finally(() => {
          response.end(); 
        });
      }  
    }
    //GROUPMEMBERS routes
    if (url.pathname === routes.GROUPMEMBERS) {
      console.log('will serve groupmembers stuff')

      // Get list of all members of a group
      if (method === 'GET') {
        routeFound = true;
        groupmembers.getGroupMembersList(queryObject.group_id, userID).then(list=>{
          response.statusCode = 200;
          response.write(JSON.stringify(list));
        })
        .catch(error=>{
          handleErrorReply(response, error);
        })
        .finally(() => {
          response.end(); 
        });
      }
      if (method === 'DELETE') {
        routeFound = true;
        
        groupmembers.deleteGroupMember(queryObject.group_id, queryObject.friend_id, userID).then(list=>{
          response.statusCode = 200;
          response.write(JSON.stringify(list));
        })
        .catch(error=>{
          console.log('caught an error', error)
          handleErrorReply(response, error);
        })
        .finally(() => {
          response.end(); 
        });
      }
        // add a member to a group
        if (method === 'POST') {
          routeFound = true;

          groupmembers.addGroupMember(bodyObject.group_id, bodyObject.friend_id, userID).then(list=>{
            response.statusCode = 200;
            response.write(JSON.stringify(list));
          })
          .catch(error=>{
            console.log('caught an error', error)
            handleErrorReply(response, error);
          })
          .finally(() => {
            response.end(); 
          });
        }
    }
 //GROUP routes
        if (url.pathname === routes.GROUP) {
          console.log('will serve groups stuff')
    
          // Creating a new group
          if (method === 'POST') {
            console.log('method is post for groups')
            routeFound = true;
            bodyObject.owner_id = userID
            group.addNewGroup(bodyObject).then(reply=>{
              response.statusCode = 200;
              response.write('{"success":"New group added with ID ' + reply + '"}');          
            })
            .catch(error=>{
              handleErrorReply(response, error, 400);
            })
            .finally(() => {
              response.end();
            });
          } 
          // Get list of all groupss
          else if (method === 'GET') {
            routeFound = true;
            // Get list of groups
            group.getGroupList(userID).then(list=>{
              response.statusCode = 200;
              response.write(JSON.stringify(list));
            })
            .catch(error=>{
              console.log('caught an error', error)
              handleErrorReply(response, error);
            })
            .finally(() => {
              response.end(); 
            });
          }
          else if (method === 'PUT') {
              routeFound = true;
              group.updateGroup(bodyObject, userID).then(reply=>{
              response.statusCode = 200;
              response.write('{"success":"Group updated"}');          
            })
            .catch(error=>{
              handleErrorReply(response, error, 400);
            })
            .finally(() => {
              response.end();
            });
          }
        }
  //friend routes
      if (url.pathname === routes.FRIEND) {
        console.log('friends path', method)
        if (method === 'GET') {
          console.log('on friends route')
          routeFound = true;
          let statusWanted
          if (queryObject && queryObject.status_wanted) {
            statusWanted = queryObject.status_wanted}

          friend.getFriendList(userID,statusWanted).then(list=>{
            response.statusCode = 200;
            response.write(JSON.stringify(list));
          })
          .catch(error=>{
            console.log('caught an error ', error)
            handleErrorReply(response, error);
          })
          .finally(() => {
            response.end(); 
          });
        }

        if (method === 'POST') {
          console.log('friends post route:')
          routeFound = true;
          console.log('values', bodyObject.friend_id, userID)
          friend.makeFriendRequest(bodyObject.friend_id, userID).then(()=>{
            response.statusCode = 200;
            response.write(JSON.stringify({"success": "make a friend request"}));
          })
          .catch(error=>{
            console.log('caught an error ', error)
            handleErrorReply(response, error);
          })
          .finally(() => {
            response.end(); 
          });
        } 
        if (method === 'DELETE') {
          routeFound = true;
          friend.deleteFriendEntries(queryObject.friend_id, userID).then(()=>{
            response.statusCode = 200;
            response.write(JSON.stringify({"success": "deleted some friends entries"}));
          })
          .catch(error=>{
            console.log('caught an error ', error)
            handleErrorReply(response, error);
          })
          .finally(() => {
            response.end(); 
          });
        }
      };
  //REJECTFRIEND route
  if (url.pathname === routes.REJECTFRIEND) {

    if (method === 'POST') {
      routeFound = true;
      friend.rejectFriend(bodyObject.friend_id, userID).then(reply=>{
        response.statusCode = 200;
        response.write(JSON.stringify({"success": "blocked a friend request"}));          
      })
      .catch(error=>{
        handleErrorReply(response, error, 400);
      })
      .finally(() => {
        response.end();
      });
    }
  }


  //postgroup routes
    if (url.pathname === routes.POSTGROUP) {

      if (method === 'POST') {
        routeFound = true;
        post.putPostInGroup(userID, bodyObject.group_id, bodyObject.post_id).then(reply=>{
          response.statusCode = 200;
          response.write(JSON.stringify({"success": "post put in group"}));          
        })
        .catch(error=>{
          handleErrorReply(response, error, 400);
        })
        .finally(() => {
          response.end();
        });
      }
    
      if (method === 'DELETE') {
        routeFound = true;
        let group_id=queryObject.group_id
        let post_id = queryObject.post_id
        post.removePostFromGroup(userID, group_id, post_id).then(reply=>{
          response.statusCode = 200;
          response.write(JSON.stringify({"success": "post removed"}));          
        })
        .catch(error=>{
          handleErrorReply(response, error, 400);
        })
        .finally(() => {
          response.end();
        }); 
      }
      if (method === 'GET') {
        console.log('on postgroups route')
        routeFound = true;
        let post_id = queryObject.post_id
  
        post.getPostGroups(userID,post_id).then(list=>{
          response.statusCode = 200;
          response.write(JSON.stringify(list));
        })
        .catch(error=>{
          console.log('caught an error ', error)
          handleErrorReply(response, error);
        })
        .finally(() => {
          response.end(); 
        });
      }
      }
  //FRIENDGROUPS routes

   if (url.pathname === routes.FRIENDGROUPS) {
    console.log('friendgroups path', method)
    if (method === 'GET') {
      console.log('on friendgroups route')
      routeFound = true;
      let friend_id = queryObject.friend_id

      friend.getFriendGroups(userID,friend_id).then(list=>{
        response.statusCode = 200;
        response.write(JSON.stringify(list));
      })
      .catch(error=>{
        console.log('caught an error ', error)
        handleErrorReply(response, error);
      })
      .finally(() => {
        response.end(); 
      });
    }
    if (method === 'POST') {
      routeFound = true
      let friend_id = bodyObject.friend_id;
      let group_id = bodyObject.group_id
      console.log('will call editGroupMemberships for ', group_id, friend_id, userID)
      groupmembers.editGroupMemberships(group_id, friend_id, userID)
      .then(result => {
        response.statusCode = 200;
        
    }).catch(error =>{
      console.log('caught an error',error)
      handleErrorReply(response, error)
    })
    .finally(() => response.end() )
    }
  }
 //COMMENT routes
        if (url.pathname === routes.COMMENT) {
          console.log('will serve comment stuff')
    
          // Creating a new comment
          if (method === 'POST') {
            console.log('method is post for comment')
            routeFound = true;
            
            comment.addComment(bodyObject, userID).then(reply=>{
              response.statusCode = 200;
              response.write('{"success":"New comment added with ID ' + reply + '"}');          
            })
            .catch(error=>{
              handleErrorReply(response, error, 400);
            })
            .finally(() => {
              response.end();
            });
          } 
          if (method === 'GET' && queryObject && queryObject.post_id) {
            console.log('method is post for comment')
            routeFound = true;
            
            comment.getCommentsOnPost(queryObject.post_id)
            .then(list=>{
              response.statusCode = 200;
              response.write(JSON.stringify(list))})
            .catch(error=>{
              handleErrorReply(response, error, 400);
            })
            .finally(() => {
              response.end();
            });
          } 
        }

        if (url.pathname === routes.ADMINUSERS) {
          console.log('admin path', method)
          if (method === 'GET') {
            routeFound = true;
            let status = queryObject.status
      
            admin.getUsersForAdmin(queryObject.status, userID).then(list=>{
              response.statusCode = 200;
              response.write(JSON.stringify(list));
            })
            .catch(error=>{
              console.log('caught an error ', error)
              handleErrorReply(response, error);
            })
            .finally(() => {
              response.end(); 
            });
          }
        }

    // AUTH routes
    if (!routeFound && url.pathname === routes.LOGIN) {
      routeFound = true;
      console.log('auth route, bodyObject is', bodyObject)
      auth.handleLoginAttempt(bodyObject)
      .then(reply=>{
        return auth.generateSessionId(reply);
      })
      .then(reply=>{
        response.statusCode = 200;
        response.write(`{"sessionid": "${reply}"}`);        
      })
      .catch(error=>{
        handleErrorReply(response, error);
      })
      .finally(() => {
        response.end();
      });      
    }

    if (!routeFound && url.pathname === routes.LOGOUT) {
      routeFound = true;
      auth.handleLogout(userID)
      .then(reply=>{
        response.statusCode = 200;
        response.write('{"message": "User has successfully been logged out"}');
      })
      .catch(error=>{
        handleErrorReply(response, error);
      })
      .finally(() => {
        response.end();
      }); 
    }
  }
  catch(error) {
    handleErrorReply(response, error);
    response.end();
  }

  // Error case
  if (!routeFound) {
    handleErrorReply(response, null, 404, "Invalid pathname: " + url.pathname);
    response.end();
  } 
}

/**
 *  Helper function to deal with writing error messages back to client
 */ 
function handleErrorReply(response, errorObj, code, message) {

  if (errorObj && errorObj instanceof BaseError) {
    console.error("BaseError: " + errorObj.message);
    response.statusCode = errorObj.statusCode;
    response.write('{"error": "' + errorObj.name + ' : ' + errorObj.message + '"}');
  }
  else {
    console.error("Old error: " + message)
    response.statusCode = (code ? code : 400);
    response.write('{"error": ' + (message ? '"' + message + '"' : "There was an error") + '}');
  }
}


server.listen(port, () => {
  console.log(`Server running at port ${port}`);
  // Remove expired sessions every 16 minutes
  setInterval(auth.expireSessions, 1000000);
  // recalculate post weights: (each minute - which is silly)
  setInterval(post.updateAllPostWeights, 60000);
})
