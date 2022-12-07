import * as help from "./helpers.js";
import * as page from "./pages.js";
import * as phelp from "./pageshelpers.js";
import * as route from "./routes.js";
import * as test from "./testers.js";
import {setCookie} from "./cookies.js";

// Fill the URL path on the post page with the cloud upload URL.
export function createCloudinaryWidget() {
	var myWidget = cloudinary.createUploadWidget({
	cloudName: "dkz6vktw0", 
	uploadPreset: "wnlaqufk"}, (error, result) => { 
		if (!error && result && result.event === "success") { 
			console.log("Done! Here is the image info: ", result.info.public_id); 
			let fieldTarget = document.querySelector("#post_image_url");
			fieldTarget.value = "https://res.cloudinary.com/dkz6vktw0/image/upload/ar_1:1,c_fill,g_faces,h_300,r_8,w_300/" + result.info.public_id;
	  	}
	});
	document.getElementById("upload_widget").addEventListener("click", function() {
	  myWidget.open();
	}, false);
}

// For updating the account info.
export function updateAccount() {
	const elementPass = document.getElementById("password");
	const elementConfirm = document.getElementById("confirm");
	if (elementPass.value != elementConfirm.value) {
		help.woops("Passwords don't match.");
		return;
	}
	const user_first_name = document.getElementById("firstname").value
	const user_last_name = document.getElementById("lastname").value
	const user_email = document.getElementById("email").value
	const user_image_url = document.getElementById("post_image_url").value
	const user_handle = document.getElementById("handle").value

	return new Promise((resolve, reject) => {
		let options = {
			method: "PUT",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify({
				"user_first_name": user_first_name,
				"user_last_name": user_last_name,
				"user_handle": user_handle,
				"user_email": user_email,
				"user_image": user_image_url,
				"password_raw": elementPass.value
			})
		};
		fetch(route.SERVER + "user", options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				help.woops("Unable to edit user.");
				throw new help.clientError("Server Error", response.status, "Unable to edit user.");
			}
		})
		.then(() => {
			routePage("#myFeed");
			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	});
};

// Send that a like was clicked on for a post.
export function processLikeClick(postID) {
	console.log("like clicked for postID: ", postID);
	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify({"post_id": postID})
		};
		fetch(route.SERVER + 'reaction', options)
		.then((response) => {
			if (response.statusCode == 401) {routePage("#accLogin")};
			if (response.ok || response.statusCode == 200) {
				return response.json();
				//return(true)
			}
			else {
				help.woops("Unable to record like.");
				throw new help.clientError("Server Error", response.status, "Problem recording like.");
			}
		}).then((output) => {
			console.log('reactions output',output)
			routePage();
			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	})
}

