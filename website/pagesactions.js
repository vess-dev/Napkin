import * as help from "./helpers.js";
import * as phelp from "./pageshelpers.js";
import * as route from "./routes.js";
import {setCookie} from "./cookies.js";

// Query the user for an image choice. This is hackish.
/*export function queryImage() {
	const elementInput = document.createElement("input");
	elementInput.setAttribute("type", "file");
	elementInput.setAttribute("accept", "image/*");
	elementInput.click();
	elementInput.onchange = e => {
		const elementImage = document.getElementById("post_image");
		elementImage.setAttribute("payload", elementInput.value);
	}
} */

export function createCloudinaryWidget () {
var myWidget = cloudinary.createUploadWidget({
	cloudName: 'dkz6vktw0', 
	uploadPreset: 'wnlaqufk'}, (error, result) => { 
	  if (!error && result && result.event === "success") { 
		console.log('Done! Here is the image info: ', result.info.public_id); 
		let fieldTarget=document.querySelector('#post_image_url')
		fieldTarget.value = 'https://res.cloudinary.com/dkz6vktw0/image/upload/ar_1:1,c_fill,g_faces,h_300,r_8,w_300/' + result.info.public_id
	  }
	}
  )
  
  document.getElementById("upload_widget").addEventListener("click", function(){
	  myWidget.open();
	}, false);
}

/* 
export function uploadImage() {
	const elementInput = document.createElement("input");
	elementInput.setAttribute("type", "file");
	elementInput.setAttribute("accept", "image/*");
	elementInput.click();
	elementInput.onchange = e => {
		const elementImage = document.getElementById("post_image");
		elementImage.setAttribute("payload", elementInput.value);
		uploadImageAction(elementInput.files[0])
	}
}

export function uploadImageAction(imagefile) {

	let options = {
		method: "POST",
		credentials: "include",
		headers: {"content-type": "image/png"},
		body: imagefile
	}

	fetch(route.SERVER + "upload", options).then((response) =>
	{
		console.log('response was: ',response)
		console.log('options was', options)
		console.log('fetch finished - check your logs!')
	}
	) 
}
*/ 

export function processLikeClick(postID) {
	console.log('like clicked for postID', postID)
}

// Fill the feed with non-user made posts, or user made posts.
export function feedFill(postType) {
	let endpoint;
	if (postType) {
		// True means the individual user's posts.
		endpoint = "myposts";
	} else {
		// False means the "global" feed.
		endpoint = "post";
	}
	return new Promise((resolve, reject) => {
		let options = {
			method: "GET",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"}
		};
		fetch(route.SERVER + endpoint, options)
		.then((response) => {
			if (response.statusCode == 401) { routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Unable to retrieve posts");
			}
		})
		.then((postsList) => {
			for (let post of postsList) {
				phelp.insertPost(help.loadPostImage(post.user_image), post.post_title, post.user_handle, 
				new Date(post.post_timestamp).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}), post.post_content, help.loadPostImage(post.post_image), post.post_likes_score, post.post_comment_count, post.post_id);
				phelp.insertPostActions(post.post_id)
				phelp.insertBigBreak();
			}
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
}

// Send a post create to the server.
export async function postCreateAction() {
	let post_title = document.querySelector("#post_title").value;
	let post_content = document.querySelector("#post_content").value;
	let post_image = document.querySelector("#post_image_url").value;

	let selected  = document.querySelectorAll("#group_selector option:checked");
	console.log("have ",post_title, post_content, post_image)
	let group_ids = Array.from(selected).map(el => el.value);
	let groupList =""
	for (let one of group_ids) {groupList += one + ","}
	console.log("have groupList", groupList)

	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify({
				post_title: post_title,
				post_content: post_content,
				post_image, post_image,
				group_id: groupList
			  })
		};
		fetch(route.SERVER + "post", options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Unable to create post.");
			}
		})
		.then(() => {
			routePage("#feedMy")
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
	
};

// Send a user create to the server. 
export function userCreateAction() {
	console.log('userCreateAction called')
	let user_first_name = document.querySelector("#firstname").value;
	let user_last_name = document.querySelector("#lastname").value;
	let user_handle = document.querySelector("#screenname").value;
	let user_email = document.querySelector("#email").value;
	let user_password = document.querySelector("#password").value;
	let user_confirm = document.querySelector("#confirm").value;
	
	// TODO: client side error checking for password and confirm not matching. (Do you have an error popup, Vess?) (V: Use help.woops(<text>) for now.)

	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify({
				user_first_name: user_first_name,
				user_last_name: user_last_name,
				user_handle: user_handle,
				user_email: user_email,
				user_password: user_password
			})
		};
		fetch(route.SERVER + "user", options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Unable to create user.");
			}
		})
		.then(() => {
			routePage("#accLogin");
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
};

// Send a user login to the server. 
export function userLoginAction () {
	let user_email = document.querySelector("#email").value;
	let password = document.querySelector("#password").value;
	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify({
				user_email: user_email,
				password: password
			})
		};
		fetch(route.SERVER + "login", options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Unable to login user.");
			}
		})
		.then((json) => {      
			let sessionid = json.sessionid;
			setCookie("sessionid", sessionid, 7);   
			routePage("#feedGlobal")
			return resolve("login successful")
		})
		.catch((error) => {
			return reject(error);
		});
	});
};

// Send a user logout to the server. 
export function userLogoutAction() {
	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
		};
		fetch(route.SERVER + "logout", options)
		.then((response) => {
			if (response.ok) {
				routePage("#accLogin")
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Unable to logout user.");
			}
		})
		.then(json=> resolve(json))
		.catch((error) => {
			return reject(error);
		});
	});
}
export async function getFriends(friend_status) {
	let endpoint
	if (friend_status) {
		endpoint="friend?status_wanted="+friend_status
	} else { 
		endpoint="friend"
	}
	return new Promise((resolve, reject) => {
		let options = {
			method: "GET",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"}
		};
		fetch(route.SERVER + endpoint, options)
		.then((response) => {
			if (response.statusCode == 401) { routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Unable to retrieve friends");
			}
		})
		.then((friendsList) => {
			for (let friend of friendsList) {
				phelp.insertFriendItem(help.loadPostImage(friend.user_image), friend.user_handle, friend_status, friend.friend_id);
			}
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
}
export function friendSearchAction () {
	let searchString=document.querySelector('#screenname').value

	let endpoint = 'user'
	if (searchString) { endpoint= `user?search=` + encodeURIComponent(searchString) }

	return new Promise((resolve, reject) => {
		let options = {
			method: "GET",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"}
		};
		fetch(route.SERVER + endpoint, options)
		.then((response) => {
			if (response.statusCode == 401) { routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Unable to retrieve friends");
			}
		})
		.then((friendsList) => {
			for (let friend of friendsList) {
				phelp.insertFriendItem(help.loadPostImage(friend.user_image), friend.user_handle, 'search', friend.user_id);
			}
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
};

export function makeFriendRequest(friend_id) {
	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify({
				friend_id: friend_id
			  })
		};
		fetch(route.SERVER + "friend", options)
		.then((response) => {
			if (response.ok) {
				routePage("#accFriends")
				return response.json();
			}
			else {
				throw new help.clientError("Server Error", response.status, "Problem requesting a friend.");
			}
		})
		.then(json=> resolve(json))
		.catch((error) => {
			return reject(error);
		});
	});
}

