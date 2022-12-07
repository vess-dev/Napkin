import * as help from "./helpers.js";
import * as pact from "./pagesactions.js";
import * as route from "./routes.js";

// Insert a content box where... Content is displayed. Haha.
export function insertContent() {
	const elementBody = document.querySelector("body");
	const elementContent = document.createElement("div");
	elementContent.setAttribute("id", "content");
	elementBody.append(elementContent);
}

// Insert the WIDE and full Napkin header.
export function insertHeader(headerList, headerFocus) {
	const elementBody = document.querySelector("body");
	const elementHeader = document.createElement("div");
	elementHeader.setAttribute("id", "header");
	// Create each header button turn by turn.
	for (let itrHeader in headerList) {
		const elementNewHeader = createButton(headerList[itrHeader][0], ["headerbox"], headerList[itrHeader][1], headerList[itrHeader][2]);
		if (headerFocus == headerList[itrHeader][0]) {
			elementNewHeader.classList.add("colorblue");
		}
		elementHeader.append(elementNewHeader);
	}
	elementBody.append(elementHeader);
	// Move the content below the full header.
	const elementContent = document.getElementById("content");
	elementContent.style.marginTop = "4.5rem";
}

// A mini header that is not a full header.
export function insertMiniHeader(headerName, buttonType) {
	const elementContent = document.getElementById("content");
	const elementMiniHeader = document.createElement("div");
	elementMiniHeader.setAttribute("id", "headermini");
	const elementMiniDiv = document.createElement("div");
	elementMiniDiv.setAttribute("id", "minidiv");
	const elementMiniText = document.createElement("div");
	elementMiniText.textContent = headerName;
	elementMiniDiv.append(elementMiniText);
	// Create buttons only on a button type.
	if (buttonType) {
		const elementButtonBox = document.createElement("div");
		elementButtonBox.setAttribute("class", "buttonbox");
		switch (buttonType) {
			case "logout":
				const elementButtonLogout = createButton("logout", ["button", "buttonred"], "Logout", "userLogoutAction()");
				elementButtonBox.append(elementButtonLogout);
				break;
			case "manage":
				const elementButtonBlocked = createButton("toblocked", ["button", "buttonblue"], "Manage Blocked", "routePage('#accBlocked')");
				elementButtonBox.append(elementButtonBlocked);
				const elementButtonSearch = createButton("search", ["button", "buttonblue"], "Search for Friend", "routePage('#friendSearch')");
				elementButtonBox.append(elementButtonSearch);
				break;
			case "blocked":
				const elementButtonBack = createButton("tofriends", ["button", "buttonblue"], "Back to Friends", "routePage('#accFriends')");
				elementButtonBox.append(elementButtonBack);
				break;
			case "addgroup":
				const elementButtonGroup = createButton("togroups", ["button", "buttonblue"], "Add Group", "routePage('#accAddGroup')");
				elementButtonBox.append(elementButtonGroup);
				break;
			case "editgroup":
				const elementButtonTop= createButton("tofriends", ["button", "buttonblue"], "Back to Groups", "routePage('#accGroups')");
				elementButtonBox.append(elementButtonTop);
				break;
		}
		elementMiniDiv.append(elementButtonBox);
	}
	
	elementMiniHeader.append(elementMiniDiv);
	elementContent.append(elementMiniHeader);
}

// Add a small break between content.
export function insertBigBreak() {
	const elementContent = document.getElementById("content");
	const elementBigBreak = document.createElement("div");
	elementBigBreak.setAttribute("class", "bigbreak");
	elementContent.append(elementBigBreak);
}

// Extremely EVIL. I feel WRONG. I'm SORRY.
export function payloadEdit(postID, postTitle, postContent, postImage) {
	window.payload = [postID, postTitle, postContent, postImage];
	routePage("#postEdit");
}

// Right, so I'll join you there, then. -C
export function payloadEditGroup(groupID, groupName, groupRanking) {
	window.payload = [groupID, groupName, groupRanking];
	routePage("#accEditGroup");
}

