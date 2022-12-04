import * as help from "./helpers.js";
import * as phelp from "./pageshelpers.js";
import * as route from "./routes.js";

// Query the user for an image choice. This is hackish.
export function queryImage() {
	const elementInput = document.createElement("input");
	elementInput.setAttribute("type", "file");
	elementInput.setAttribute("accept", "image/*");
	elementInput.click();
	elementInput.onchange = e => {
		const elementImage = document.getElementById("post_image");
		elementImage.setAttribute("payload", elementInput.value);
	}
}

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
				phelp.insertPost(help.loadPostImage(post.user_image), post.post_title, post.user_handle, post.post_timestamp, post.post_content, help.loadPostImage(post.post_image), post.post_likes_score, post.post_comment_count);
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
	let post_image = document.querySelector("#post_image").payload;

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
			routePage("#myFeed")
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
	
};

// Send a user create to the server. 
export function userCreateAction() {
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
