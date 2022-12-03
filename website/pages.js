import * as phelp from "./pageshelpers.js";
import * as help from "./helpers.js";
import * as routes from "./routes.js";
import * as fns from "./functions.js";


// The header for the regular user pages.
const userHeader = [["feedglobal", "Global Feed", "routePage('#feedGlobal')"], ["feedmy", "My Feed", "routePage('#feedMy')"], ["createpost", "Create Post", "routePage('#postCreate')"], ["friends", "Friends", "routePage('#accFriends')"], ["groups", "Groups", "routePage('#accGroups')"], ["account", "Settings", "routePage('#accSettings')"]]

// The header for the admin pages.
const adminHeader = [["pending", "Pending Accounts", "routePage('#adminPending')"], ["disabled", "Disabled Accounts", "routePage('#adminDisabled')"], ["active", "Active Accounts", "routePage('#adminActive')"], ["blacklist", "Blacklisted Accounts", "routePage('#adminBlacklist')"]];

// Always insert the content box first, and then the header type.

// When you need to login to Napkin.
export function accLogin() {
	phelp.insertContent();
	phelp.insertMiniHeader("Log in to Napkin", false);
	phelp.insertBigBreak();
	phelp.insertFullBox(false);
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.insertBottomButtons([["login", ["button", "buttonsubmit"], "Login", "routePage('#feedGlobal')"], ["create", ["button", "buttonother"], "Create Account", "routePage('#accCreate')"], ["test", ["button", "buttonother"], "adminTest", "routePage('#adminPending')"]]);
}

// When you are creating an account.
export function accCreate() {
	phelp.insertContent();
	phelp.insertMiniHeader("Create a Napkin Account", false);
	phelp.insertBigBreak();
	phelp.insertFullBox(false);
	phelp.insertInputBox("User first name:", "firstname", false);
	phelp.insertInputBox("User last name:", "lastname", false);
	phelp.insertInputBox("User screen name:", "screenname", false);
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.insertInputBox("Confirm password:", "confirm", true);
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "routePage('#accPending')"], ["tologin", ["button", "buttonother"], "Back to Login", "routePage('#accLogin')"]]);
}

// When your account is now pending.
export function accPending() {
	phelp.insertContent();
	phelp.insertMiniHeader("Account Approval Pending", false);
	phelp.insertBigBreak();
	phelp.insertFullBox(false);
	phelp.insertText("Your account is still waiting for approval!");
	phelp.insertText("Please check back later.");
	phelp.insertBottomButtons([["tologin", ["button", "buttonother"], "Back to Login", "routePage('#accLogin')"]]);
}

// Fill the feed with non-user made posts, or user made posts.
function feedFill(postType) {
	let endpoint
if (postType) {
	// true means the individual user's posts
	endpoint = 'myposts'
} else {
	// false means the 'global' feed.
	endpoint = 'post'
}
	return new Promise((resolve, reject) => {
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
				//throw new ClientError("User Error", response.status,"Unable to retrieve posts");
				throw new Error('error', response)
			}
		})
		.then((postsList) => {
			for (let post of postsList) {
				phelp.insertPost(help.loadImage(post.user_image), post.post_title, post.user_handle, post.post_timestamp, post.post_content, help.loadImage(post.post_image), postType);
				phelp.insertBigBreak();
			}
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
}

// When you are looking at the global feed.
export function feedGlobal() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "feedglobal");
	phelp.insertNextButton();
	feedFill(false);
}

// When you are looking at just your feed.
export function feedMy() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "feedmy");
	phelp.insertNextButton();
	feedFill(true);
}

// When you look at your list of friends.
export function accFriends() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
	phelp.insertMiniHeader("Manage Friends", "manage");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertText("Current Friends");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"current");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"current");
	phelp.insertText("Outgoing requests");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"outgoing");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"outgoing");
	phelp.insertText("Incoming requests");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"incoming");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"incoming");
}

// When you look at who you have blocked.
export function accBlocked() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
	phelp.insertMiniHeader("Manage Blocked", "blocked");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"blocked");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"blocked");
}

// When you're searching for a friend.
export function friendSearch() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
	phelp.insertMiniHeader("Search for a New Friend", "blocked");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Search by Name:", "screenname", false);
	phelp.insertText("Search Results");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"search");
	phelp.insertText("Additional Results");
	phelp.insertFriendItem(help.loadImage("./assets/test1.jpg"), "Will Smith", 
		"search");
}

// When you look at your groups.
export function accGroups() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "groups");
}

// When you want to create a post.
export function postCreate() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "createpost");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Post title:", "post_title", false);
	phelp.insertInputBox("Post image URL:", "post_image", false);
	phelp.insertTextAreaBox("Post content:", "post_content", false);
	phelp.getGroupsSelector()
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "fns.postCreateAction()"]]);
	
}

// When you want to edit a post.
export function postEdit() {
	phelp.insertContent();
	phelp.insertHeader(userHeader);
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Post title:", "post_title", false);
	phelp.insertInputBox("Post image URL:", "post_image", false);
	phelp.insertTextAreaBox("Post content:", "post_content", false);
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "routePage('#myFeed')"]]);

}

// When you look at your account settings.
export function accSettings() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "account");
	phelp.insertMiniHeader("Account Settings", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Change email:", "email", false);
	phelp.insertInputBox("Change first name:", "firstname", false);
	phelp.insertInputBox("Change last name:", "lastname", false);
	phelp.insertInputBox("Change password:", "password", true);
	phelp.insertInputBox("Confirm password:", "confirm", true);
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "routePage('#accSettings')"], ["image", ["button", "buttonother"], "Change Image", "TODOCHANGEIMAGE"]]);
}

// Fill the admin pages with bunk data.
function adminFill(adminPage) {
	for (let itrFill = 10; itrFill--;)
		phelp.insertUserItem(help.loadImage("./assets/test1.jpg"), "Will Smith " + itrFill, "will.smith68@gmail.com", "Nov 10th 2022", adminPage);
}

// For admins to look at pending accounts.
export function adminPending() {
	const adminPage = "pending";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("New User Requests", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	adminFill(adminPage);
}

// For admins to look at disabled accounts.
export function adminDisabled() {
	const adminPage = "disabled";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Disabled Accounts", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	adminFill(adminPage);
}

// For admins to look at active accounts.
export function adminActive() {
	const adminPage = "active";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Active Accounts", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	adminFill(adminPage);
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	const adminPage = "blacklist";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Blacklisted Emails", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	adminFill(adminPage);
}