export function toggleEye(eyeD) {
	console.log("heye" + eyeD)
	// I love that this is eyeD.  
	const elementEye = document.getElementById(eyeD);
	if (elementEye.src.includes("hidden")) {
		elementEye.src = help.pathImage("eye", false);
	} else {
		elementEye.src = help.pathImage("hidden", false);
	}
}

// Add a post to the page.
// postMy = true, means the individual user's posts.
// postMy = false, means the "global" feed.
export function insertPost(userPicture, postTitle, userName, postDate, postContent, postImage, postLikes, postComments, postID, postMy, postVis) {
	const elementContent = document.getElementById("content");
	// Ugg. Whatever. This is for comments on the bottom.
	const elementBoxPoster = document.createElement("div");
	elementBoxPoster.setAttribute("id", postID);
	elementBoxPoster.setAttribute("class", "postboxer");
	elementBoxPoster.setAttribute("toggled", "false");
	// Create the entire box post.
	const elementBoxPost = document.createElement("div");
	elementBoxPost.setAttribute("class", "postbox");
	// Where all of the text of a post lies.
	const elementBoxMain = document.createElement("div");
	elementBoxMain.setAttribute("class", "postmain");
	// Where the user picture, title, name, and date lives.
	const elementDivInfo = document.createElement("div");
	elementDivInfo.setAttribute("class", "userdiv");
	// Add the user picture. TODO: IF THERE IS NO PICTURE, USE PROFILE.PNG.

	if (userPicture) {
		// need this? 
		//help.loadImage(post.post_image, true)
		userPicture.setAttribute("class", "userpicture");
		elementDivInfo.append(userPicture);
	}
	// Add the post title.
	const elementPostTitle = document.createElement("div");
	elementPostTitle.setAttribute("id", "title");
	elementPostTitle.setAttribute("class", "usertext");
	elementPostTitle.textContent = postTitle;
	elementDivInfo.append(elementPostTitle);
	// A bunch of flapjacking icons.
	if (postMy) {
		const elementDivIcons = document.createElement("div");
		elementDivIcons.setAttribute("class", "icons");
		const elementEye = document.createElement("input");
		elementEye.setAttribute("id", "eye" + postID);
		elementEye.setAttribute("type", "image");
		if (postVis) {
			elementEye.setAttribute("src", help.pathImage("hidden", false));
		} else {
			elementEye.setAttribute("src", help.pathImage("eye", false));
		}
		elementEye.setAttribute("class", "userpicture");
		elementEye.addEventListener("click", () => toggleEye("eye" + postID));
		elementEye.addEventListener("click", () => { 
			postVis = !postVis 
			console.log("hide " + postID)
			updateVisibility(postID, !postVis)
			}); // TODO: HOOKUP HIDE?
		elementDivIcons.append(elementEye);
		const elementEdit = document.createElement("input");
		elementEdit.setAttribute("type", "image");
		elementEdit.setAttribute("src", help.pathImage("edit", false));
		elementEdit.setAttribute("class", "userpicture");
		let tmpPostImage
		if (postImage && postImage.src) { tmpPostImage = postImage.getAttribute("src")}
		elementEdit.addEventListener("click", () => payloadEdit(postID, postTitle, postContent, tmpPostImage));
		elementDivIcons.append(elementEdit);
		const elementTrash = document.createElement("input");
		elementTrash.setAttribute("type", "image");
		elementTrash.setAttribute("src", help.pathImage("remove", false));
		elementTrash.setAttribute("class", "userpicture");
		elementTrash.addEventListener("click", () => {
			console.log("trash " + postID)
			deletePost(postID);
			}); // TODO: HOOKUP DELETE?
		elementDivIcons.append(elementTrash);
		elementDivInfo.append(elementDivIcons);
	}
	// Add the various post info.
	const elementPostInfo = document.createElement("div");
	elementPostInfo.setAttribute("id", "info");
	elementPostInfo.setAttribute("class", "usertext textright");
	elementPostInfo.textContent = userName + " on " + postDate;
	elementDivInfo.append(elementPostInfo);
	// Setup a div for the heart and likes.
	const elementDivLikes = document.createElement("div");
	elementDivLikes.setAttribute("class", "virtbox");
	// Load the heart.
	const elementHeart = document.createElement("input");
	elementHeart.setAttribute("type", "image");
	elementHeart.setAttribute("src", help.pathImage("heart", false));
	elementHeart.setAttribute("class", "userpicture");
	elementHeart.addEventListener("click", () => pact.processLikeClick(postID)); // TODO: Sending likes for a post.
	elementDivLikes.append(elementHeart)
	const elementPostLikes = document.createElement("div");
	elementPostLikes.setAttribute("class", "liketext");
	elementPostLikes.textContent = postLikes;
	elementDivLikes.append(elementPostLikes);
	elementDivInfo.append(elementDivLikes);
	// Setup a div for the scroll and comments.
	const elementDivComments = document.createElement("div");
	elementDivComments.setAttribute("class", "virtbox");
	// Append the scroll button.
	const elementScroll = document.createElement("input");
	elementScroll.setAttribute("type", "image");
	elementScroll.setAttribute("src", help.pathImage("scroll", false));
	elementScroll.setAttribute("class", "userpicture");
	elementScroll.addEventListener("click", () => pact.processCommentClick(postID, postMy)); // Handle comments.
	elementDivComments.append(elementScroll)
	// Append the like count.
	const elementCommentCount = document.createElement("div");
	elementCommentCount.setAttribute("class", "liketext");
	elementCommentCount.setAttribute("id", "commentcount" + postID);
	elementCommentCount.textContent = postComments;
	elementDivComments.append(elementCommentCount);
	elementDivInfo.append(elementDivComments);
	// Append the final div with all the info.
	elementBoxMain.append(elementDivInfo);
	// Add the actual post's content.
	const elementPostContent = document.createElement("div");
	elementPostContent.setAttribute("id", "block");
	elementPostContent.setAttribute("class", "block");
	elementPostContent.textContent = postContent;
	elementBoxMain.append(elementPostContent);
	elementBoxPost.append(elementBoxMain);
	// Where the picture of a post lies.
	if (postImage) {
		postImage.setAttribute("class", "postpicture");
		elementBoxPost.append(postImage);
	}
	elementBoxPoster.append(elementBoxPost);
	elementContent.append(elementBoxPoster);
}

