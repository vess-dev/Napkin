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

// Not clean but this works. Ahha! Good fix, thanks. -C
window.postCreateAction = pact.postCreateAction;
window.queryImage = pact.queryImage;

window.userCreateAction = pact.userCreateAction;
window.userLoginAction = pact.userLoginAction;
window.userLogoutAction = pact.userLogoutAction;

window.createCloudinaryWidget = pact.createCloudinaryWidget;
window.makeCloudinarylink = phelp.makeCloudinarylink;

window.processCommentClick = pact.processCommentClick;
window.processLikeClick = pact.processLikeClick;

window.editFriendGroups = pact.editFriendGroups;
window.friendSearchAction = pact.friendSearchAction;
window.makeFriendRequest = pact.makeFriendRequest;
window.friendGroupsUpdateAction = pact.friendGroupsUpdateAction;
window.removeFriendAction = pact.removeFriendAction;
window.rejectFriendAction = pact.rejectFriendAction ;

window.updateAccount = pact.updateAccount;
window.loadGroupsEntries = pact.loadGroupsEntries;

window.adminSetStatus = pact.adminSetStatus
window.payloadEditGroup = phelp.payloadEditGroup;
window.addGroupAction = pact.addGroupAction;

// Disable or enable testing.
export const testing = false;

// Always insert the content box first, and then the header type.

// When you need to login to Napkin.
export function accLogin() {
	phelp.insertContent();
	phelp.insertMiniHeader("Log in to Napkin", false);
	phelp.insertBigBreak();
	phelp.insertFullBox(false);
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.insertBottomButtons([["login", ["button", "buttonsubmit"], "Login", "userLoginAction()"], ["create", ["button", "buttonother"], "Create Account", "routePage('#accCreate')"], ["test", ["button", "buttonother"], "adminTest", "routePage('#adminPending')"]]);
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
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "userCreateAction()"], ["tologin", ["button", "buttonother"], "Back to Login", "routePage('#accLogin')"]]);
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
	if (testing) test.testPosts(false);
	pact.feedFill(false);
}

// When you are looking at just your feed.
export function feedMy() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "feedmy");
	phelp.insertNextButton();
	if (testing) test.testPosts(true);
	pact.feedFill(true);
	// true means it's the feedMy page, not the global feed.
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
export async function accBlocked() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
	phelp.insertMiniHeader("Manage Blocked", "blocked");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	if (testing) test.testFriends("blocked");
	phelp.insertText("People I've blocked:")
	await pact.getFriends('rejected')
	phelp.insertText("I'm blocked by:")
	await pact.getFriends('blocked')
}

// When you're searching for a friend.
export function friendSearch() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
	phelp.insertMiniHeader("Search for a New Friend", "blocked");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Search by Name:", "screenname", false);
	phelp.createButton('submit',"Search","")
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Search", "friendSearchAction()"]])
	phelp.insertText("Search Results");

	if (testing) test.testFriends("search");
//	phelp.insertText("Additional Results");
//	if (testing) test.testFriends("search");
}

// When you look at your groups.
export function accGroups() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "groups");
	phelp.insertMiniHeader("Add a group", "addgroup");
	phelp.insertFullBox(true)
	phelp.insertBigBreak()
	phelp.insertText('My groups')
	pact.loadGroupsEntries()

}

export function accAddGroup() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "groups");
	phelp.insertMiniHeader("Add a group", "");
	phelp.insertFullBox()
	phelp.insertBigBreak()
	phelp.insertText('Add a new group');
	phelp.insertInputBox('Group name','group_name',false,false,null)
	phelp.insertRadioInputBox();
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Save new group", `addGroupAction()`], ]);

}

export function accEditGroup() {
	let group_id  = window.payload[0];
	let group_name = window.payload[1];
	let group_ranking = window.payload[2];
	phelp.insertContent();
	phelp.insertHeader(userHeader, "groups");
	phelp.insertMiniHeader("Edit a group", "editgroup");
	phelp.insertBigBreak()
	phelp.insertFullBox()
	phelp.insertText('Edit a group')
	phelp.insertInputBox('Group name','group_name',false,false,group_name);
	phelp.insertRadioInputBox(group_ranking);
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Save changes", `addGroupAction(${group_id})`], ]);

}

// When you edit the groups your friends are in.
export function accFriendGroups() {
	// this kludge gets the friend_id so that we can pass it in.
	let friend_id = document.querySelector('meta[name="friends_payload"]').content;

	phelp.insertContent();
	phelp.insertHeader(userHeader, "groups");
	phelp.insertFullBox(false);
	phelp.insertText('Managing friend #' + friend_id)
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Save changes", `friendGroupsUpdateAction(${friend_id})`], ]);
	pact.loadFriendStats(friend_id);
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
	phelp.insertInputBox("Post content:", "post_content", false, true);
	phelp.getGroupsSelector()
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "postCreateAction()"], ], true);
	pact.createCloudinaryWidget()
}

// When you want to edit a post.
export function postEdit() {
	console.log(window.payload);
	phelp.insertContent();
	phelp.insertHeader(userHeader, "createpost");
	phelp.insertMiniHeader("Editing post number " + window.payload[0]);
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Post title:", "post_title", false, false, window.payload[1]);
	phelp.insertInputBox("Post image URL:", "post_image_url", false, false, window.payload[3]);
	phelp.insertInputBox("Post content:", "post_content", false, true, window.payload[2]);
	phelp.prePopulateSelectorsOnPost(window.payload[0])
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "postCreateAction(" + window.payload[0] + ")"], ["cancel", ["button", "buttonother"], "Cancel", "routePage('#feedGlobal')"]], true);
	pact.createCloudinaryWidget()
}



// When you look at your account settings.
export function accSettings() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "account");
	phelp.insertMiniHeader("Account Settings", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.insertInputBox("Change email:", "email", false);
	phelp.insertInputBox("Change profile picture:", "post_image_url", false);
	phelp.insertInputBox("Change first name:", "firstname", false);
	phelp.insertInputBox("Change last name:", "lastname", false);
	phelp.insertInputBox("Change password:", "password", true);
	phelp.insertInputBox("Confirm password:", "confirm", true);
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit", "updateAccount()"]], true);
	pact.createCloudinaryWidget()
}

// For admins to look at pending accounts.
export function adminPending() {
	const adminPage = "pending";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("New User Requests", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.getAdminUsers(adminPage);
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
	phelp.getAdminUsers(adminPage);
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
	phelp.getAdminUsers(adminPage);
	if (testing) test.testAdmin(adminPage);
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	const adminPage = "blocked";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Blacklisted Emails", "logout");
	phelp.insertBigBreak();
	phelp.insertFullBox(true);
	phelp.getAdminUsers(adminPage);
	if (testing) test.testAdmin(adminPage);
}