// Get the comments for a post.
export function processCommentClick(postID) {
	console.log("comments clicked for postID: " + postID);
	const elementPostBox = document.getElementById(postID);
	console.log(elementPostBox.getAttribute("toggled"));
	// If the box is not expanded.
	if (elementPostBox.getAttribute("toggled") == "false") {
		const elementCommentBox = document.createElement("div");
		elementCommentBox.setAttribute("id", "commentsdiv" + postID);
		elementCommentBox.setAttribute("class", "commentsdiv");
		if (page.testcomments) test.testComments(elementCommentBox);

		return new Promise((resolve, reject) => {
			let options = {
				method: "GET",
				credentials: "include",
				headers: {
				"Content-Type": "application/json"}
			};
			fetch(route.SERVER + 'comment?post_id='+postID, options)
			.then((response) => {
				if (response.statusCode == 401) {routePage("#accLogin")};
				if (response.ok) {
					return response.json();
				}
				else {
					help.woops("Unable to retrieve comments.");
					throw new help.clientError("Server Error", response.status, "Unable to retrieve comments.");
				}
			})
			.then((commentsList) => {
				for (let comment of commentsList) {
					console.log(comment)
					let newComment = phelp.createComment(help.loadImage(comment.user_image, true, "profile"), comment.user_handle, comment.comment_content, 
						new Date(comment.comment_timestamp).toLocaleDateString("en-us", {weekday:"long", year:"numeric", month:"short", day:"numeric"}))
					elementCommentBox.append(newComment)
				}
				let elementInputFull = document.createElement('input') ; // box to put a new comment in
				elementInputFull.setAttribute("id", "commentInput")
				elementInputFull.setAttribute("class", "inputbox combox");
				elementInputFull.setAttribute("placeholder", 'Type your comment here. Press enter to submit.')
				
				elementCommentBox.append(elementInputFull);
				elementPostBox.append(elementCommentBox);
				elementPostBox.setAttribute("toggled", "true")

				elementInputFull.addEventListener("submit", function(event) {
					sendCommentToNode(postID, elementInputFull.value)
					//TODO - handoff to DB.
				});
				return resolve(true);
			})
			.catch((error) => {
				return reject(error);
			});
		})
	
	}
	// If it is expanded.
	else {
		const elementCommentBox = document.getElementById("commentsdiv" + postID);
		elementCommentBox.remove();
		elementPostBox.setAttribute("toggled", "false")
	}
	
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
			if (response.statusCode == 401) {routePage("#accLogin")};
			if (response.ok) {
				return response.json();
			}
			else {
				help.woops("Unable to retrieve post.");
				throw new help.clientError("Server Error", response.status, "Unable to retrieve posts.");
			}
		})
		.then((postsList) => {
			for (let post of postsList) {
				phelp.insertPost(help.loadImage(post.user_image, true), post.post_title, post.user_handle, 
				new Date(post.post_timestamp).toLocaleDateString("en-us", {weekday:"long", year:"numeric", month:"short", day:"numeric"}), post.post_content, help.loadImage(post.post_image, true), post.post_likes_score, post.post_comment_count, post.post_id, postType);
				//if (postType) {  phelp.insertPostActions(post.post_id) }
				phelp.insertBigBreak();
			}
			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	});
}

// Send a post create to the server.
export async function postCreateAction(post_id) {
	let post_title = document.querySelector("#post_title").value;
	let post_content = document.querySelector("#post_content").value;
	let post_image = document.querySelector("#post_image_url").value;
	let selected  = document.querySelectorAll("#group_selector option:checked");
	console.log("have ", post_title, post_content, post_image);
	let group_ids = Array.from(selected).map(el => el.value);
	let groupList = "";
	for (let one of group_ids) {
		groupList += one + ","
	}
	console.log("have groupList ", groupList);
	let method, bodyObject
	if (post_id) {
		method = "PUT"
		bodyObject = {
			post_title: post_title,
			post_content: post_content,
			post_image, post_image,
			group_id: groupList,
			post_id: post_id
		  }
	} else {
		method = "POST"
		bodyObject = {
			post_title: post_title,
			post_content: post_content,
			post_image, post_image,
			group_id: groupList
		  }
	}
	return new Promise((resolve, reject) => {
		let options = {
			method: method,
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify(bodyObject)
		};
		fetch(route.SERVER + "post", options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				console.log(response)
				help.woops("Unable to create post.");
				throw new help.clientError("Server Error", response.status, "Unable to create post.");
			}
		})
		.then(() => {
			routePage("#feedMy")
			return resolve(true)
		})
		.catch((error) => {
			console.log(error)
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

	if (user_password != user_confirm) {
		help.woops("Passwords don't match.");
		return;
	}

	if (!user_email.includes("@") || !user_email.endsWith(".com")) {
		help.woops("Not a valid email address.");
		return;
	}

	if (user_first_name == "" || user_last_name == "" || user_handle == "" || user_email == "" || user_password == "") {
		help.woops("Required fields are empty.");
		return;
	}

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
				help.woops("Unable to create user.");
				throw new help.clientError("Server Error", response.status, "Unable to create user.");
			}
		})
		.then(() => {
			routePage("#accLogin");
			return resolve(true);
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
				if (response.status == 401) {
					routePage("#accPending");
				} else if (response.status == 402) {
					help.woops("This account is blocked!");
				} else if (response.status == 403) {
					help.woops("This account is disabled!");
				} else {
					help.woops("Unable to login user.");
					throw new help.clientError("Server Error", response.status, "Unable to login user.");
				}
			}
		})
		.then((json) => {
			console.log(json);  
			let sessionid = json.sessionid;
			let aflag = json.admin_flag;
			setCookie("sessionid", sessionid, 7);   
			if (aflag === "1") {
				routePage("#adminPending");
			} else {
				routePage("#feedGlobal");
			}
			return resolve("login successful");
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
				routePage("#accLogin");
				return response.json();
			}
			else {
				help.woops("Unable to logout user.");
				throw new help.clientError("Server Error", response.status, "Unable to logout user.");
			}
		})
		.then(json=> resolve(json))
		.catch((error) => {
			return reject(error);
		});
	});
}