// Create a comment div.
export function createComment(userPicture, commentName, commentContent, commentDate, deleteToggle, commentId) {
	const elementDivInfo = document.createElement("div");
	elementDivInfo.setAttribute("class", "userdiv");
	// Append the user picture.
	userPicture.setAttribute("class", "userpicture");
	elementDivInfo.append(userPicture);
	// Append the commenter name.
	const elementCommentName = document.createElement("div");
	elementCommentName.setAttribute("class", "textdiv");
	elementCommentName.textContent = commentName;
	elementDivInfo.append(elementCommentName);
	// Append the comment text.
	const elementCommentText = document.createElement("div");
	elementCommentText.setAttribute("class", "textdiv");
	elementCommentText.textContent = commentContent;
	elementDivInfo.append(elementCommentText);
	// Append the comment date.
	const elementCommentDate = document.createElement("div");
	elementCommentDate.setAttribute("class", "textright");
	elementCommentDate.textContent = commentDate;
	elementDivInfo.append(elementCommentDate);
	if (deleteToggle) {
		const elementDivIcons = document.createElement("div");
		elementDivIcons.setAttribute("class", "icons");
		const elementTrash = document.createElement("input");
		elementTrash.setAttribute("type", "image");
		elementTrash.setAttribute("src", help.pathImage("remove", false));
		elementTrash.setAttribute("class", "userpicture");
		elementTrash.addEventListener("click", () => console.log("delete " + commentId));
		elementDivIcons.append(elementTrash);
		elementDivInfo.append(elementDivIcons);
	}
	return elementDivInfo;
}

