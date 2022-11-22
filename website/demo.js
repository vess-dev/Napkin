"use strict";

import {Helpers} from './helpers.js';
import {setCookie, getCookie} from './cookies.js';
import {ClientError} from './ClientError.js';
import {Users} from './users.js';
import {Posts} from './posts.js';
import {SERVER, HOME_PAGE, LOGIN_PAGE, ADD_USER_PAGE, LIST_USERS_PAGE, GET_POSTS_PAGE} from './routes-client.js';


const AUTH = 'login';
const LOGOUT = 'logout';

var sessionId = null;

onPageLoad();

/**
 * 
 */ 
function onPageLoad() {
	routePage();
	setupEventListeners();	
}

/**
 *  Setup all initial listeners
 */ 
function setupEventListeners() {
	// Close listener on notification X
	const closeIconElement = document.querySelector('#close_notification_icon');
	closeIconElement.addEventListener('click', ()=> {
		Helpers.hideNotification();
	});

	// Set up click events for hamburger menu
	const menuIconElement = document.querySelector('#menu_icon');
	menuIconElement.addEventListener('click', Helpers.toggleMenu);
	const menuElement = document.querySelector('#menu');
	menuElement.addEventListener('click', handleMenuClick);

	// List for page navigation events and call routing function when they happen
	addEventListener('popstate', (event) => {
		routePage();
	});

	// Listen for all naviation events and pass along to routing function
	addEventListener('navigate', (event) => {
		routePage(event.detail.page);
	});

}

/**
 * If given a page anchor, will load the appropriate page
 * If not passed anything, will look at current URL anchor and load that page
 */ 
function routePage(newPage) {
	const currentHash = (newPage ? newPage : window.location.hash);
	
	if (newPage) {
		history.pushState({}, "", newPage);
	}

	// Clear content 
	const contentDOM = document.querySelector('#content');
	contentDOM.textContent = "";
	
	switch(currentHash) {
		case HOME_PAGE:
			loadHomePage();
			break;
		case ADD_USER_PAGE:
			Users.loadAddUserPage();
			break;
		case LIST_USERS_PAGE:
			Users.loadListUsersPage();
			break;	
		case GET_POSTS_PAGE:
			console.log('asked for post page')
			post.get_posts_page()			
		default:
			loadLoginPage();	
	}	
}

/**
 *  Loads the Login Page
 */ 
function loadLoginPage() {
	const contentDOM = document.querySelector('#content');

	const loginForm = document.createElement('div');
	loginForm.appendChild(Helpers.createField('Username', 'username'));
	loginForm.appendChild(Helpers.createField('Password', 'password'));

	// Login Button
	const loginButton = document.createElement('button');
	loginButton.setAttribute('id', 'login_button');
	loginButton.textContent = 'Login';
	loginButton.addEventListener('click', handleLoginButtonClick);
	loginForm.appendChild(loginButton);

	// Add User Button
	const addUserButton = document.createElement('button');
	addUserButton.setAttribute('id', 'adduser_button');
	addUserButton.textContent = 'Add User';
	addUserButton.addEventListener('click', ()=>{
		addUserButton.dispatchEvent(new CustomEvent("navigate", {detail: {page: ADD_USER_PAGE}, bubbles: true}));
	});
	loginForm.appendChild(addUserButton);

	contentDOM.appendChild(loginForm);
}


/**
 * 
 */
async function handleLoginButtonClick(event) {
	const username = document.querySelector('#username').value;
	const password = document.querySelector('#password').value;	
 	const authRequest = {
    	'username': username,    
    	'password': password
  	};

	let options = {
    	method: 'POST',
    	headers: {
      		'Content-Type': 'application/json'
    	},
    	body: JSON.stringify(authRequest)
  	};

  	const response = await fetch(SERVER + AUTH, options);
  	
  	if (response.ok) {
    	const body = await response.json();    	    	
    	sessionId = body.sessionid;
    	setCookie('sessionid', sessionId, 7);
    	// Go to user list page    	
    	window.dispatchEvent(new CustomEvent("navigate", {detail: {page: HOME_PAGE}, bubbles: true}));  
  	}
  	else {
    	let body = await response.json();
    	Helpers.showNotification("Unable to login: " + body.error, Helpers.ERROR);    	
  	}	
}

/**
 * 
 */ 
function loadHomePage() {
	const contentDOM = document.querySelector('#content');

	const welcomeElement = document.createElement('h1');
	welcomeElement.textContent = "Welcome to Your Home Page";
	contentDOM.appendChild(welcomeElement);
}


/**
 *  Sends logout request to server
 *  Then navigates to login page
 *  Notifies user of successful logout
 */ 
async function handleLogout() {
		
	let options = {
    	method: 'POST',
    	credentials: 'include',
    	headers: {
      	'Content-Type': 'application/json'
      }
    };
 
 	const response = await fetch(SERVER + LOGOUT, options);

 	// Regardless of what comes back, we are kicking user out to login page and telling them it was successful
	window.dispatchEvent(new CustomEvent("navigate", {detail: {page: LOGIN_PAGE}, bubbles: true}));  
	Helpers.showNotification("You have been succesfully logged out");		
}

/**
 *  Handles all clicks from the hamburger menu
 */ 
function handleMenuClick(event) {
	Helpers.toggleMenu();
	const targetID = event.target.id;

	switch(targetID) {
		case 'home_link':
			window.dispatchEvent(new CustomEvent("navigate", {detail: {page: HOME_PAGE}, bubbles: true}));  
			break;
		case 'listuser_link':
			window.dispatchEvent(new CustomEvent("navigate", {detail: {page: LIST_USERS_PAGE}, bubbles: true}));  
			break;
		case 'logout_link':
			handleLogout();
			break;		
		case 'getposts_link':
			window.dispatchEvent(new CustomEvent("navigate", {detail: {page: GET_POSTS_PAGE}, bubbles: true}));  
			break;
	}
	
}


