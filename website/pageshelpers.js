import * as help from "./helpers.js";
import * as pact from "./pagesactions.js";
import * as routes from "./routes.js";

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
				const elementButtonBack= createButton("tofriends", ["button", "buttonblue"], "Back to Friends", "routePage('#accFriends')");
				elementButtonBox.append(elementButtonBack);
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

// Add a post to the page.
// postMy = true, means the individual user's posts.
// postMy = false, means the "global" feed.
export function insertPost(userPicture, postTitle, userName, postDate, postContent, postImage, postLikes, postComments, postID, postMy) {
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
	// TODO:  userPicture is the URL.  Is isn't something you can set an attribute for.  What happened to the code that was here that worked?

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
		elementEye.setAttribute("type", "image");
		elementEye.setAttribute("src", help.pathImage("eye", false));
		elementEye.setAttribute("class", "userpicture");
		elementEye.addEventListener("click", () => console.log("hide " + postID)); // TODO: HOOKUP HIDE?
		elementDivIcons.append(elementEye);
		const elementEdit = document.createElement("input");
		elementEdit.setAttribute("type", "image");
		elementEdit.setAttribute("src", help.pathImage("edit", false));
		elementEdit.setAttribute("class", "userpicture");
		elementEdit.addEventListener("click", () => payloadEdit(postID, postTitle, postContent, postImage.getAttribute("src")));
		elementDivIcons.append(elementEdit);
		const elementTrash = document.createElement("input");
		elementTrash.setAttribute("type", "image");
		elementTrash.setAttribute("src", help.pathImage("remove", false));
		elementTrash.setAttribute("class", "userpicture");
		elementTrash.addEventListener("click", () => console.log("trash " + postID)); // TODO: HOOKUP DELETE?
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
	elementScroll.addEventListener("click", () => pact.processCommentClick(postID)); // Handle comments.
	elementDivComments.append(elementScroll)
	// Append the like count.
	const elementCommentCount = document.createElement("div");
	elementCommentCount.setAttribute("class", "liketext");
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
export function createComment(userPicture, commentName, commentContent, commentDate) {
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

export function insertPostActions(postID) {
	//TODO: need post deletion, remove post from all groups (makes post invisible), post edit
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
export function insertFriendItem(userPicture, userName, itemType, friend_ID) {
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
			const elementButtonGroups = createButton("remove", ["button", "buttongreen"], "Edit Groups", `editFriendGroups(${friend_ID})`);
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
	elementBoxFull.append(elementDivFriend);
}

// Create an admin user info div. Picture, name, email, date, item type.
export function insertUserItem(userPicture, userFirstName, userLastName, userEmail, itemDate, itemType) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivUser = document.createElement("div");
	elementDivUser.setAttribute("class", "userdiv");
	// Format the user picture with the appropriate class.
	userPicture.setAttribute("class", "userpicture");
	elementDivUser.append(userPicture);
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
			const elementButtonApprove = createButton("approve", ["button", "buttongreen"], "Approve", "TODOAPPROVE");
			elementButtonBox.append(elementButtonApprove);
			const elementButtonDecline = createButton("decline", ["button", "buttonred"], "Decline", "TODODECLINE");
			elementButtonBox.append(elementButtonDecline);
			break;
		case "disabled":
			finalText = "Disabled on: ";
			const elementButtonEnable = createButton("enable", ["button", "buttongreen"], "Enable", "TODOENABLE");
			elementButtonBox.append(elementButtonEnable);
			break;
		case "active":
			finalText = "Approved on: ";
			const elementButtonDisable = createButton("disable", ["button", "buttonred"], "Disable", "TODODISABLE");
			elementButtonBox.append(elementButtonDisable);
			break;
		case "blacklist":
			finalText = "Blacklisted on: ";
			const elementButtonUnblack = createButton("unblacklist", ["button", "buttongreen"], "Unblacklist", "TODOUNBLACKLIST");
			elementButtonBox.append(elementButtonUnblack);
			break;
	}
	finalText += itemDate;
	elementUserDate.textContent = finalText;
	elementDivUser.append(elementUserDate);
	elementDivUser.append(elementButtonBox);
	elementBoxFull.append(elementDivUser);
}

export function insertGroupItem(group_id, group_name, group_ranking) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivGroup = document.createElement("div");
	elementDivGroup.setAttribute("class", "groupdiv");
	// Create a text block for the name.
	const elementGroupName = document.createElement("div");
	elementGroupName.setAttribute("id", "group_name");
	elementGroupName.setAttribute("class", "usertext");
	elementGroupName.textContent = group_name + "#"+group_id + "ranking" + group_ranking;
	elementDivGroup.append(elementGroupName);
	// Setup the buttons properly.
	const elementButtonBox = document.createElement("div");
	elementButtonBox.setAttribute("class", "buttonbox");
	elementDivGroup.append(elementButtonBox);
	elementBoxFull.append(elementDivGroup);
	//TODO
	
}

// Get the groups selector input.
export function getGroupsSelector() {
	let selector = document.createElement("select");
	selector.setAttribute("multiple", true);
	selector.setAttribute("id", "group_selector");

	let endpoint = "group";
	let options = {
		method: "GET",
		credentials: "include",
		headers: {
		"Content-Type": "application/json"}
	};
	fetch(routes.SERVER+endpoint, options)
	.then((response) => {
		if (response.ok) {
			return response.json();
		}
		else {
			throw new help.clientError("Server Error", response.status, "Unable to get groups.");
		}
	})
	.then(data => {
		for (let onegroup of data) {
			let oneoption = document.createElement("option");
			oneoption.setAttribute("value", onegroup.group_id);
			oneoption.textContent = onegroup.group_name;
			selector.appendChild(oneoption);
		}
		const elementBoxFull = document.getElementById("boxfull");
		const elementInputFull = document.createElement("div");
		elementInputFull.setAttribute("class", "inputbox");
		elementInputFull.textContent = "Post visible to:";
		elementInputFull.append(selector);
		elementBoxFull.append(elementInputFull);
	})
}

/*
export function insertUploadForm() {
	const elementBoxFull = document.getElementById("boxfull");
	const elementImageForm = document.createElement("form");
	elementImageForm.setAttribute("action", "/#upload");
	elementImageForm.setAttribute("method", "post")
	elementImageForm.setAttribute("enctype", "multipart/form-data");
	const fileUploadElement = document.createElement('input');
	fileUploadElement.setAttribute("accept", "image/*");
	fileUploadElement.setAttribute('type','file');
	fileUploadElement.setAttribute('name', 'filetoupload')
	const submitButton = document.createElement('input')
	submitButton.setAttribute('type', 'submit')
	elementImageForm.appendChild(fileUploadElement);
	elementImageForm.appendChild(submitButton)
	elementBoxFull.appendChild(elementImageForm)
}
*/