// A box for content that almost hits the bottom height.
export function insertFullBox(miniHeader) {
	const elementContent = document.getElementById("content");
	const elementBoxFull = document.createElement("div");
	elementBoxFull.setAttribute("id", "boxfull");
	// Account for a page height difference with a mini header.
	if (miniHeader) {
		elementBoxFull.style.height = "calc(100vh - 15rem)";
	}
	elementContent.append(elementBoxFull);
}

// A div that has text on the left, and an input box on the right.
export function insertInputBox(inputText, inputName, inputPassword, toggleArea, defaultContent) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementInputFull = document.createElement("div");
	elementInputFull.setAttribute("class", "inputbox");
	elementInputFull.textContent = inputText;
	let elementInputField;
	if (toggleArea) {
		elementInputField = document.createElement("textarea");
	}
	else {
		elementInputField = document.createElement("input");
	}
	elementInputField.setAttribute("class", "inputfield");
	elementInputField.setAttribute("id", inputName);
	// If the input should hide a password.
	if (inputPassword) {
		elementInputField.setAttribute("type", "password");
	}
	// If the input should have default content.
	if (defaultContent) {
		if (toggleArea) {
			elementInputField.value = defaultContent;
		} else {
			elementInputField.setAttribute("value", defaultContent);
		}
	}
	elementInputFull.append(elementInputField);
	elementBoxFull.append(elementInputFull);
}

export function insertRadioInputBox(defaultContent) {

		let selector = document.createElement("select");
		selector.setAttribute("id", "ranking_selector");
		selector.setAttribute("class", "inputfield inputselector");

		let options = ["","lowest priority", "low priority", "high priority", "highest priority"]
			for (let oneval of [1,2,3,4]) {
				let oneoption = document.createElement("option");
				oneoption.setAttribute("value", oneval);
				oneoption.textContent = options[oneval]
				selector.appendChild(oneoption);
			}

			if (defaultContent) {selector.value = defaultContent }
			const elementBoxFull = document.getElementById("boxfull");
			const elementInputFull = document.createElement("div");
			elementInputFull.setAttribute("class", "inputbox");
			elementInputFull.textContent = "Priority for posts from users in this group:";
			elementInputFull.append(selector);
			elementBoxFull.append(elementInputFull);
			if (defaultContent) {
				console.log('default content for editing not done yet')
			}
}


// Create and add different button types.
export function createButton(buttonId, buttonClasses, buttonText, buttonCall) {
	const elementButton = document.createElement("button");
	elementButton.setAttribute("id", buttonId);
	for (let itrClass in buttonClasses) {
		elementButton.classList.add(buttonClasses[itrClass]);
	}
	elementButton.textContent = buttonText;
	elementButton.setAttribute("onclick", buttonCall);
	return elementButton;
}

// Add buttons to the bottom of a page.
export function insertBottomButtons(buttonList, cloudToggle) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivBottom = document.createElement("div");
	for (let itrButton in buttonList) {
		const elementNewButton = createButton(buttonList[itrButton][0], buttonList[itrButton][1], buttonList[itrButton][2], buttonList[itrButton][3]);
		elementDivBottom.append(elementNewButton);
	}
	elementDivBottom.setAttribute("class", "buttonbottom");
	if (cloudToggle) {
		let elementButtonCloud = document.createElement("button");
		elementButtonCloud.setAttribute("id", "upload_widget")
		elementButtonCloud.setAttribute("class", "cloudinary-button buttonsubmit");
		elementButtonCloud.textContent = "Upload Image";
		elementDivBottom.appendChild(elementButtonCloud);
	}
	elementBoxFull.append(elementDivBottom);
}

// Add a text content to an element.
export function insertText(divText) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementTextDiv = document.createElement("div");
	elementTextDiv.setAttribute("class", "textdiv");
	elementTextDiv.textContent = divText;
	elementBoxFull.append(elementTextDiv);
}

