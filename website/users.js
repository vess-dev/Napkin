import {Helpers} from './helpers.js';
import {ClientError} from './ClientError.js';
import {SERVER, LOGIN_PAGE, ADD_USER_PAGE, LIST_USERS_PAGE} from './routes-client.js';

export var Users = {
	USER:'user',

	/**
	 * Given the required info for a user account, request to create user is made
	 * If user is successfully added, a uuid of the new user is returned
	 */ 
	addUser:function(user_first_name, user_last_name, user_email, user_password, user_handle, user_status) {
		
	  const user = {
		'user_first_name': user_first_name, 
		'user_password': user_password, 
		'user_email': user_email,
		'user_last_name': user_last_name, 
		'user_handle': user_handle, 
		'user_status': user_status || 'approved'
	  };

	  let options = {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(user)
	  };

	  let localResponse = null;

	  return new Promise((resolve, reject) => {
	  	fetch(SERVER + this.USER, options)
	  	.then(response => {
	  		localResponse = response;
	  		return response.json();
	  	})
	  	.then((body) => {	  		
	  		if (localResponse.ok) {
	  			return resolve(body);	    
	  		}
	  		else {	    		
	    		return reject(new ClientError("User Error", null, "Unable to create user: "+ body.error));
	    	}	    	  	
	  	})
	  	.catch((error) => {
	  		return reject(error);
	  	});
	  });
	  
	},
	/**
	 * 
	 */ 
	handleAddUserClick:function(event) {
		const user_first_name = document.querySelector('#user_first_name').value;
		const user_last_name = document.querySelector('#user_last_name').value;
		const user_email = document.querySelector('#user_email').value;		
		const user_password = document.querySelector('#user_password').value;	
		const user_handle = document.querySelector('#user_handle').value;	
		
		Users.addUser(user_first_name, user_last_name, user_email, user_password, user_handle, 'pending').then(()=>{
			// If successful, tell user and return them to login page to log in
			Helpers.showNotification('User successfully added');
			window.dispatchEvent(new CustomEvent("navigate", {detail: {page: LOGIN_PAGE}, bubbles: true}));		
		})
		.catch(error => {
			// If not successful, tell user why
			Helpers.showNotification(error.message, Helpers.ERROR);
		});
		
	},

	/**
	 *  Loads the Add User Page
	 */ 
	 loadAddUserPage:function() {
		const contentDOM = document.querySelector('#content');

		const addUserForm = document.createElement('div');
		// user_first_name, user_last_name, user_email, user_password, user_handle
		addUserForm.appendChild(Helpers.createField('First Name', 'user_first_name'));
		addUserForm.appendChild(Helpers.createField('Last Name', 'user_last_name'));
		addUserForm.appendChild(Helpers.createField('Email', 'user_email'));
		addUserForm.appendChild(Helpers.createField('Handle', 'user_handle'));
		addUserForm.appendChild(Helpers.createField('Password', 'user_password'));
		addUserForm.appendChild(Helpers.createField('Confirm Password', 'confirmpass'));
		
		// Submit Button
		const submitButton = document.createElement('button');
		submitButton.setAttribute('id', 'submit_button');
		submitButton.textContent = 'Submit';
		submitButton.addEventListener('click', this.handleAddUserClick);
		addUserForm.appendChild(submitButton);

		// Cancel Button
		const cancelButton = document.createElement('button');	
		cancelButton.textContent = 'Cancel';
		cancelButton.addEventListener('click', (event) => {
			cancelButton.dispatchEvent(new CustomEvent("navigate", {detail: {page: LOGIN_PAGE}, bubbles: true}));
		});
		addUserForm.appendChild(cancelButton);

		contentDOM.appendChild(addUserForm);
	},

	/**
	 * 
	 */ 
	getUsers:function() {
		return new Promise((resolve, reject) => {
			let options = {
		    	method: 'GET',
		    	credentials: 'include',
		    	headers: {
		      	'Content-Type': 'application/json'
		      }
		    };
		 
			fetch(SERVER + this.USER, options)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				else {				
					throw new ClientError("User Error", response.status,"Unable to retrieve users");
				}
			})
		  	.then((userList) => {	  		
		  	 	return resolve(userList)
		  	})
			.catch((error) => {			
		    	return reject(error);
			});
		});
	},

	/**
	 * 
	 */ 
	loadListUsersPage:function() {
		const contentDOM = document.querySelector('#content');

		// Get user list	
		Users.getUsers()
		.then(userList => {
			const rowContainerElement = document.createElement('div');
			rowContainerElement.setAttribute('id', 'user_list');
			const tableHeaderElement = document.createElement('h2');
			tableHeaderElement.textContent = 'Users';
			rowContainerElement.appendChild(tableHeaderElement);
			// Display users in a table		
		    for (const user of userList) {
		    	const rowElement = document.createElement('div');
		    	rowElement.textContent = user.username + " : " + user.Sessions;
		    	rowContainerElement.appendChild(rowElement);
	    	}
	    	contentDOM.appendChild(rowContainerElement); 
		})
		.catch(error => {
			console.error(error.statusCode + " : " + error.message);
			// Unauthorized, so kick user back to login page
			if (error.statusCode && error.statusCode === 401) {
				window.dispatchEvent(new CustomEvent("navigate", {detail: {page: LOGIN_PAGE}, bubbles: true}));				
				//Helpers.showNotification(error.message);							
				Helpers.showNotification("User not authorized to perform that action");
			}
			else {		
				Helpers.showNotification(error.message);							
			}
		});
	}

}