// Ask the server for the list of friends an account has.
export async function getFriends(friend_status) {
	let endpoint;
	if (friend_status) {
		endpoint = "friend?status_wanted="+friend_status;
	} else { 
		endpoint = "friend";
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
			if (response.statusCode == 401) {routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				help.woops("Unable to retrieve friends.");
				throw new help.clientError("Server Error", response.status, "Unable to retrieve friends");
			}
		})
		.then((friendsList) => {
			for (let friend of friendsList) {
				phelp.insertFriendItem(help.loadImage(friend.user_image, true), friend.user_handle, friend_status, friend.friend_id);
			}
			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	});
}

// Search for a person globally.
export function friendSearchAction () {
	let searchString = document.querySelector("#screenname").value;
	let endpoint = "user";
	if (searchString) {
		endpoint = "user?search=" + encodeURIComponent(searchString);
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
			if (response.statusCode == 401) {routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				help.woops("Unable to retrieve friends.");
				throw new help.clientError("Server Error", response.status, "Unable to retrieve friends");
			}
		})
		.then((friendsList) => {
			let elementResultBox = document.getElementById("resultbox");
			elementResultBox.innerHTML = "";
			for (let friend of friendsList) {
				phelp.insertFriendItem(help.loadImage(friend.user_image, true), friend.user_handle, "search", friend.user_id, true);
			}
			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	});
};

// Make a friend request to the server.
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
				help.woops("Unable to add friend.");
				throw new help.clientError("Server Error", response.status, "Problem requesting a friend.");
			}
		})
		.then(json=> resolve(json))
		.catch((error) => {
			return reject(error);
		});
	});
}

// Edit a friend in a group.
export function editFriendGroups(friend_id) {
	document.querySelector("meta[name='friends_payload']").setAttribute("content", friend_id);
	routePage("#accFriendGroups");
}