// Add a next page button to the bottom right of the page.
// Also add the search feed and sort feed buttons.
export function insertNextButton() {
	const elementBody = document.querySelector("body");
	const elementNextButton = createButton("nextpage", ["button", "buttonnext", "buttonsubmit"], "Next Page", "TODONEXTPAGE");
	elementBody.append(elementNextButton);
}

// Create a friend user info div. Picture, name, and type.
// added friend_ID, going to need it for functionality later -C
export function insertFriendItem(userPicture, userName, itemType, friend_ID, edgeCase, friendName) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivFriend = document.createElement("div");
	elementDivFriend.setAttribute("class", "userdiv");
	// Format the user picture with the appropriate class.
	if (userPicture) {
	userPicture.setAttribute("class", "userpicture");
	elementDivFriend.append(userPicture); }
	// Create a text block for the name.
	const elementUserName = document.createElement("div");
	elementUserName.setAttribute("id", "username");
	elementUserName.setAttribute("class", "usertext");
	elementUserName.textContent = userName;
	elementDivFriend.append(elementUserName);
	// Setup the buttons properly.
	const elementButtonBox = document.createElement("div");
	elementButtonBox.setAttribute("class", "buttonbox");
	switch (itemType) {
		case "accepted":
			const elementButtonRemove = createButton("remove", ["button", "buttonred"], "Remove", `removeFriendAction(${friend_ID})`);
			elementButtonBox.append(elementButtonRemove);
			const elementButtonGroups = createButton("remove", ["button", "buttongreen"], "Edit Groups", `editFriendGroups(${friend_ID}, '${userName}')`);
			elementButtonBox.append(elementButtonGroups);
			break;
		case "requested":
			const elementButtonCancel = createButton("cancel", ["button", "buttonred"], "Cancel Request", `removeFriendAction(${friend_ID})`);
			elementButtonBox.append(elementButtonCancel);
			break;
		case "pending":
			const elementButtonApprove = createButton("approve", ["button", "buttongreen"], "Approve", `makeFriendRequest(${friend_ID})`);
			// not an error - the API reads current status and sees that both want to be friends.
			elementButtonBox.append(elementButtonApprove);
			const elementButtonDecline = createButton("decline", ["button", "buttonred"], "Decline", `rejectFriendAction(${friend_ID})`);
			elementButtonBox.append(elementButtonDecline);
			break;
		case "rejected":
			const elementButtonUnblock = createButton("unblock", ["button", "buttonred"], "Unblock", `removeFriendAction(${friend_ID})`);
			elementButtonBox.append(elementButtonUnblock);
			break;
		case "search":
			const elementButtonSend = createButton("send", ["button", "buttongreen"], "Send Friend Request", `makeFriendRequest(${friend_ID})`);
			elementButtonBox.append(elementButtonSend);
			break;
	}
	elementDivFriend.append(elementButtonBox);
	if (edgeCase) {
		let elementResultBox = document.getElementById("resultbox");
		elementResultBox.append(elementDivFriend)
		return;
	}
	elementBoxFull.append(elementDivFriend);
}

