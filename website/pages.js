import * as help from "./helpers.js";
import * as pact from "./pagesactions.js";
import * as phelp from "./pageshelpers.js";
import * as route from "./routes.js";
import * as test from "./testers.js";
import {setCookie, getCookie} from "./cookies.js";

// The header for the regular user pages.
const userHeader = [["feedglobal", "Global Feed", "routePage('#feedGlobal')"], ["feedmy", "My Feed", "routePage('#feedMy')"], ["createpost", "Create Post", "routePage('#postCreate')"], ["friends", "Friends", "routePage('#accFriends')"], ["groups", "Groups", "routePage('#accGroups')"], ["account", "Settings", "routePage('#accSettings')"]]

// The header for the admin pages.
const adminHeader = [["pending", "Pending Accounts", "routePage('#adminPending')"], ["disabled", "Disabled Accounts", "routePage('#adminDisabled')"], ["active", "Active Accounts", "routePage('#adminActive')"], ["blacklist", "Blacklisted Accounts", "routePage('#adminBlacklist')"]];

// Not clean but this works.  Ahha! Good fix, thanks. -C
window.postCreateAction = pact.postCreateAction;
window.queryImage = pact.queryImage;
window.userCreateAction = pact.userCreateAction;
window.userLoginAction = pact.userLoginAction;
window.userLogoutAction = pact.userLogoutAction;
window.createCloudinaryWidget = pact.createCloudinaryWidget;
window.makeCloudinarylink = phelp.makeCloudinarylink;
window.processLikeClick = pact.processLikeClick;

// Disable or enable testing.
const testing = false;


// Always insert the content box first, and then the header type.

// When you need to login to Napkin.
export function accLogin() {
	phelp.insertContent();
	phelp.insertMiniHeader("Log in to Napkin", false);
	phelp.insertBigBreak();
	phelp.insertFullBox(false);
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.insertBottomButtons([["login", ["button", "buttonsubmit"], "Login", "userLoginAction"], ["create", ["button", "buttonother"], "Create Account", "routePage('#accCreate')"], ["test", ["button", "buttonother"], "adminTest", "routePage('#adminPending')"]]);
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
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "userCreateAction"], ["tologin", ["button", "buttonother"], "Back to Login", "routePage('#accLogin')"]]);
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

// When you are looking at the global feed.
export function feedGlobal() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "feedglobal");
	phelp.insertNextButton();
	if (testing) test.testPosts();
	pact.feedFill(false);
}

// When you are looking at just your feed.
export function feedMy() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "feedmy");
	phelp.insertNextButton();
	if (testing) test.testPosts();
	pact.feedFill(true);
}

// When you look at your list of friends.
export async function accFriends() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
	phelp.insertMiniHeader("Manage Friends", "manage");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertText("Current Friends");
	await pact.getFriends('accepted')
	if (testing) test.testFriends("current");
	phelp.insertText("Outgoing requests");
	await pact.getFriends('requested')
	if (testing) test.testFriends("outgoing");
	phelp.insertText("Incoming requests");
	await pact.getFriends('pending')
	if (testing) test.testFriends("incoming");
	
}

// When you look at who you have blocked.
export function accBlocked() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
	phelp.insertMiniHeader("Manage Blocked", "blocked");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	if (testing) test.testFriends("blocked");
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
	if (testing) test.testFriends("search");
	phelp.insertText("Additional Results");
	if (testing) test.testFriends("search");
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
	phelp.insertMiniHeader("Create a post");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Post title:", "post_title", false);
	phelp.insertInputBox("Post image URL:", "post_image_url", false);
	phelp.insertTextAreaBox("Post content:", "post_content", false);
	phelp.getGroupsSelector()
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "postCreateAction()"], ]);
	phelp.makeCloudinarylink()
	pact.createCloudinaryWidget()

}

// When you want to edit a post.
export function postEdit(postID) {
	phelp.insertContent();
	phelp.insertHeader(userHeader);
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("placeholder postID"+postID, "post_title", false);
	phelp.insertInputBox("Post title:", "post_title", false);
	phelp.insertInputBox("Post image URL:", "post_image_url", false);
	phelp.insertTextAreaBox("Post content:", "post_content", false);
	phelp.getGroupsSelector()
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "postCreateAction("+postID+")"]]);
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

// For admins to look at pending accounts.
export function adminPending() {
	const adminPage = "pending";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("New User Requests", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	if (testing) test.testAdmin(adminPage);
}

// For admins to look at disabled accounts.
export function adminDisabled() {
	const adminPage = "disabled";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Disabled Accounts", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	if (testing) test.testAdmin(adminPage);
}

// For admins to look at active accounts.
export function adminActive() {
	const adminPage = "active";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Active Accounts", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	if (testing) test.testAdmin(adminPage);
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	const adminPage = "blacklist";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Blacklisted Emails", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	if (testing) test.testAdmin(adminPage);
}