// Get the stats for a friend.
export function loadFriendStats(friend_id) {
	let endpoint = "friendgroups?friend_id=" + friend_id;

	return new Promise((resolve, reject) => {
		let options = {
			method: "GET",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"}
		};
		fetch(route.SERVER + endpoint, options)
		.then((response) => {
			if (response.statusCode == 401) {routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				help.woops("Unable to retrieve friends.");
				throw new help.clientError("Server Error", response.status, "Unable to retrieve friends");
			}
		})
		.then((data) => {
			let selector = document.createElement("select");
			selector.setAttribute("multiple", true);
			selector.setAttribute("id", "group_selector");
			
			for (let onegroup of data) {
				let oneoption = document.createElement("option");
				oneoption.setAttribute("value",onegroup.group_id);
				oneoption.textContent = onegroup.group_name;
				selector.appendChild(oneoption);
				if (onegroup.inGroup && onegroup.inGroup > 0 ) {
					oneoption.setAttribute("selected", true);
				} 
			}
			const elementBoxFull = document.getElementById("boxfull");
			const elementInputFull = document.createElement("div");
			elementInputFull.setAttribute("class", "inputbox");
			elementInputFull.textContent = "Friend in the following groups:";
			elementInputFull.append(selector);
			elementBoxFull.append(elementInputFull);
			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	});
}
export function friendGroupsUpdateAction(friend_id) {

	let selected  = document.querySelectorAll("#group_selector option:checked");
	let group_ids = Array.from(selected).map(el => el.value);
	let groupList = "";
	for (let one of group_ids) {
		groupList += one + ","
	}
	console.log("have groupList ", groupList);
	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify({
				friend_id: friend_id,
				group_id: groupList
			  })
		};
		fetch(route.SERVER + "friendgroups", options)
		.then((response) => {
			if (response.ok) {
				return;
			}
			else {
				help.woops("Unable to update friend group.");
				throw new help.clientError("Server Error", response.status, "Problem updating friend groups.");
			}
		})
		.then(() => {
			routePage("#accFriends")
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
	
};

export function removeFriendAction(friend_id) {
	return new Promise((resolve, reject) => {
		let options = {
			method: "DELETE",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
		};

		fetch(route.SERVER + "friend?friend_id="+friend_id, options)
		.then((response) => {
			if (response.ok) {
				return;
			}
			else {
				help.woops("Unable to update friends.");
				throw new help.clientError("Server Error", response.status, "Problem updating friends.");
			}
		})
		.then(() => {
			routePage("#accFriends")
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
	
};

export function rejectFriendAction(friend_id) {
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

		fetch(route.SERVER + "rejectfriend", options)
		.then((response) => {
			if (response.ok) {
				return;
			}
			else {
				help.woops("Unable to update friends.");
				throw new help.clientError("Server Error", response.status, "Problem updating friends.");
			}
		})
		.then(() => {
			routePage("#accFriends")
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
	
};

export function adminSetStatus (statusWanted, targetUser) {

		return new Promise((resolve, reject) => {
			let options = {
				method: "POST",
				credentials: "include",
				headers: {
				"Content-Type": "application/json"},
				body: JSON.stringify({
					status_wanted: statusWanted,
					target_user: targetUser
				})
			};
			fetch(route.SERVER + 'adminstatus', options)
			.then((response) => {
				if (response.statusCode == 401) {routePage("#accLogin")}
				if (response.ok) {
					return ;
				}
				else {
					help.woops("Unable to set status.");
					throw new help.clientError("Server Error", response.status, "Problem setting user status.");
				}
			})
			.then(() => {
				routePage()
				return resolve(true);
			})
			.catch((error) => {
				return reject(error);
			});
		});
}

export function addGroupAction (groupID) {
	// save new/edited group
	let method, bodyObject

	let group_name = document.querySelector('#group_name').value
	let group_ranking = document.querySelector('#ranking_selector').value ;

	if (groupID) {
		method = "PUT"
		bodyObject = {
			group_name: group_name,
			group_ranking: group_ranking,
			group_id: groupID
		  }
	} else {
		method = "POST"
		bodyObject = {
			group_name: group_name,
			group_ranking: group_ranking
		  }
	}
	return new Promise((resolve, reject) => {
		let options = {
			method: method,
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify(bodyObject)
		};
		fetch(route.SERVER + "group", options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				console.log(response)
				help.woops("Unable to create post.");
				throw new help.clientError("Server Error", response.status, "Unable to create post.");
			}
		})
		.then(() => {
			routePage("#accGroups")
			return resolve(true)
		})
		.catch((error) => {
			console.log(error)
			return reject(error);
		});
	});
	
};


export function loadGroupsEntries () {
	let endpoint = "group"

	return new Promise((resolve, reject) => {
		let options = {
			method: "GET",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"}
		};
		fetch(route.SERVER + endpoint, options)
		.then((response) => {
			if (response.statusCode == 401) {routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				help.woops("Unable to load groups.");
				throw new help.clientError("Server Error", response.status, "Unable to load groups");
			}
		})
		.then((data) => {
			for (let one of data) {
				phelp.insertGroupItem(one.group_id, one.group_name, one.group_ranking)
			}

			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	});
}

export function sendCommentToNode (postID, comment_content) {

		let method = "POST"
		let bodyObject = {
			"post_id": postID,
			"comment_content": comment_content
		  }
	
	return new Promise((resolve, reject) => {
		let options = {
			method: method,
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
			body: JSON.stringify(bodyObject)
		};
		fetch(route.SERVER + "comment", options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				console.log(response)
				help.woops("Unable to create comment.");
				throw new help.clientError("Server Error", response.status, "Unable to create comment.");
			}
		})
		.then(() => {
			routePage()
			return resolve(true)
		})
		.catch((error) => {
			console.log(error)
			return reject(error);
		});
	});
	
};