// Create an admin user info div. Picture, name, email, date, item type.
export function insertUserItem(userPicture, userFirstName, userLastName, userEmail, itemDate, itemType, oneUserID) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivUser = document.createElement("div");
	elementDivUser.setAttribute("class", "userdiv");
	// Format the user picture with the appropriate class.
	if (userPicture) {
	userPicture.setAttribute("class", "userpicture");
	elementDivUser.append(userPicture); }
	// Create a text block for the name.
	const elementUserName = document.createElement("div");
	elementUserName.setAttribute("id", "username");
	elementUserName.setAttribute("class", "usertext");
	elementUserName.textContent = userFirstName +' ' + userLastName;
	elementDivUser.append(elementUserName);
	// Create a text block for the email.
	const elementUserEmail = document.createElement("div");
	elementUserEmail.setAttribute("id", "useremail");
	elementUserEmail.setAttribute("class", "usertext");
	elementUserEmail.textContent = userEmail;
	elementDivUser.append(elementUserEmail);
	// Create a text block for the date info.
	const elementUserDate = document.createElement("div");
	elementUserDate.setAttribute("class", "usertext date");
	// Setup the buttons properly, along with the date text.
	const elementButtonBox = document.createElement("div");
	elementButtonBox.setAttribute("class", "buttonbox");
	let finalText = "";
	switch (itemType) {
		case "pending":
			finalText = "Created on: ";
			const elementButtonApprove = createButton("approve", ["button", "buttongreen"], "Approve", `adminSetStatus("active","${oneUserID}")`);
			elementButtonBox.append(elementButtonApprove);
			const elementButtonDecline = createButton("decline", ["button", "buttonred"], "Decline", `adminSetStatus("blocked","${oneUserID}")`);
			elementButtonBox.append(elementButtonDecline);
			break;
		case "disabled":
			finalText = "Disabled on: ";
			const elementButtonEnable = createButton("enable", ["button", "buttongreen"], "Enable", `adminSetStatus("active","${oneUserID}")`);
			elementButtonBox.append(elementButtonEnable);
			break;
		case "active":
			finalText = "Approved on: ";
			const elementButtonDisable = createButton("disable", ["button", "buttonred"], "Disable", `adminSetStatus("disabled","${oneUserID}")`);
			elementButtonBox.append(elementButtonDisable);
			break;
		case "blocked":
			finalText = "Blacklisted on: ";
			const elementButtonUnblack = createButton("unblacklist", ["button", "buttongreen"], "Unblacklist", `adminSetStatus("active","${oneUserID}")`);
			elementButtonBox.append(elementButtonUnblack);
			break;
	}
	finalText += itemDate;
	// The dates are not in the backend. Ignoring for now.
	//elementUserDate.textContent = finalText;
	//elementDivUser.append(elementUserDate);
	elementDivUser.append(elementButtonBox);
	elementBoxFull.append(elementDivUser);
}

export function insertGroupItem(group_id, group_name, group_ranking) {
	if (group_name != 'All Friends') {
		const elementBoxFull = document.getElementById("boxfull");
		const elementDivGroup = document.createElement("div");
		elementDivGroup.setAttribute("class", "userdiv");
		// Create a text block for the name.
		const elementGroupName = document.createElement("div");
		elementGroupName.setAttribute("id", "group_name");
		elementGroupName.setAttribute("class", "usertext");
		let options = ["","lowest priority", "low priority", "high priority", "highest priority"]
		elementGroupName.textContent = group_name + "  (#"+group_id + ")  ranking: " + options[group_ranking];
		elementDivGroup.append(elementGroupName);
		// Setup the buttons properly.
		const elementButtonBox = document.createElement("div");
		const elementButtonEdit = createButton("edit", ["button", "buttongreen"], "Edit", `payloadEditGroup(${group_id}, "${group_name}", ${group_ranking})`);
		elementButtonBox.append(elementButtonEdit);
		const elementButtonDelete = createButton("delete", ["button", "buttonred"], "Delete", `TODOgroupDelete(${group_id})`);
		elementButtonBox.append(elementButtonDelete);
		elementButtonBox.setAttribute("class", "buttonbox");
		elementDivGroup.append(elementButtonBox);
		elementBoxFull.append(elementDivGroup);
	}
	
	
}

// Get the groups selector input.
export function getGroupsSelector() {
	let selector = document.createElement("select");
	selector.setAttribute("multiple", true);
	selector.setAttribute("id", "group_selector");
	selector.setAttribute("class", "inputfield groupselector");

	const elementBoxFull = document.getElementById("boxfull");
	const elementInputFull = document.createElement("div");
	elementInputFull.setAttribute("class", "inputbox");
	elementInputFull.textContent = "Post visible to:";
	elementInputFull.append(selector);
	elementBoxFull.append(elementInputFull);

	let endpoint = "group";
	let options = {
		method: "GET",
		credentials: "include",
		headers: {
		"Content-Type": "application/json"}
	};
	fetch(route.SERVER+endpoint, options)
	.then((response) => {
		if (response.ok) {
			return response.json();
		}
		else {
			help.woops("Unable to get groups.");
			throw new help.clientError("Server Error", response.status, "Unable to get groups.");
		}
	})
	.then(data => {
		for (let onegroup of data) {
			let oneoption = document.createElement("option");
			oneoption.setAttribute("value", onegroup.group_id);
			if (onegroup.group_name == "All Friends") {
				oneoption.setAttribute("selected", "selected")
			}
			oneoption.textContent = onegroup.group_name;
			selector.appendChild(oneoption);
		}	
	})
}

