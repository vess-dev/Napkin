const http = require('http');
const querystring = require('querystring');
const url = require('url');

const auth = require('./auth.js');
const db = require('./dbi.js');
const user = require('./user.js');
const routes = require('./routes');
const BaseError = require('./BaseError.js');


const port = 3000 || process.argv[2];

const server = http.createServer();


server.on('request', handleHTTPRequests);


/**
 *  Router function - handles incoming requests and routes to correct function
 */ 
function handleHTTPRequests(request, response) {

  console.log('Method: ' + request.method + "\nURL: " + request.url);
  console.log('Headers: ' + request.headers.cookie);
  // Setup CORS
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('content-type', 'application/json');  
  const method = request.method;
  const parsedURL = url.parse(request.url);
  let parsedRequestBody = "";
  let userId = null;

  let data = '';
  request.on('data', chunk => {
    data += chunk;
  });
  request.on('end', () => {
    if (data) { 
      parsedRequestBody = JSON.parse(data);
    }

    const sessionid = auth.extractCookie('sessionid', request.headers.cookie);      
    auth.validateSession(sessionid, parsedURL.pathname, method).then(userID=>{
        routeRequests(parsedURL, method, parsedRequestBody, response, userID);  
      })
    .catch(error=>{
      handleErrorReply(response, error, 401, "Please login to view this page");
    });              
  });
}


/**
 * 
 */   
function routeRequests(url, method, bodyObject, response, userID) {
  let routeFound = false;
  
  try {
    // OPTIONS handling
    if (method === 'OPTIONS') {
        routeFound = true; 
        response.statusCode = 200;
        response.end();       
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
      // Get list of all users
      if (method === 'GET') {
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
    }

    // AUTH routes
    if (!routeFound && url.pathname === routes.LOGIN) {
      routeFound = true;
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
        response.write('{"message": "User has successfully been logged out"');
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
  // Remove expired sessions every 10 minutes
  setTimeout(auth.expireSessions, 10000);
})