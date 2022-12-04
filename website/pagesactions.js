import * as route from "./routes.js";

// Send a post create to the server.
function postCreateAction() {
	let post_title = document.querySelector("#post_title").value;
	let post_content = document.querySelector("#post_content").value;
	let post_image = document.querySelector("#post_image").value;
	let selected  = document.querySelectorAll("#group_selector option:checked");
	console.log("have ",post_title, post_content, post_image)
	let group_ids = Array.from(selected).map(el => el.value);
	let groupList 
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
				throw new Error("error", response)
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
function userCreateAction() {
	let user_first_name = document.querySelector("#firstname").value;
	let user_last_name = document.querySelector("#lastname").value;
	let user_handle = document.querySelector("#screenname").value;
	let user_email = document.querySelector("#email").value;
	let user_password = document.querySelector("#password").value;
	let user_confirm = document.querySelector("#confirm").value;
	
	// TODO: client side error checking for password and confirm not matching. (Do you have an error popup, Vess?) (V: Not yet, we need one.)

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
				throw new Error("error", response)
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
function userLoginAction () {
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
				throw new Error("error", response)
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
function userLogoutAction() {
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
				throw new Error("error", response)
			}
		})
		.then(json=> resolve(json))
		.catch((error) => {
			return reject(error);
		});
	});
}