export function prePopulateSelectorsOnPost (post_id) {
	let selector = document.createElement("select");
	selector.setAttribute("multiple", true);
	selector.setAttribute("id", "group_selector");
	selector.setAttribute("class", "inputfield groupselector");

	const elementBoxFull = document.getElementById("boxfull");
	const elementInputFull = document.createElement("div");
	elementInputFull.setAttribute("class", "inputbox");
	elementInputFull.textContent = "Post visible to:";
	elementInputFull.append(selector);
	elementBoxFull.append(elementInputFull);
		
	let endpoint = "postgroup?post_id="+post_id
	let options = {
		method: "GET",
		credentials: "include",
		headers: {
		"Content-Type": "application/json"}
	}
	fetch(route.SERVER+endpoint, options)
	.then((response) => {
		if (response.ok) {
			return response.json();
		}
		else {
			help.woops("Unable to get groups.");
			throw new help.clientError("Server Error", response.status, "Unable to get groups.");
		}
	})
	.then(data => {
		for (let onegroup of data) {
			console.log('onegroup is', onegroup)
			let oneoption = document.createElement("option");
			oneoption.setAttribute("value", onegroup.group_id);
			oneoption.textContent = onegroup.group_name;
			selector.appendChild(oneoption);
			if (onegroup.inGroup && onegroup.inGroup > 0 ) {
				oneoption.setAttribute("selected", true);
			} 
		}
		})
	}

export async function getAdminUsers(admin_status) {
	
	let endpoint = "adminusers?status=" + admin_status;

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
				help.woops("Unable to retrieve admin users.");
				throw new help.clientError("Server Error", response.status, "Unable to retrieve admin users.");
			}
		})
		.then((adminUsersList) => {
			for (let adminUser of adminUsersList) {
				insertUserItem(help.loadImage(adminUser.user_image, true), adminUser.user_first_name, 
					adminUser.user_last_name, adminUser.user_email, "NO DATE?", admin_status, adminUser.user_id);
			}
			return resolve(true);
		})
		.catch((error) => {
			return reject(error);
		});
	});
}

export async function getSettingsValues() {
	return new Promise((resolve, reject) => {
		let options = {
			method: "GET",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"}
		};
		fetch(route.SERVER + 'user?search=EXACTLYME', options)
		.then((response) => {
			if (response.statusCode == 401) {routePage("#accLogin")}
			if (response.ok) {
				return response.json();
			}
			else {
				help.woops("Unable to retrieve user data.");
				throw new help.clientError("Server Error", response.status, "Unable to retrieve user data");
			}
		})
		.then((data) => {
			return resolve(data[0]);
		})
		.catch((error) => {
			return reject(error);
		});
	});
};
export function deletePost(post_id) {
	console.log('delete post requested')
	return new Promise((resolve, reject) => {
		let options = {
			method: "DELETE",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
		};

		fetch(route.SERVER + "post?post_id="+post_id, options)
		.then((response) => {
			if (response.ok) {
				return;
			}
			else {
				help.woops("Unable to delete post.");
				throw new help.clientError("Server Error", response.status, "Problem deleting post.");
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

export function updateVisibility(postID, newVisibility) {
	let method, bodyObject

		method = "PUT"
		bodyObject = {
			"post_visable": newVisibility,
			"post_id": postID
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
				help.woops("problems changing visibility.");
				throw new help.clientError("Server Error", response.status, "Unable to change visibilty of post.");
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

