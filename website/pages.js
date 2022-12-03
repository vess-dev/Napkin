import * as phelp from "./pageshelpers.js";
import * as test from "./helpers.js";

const userHeader = [["home", "Napkin", "routePage('#myFeed')"], ["myfeed", "My Feed", "routePage('#myFeed')"], ["addpost", "Add a Post", "routePage('#postCreate')"], ["friends", "Friends", "routePage('#accFriends')"], ["groups", "Groups", "routePage('#accGroups')"], ["account", "My Account", "routePage('#accFeed')"]]
const adminHeader = [["pending", "Pending Accounts", "routePage('#adminPending')"], ["disabled", "Disabled Accounts", "routePage('#adminDisabled')"], ["active", "Active Accounts", "routePage('#adminActive')"], ["blacklist", "Blacklisted Accounts", "routePage('#adminBlacklist')"]];

const testImage = test.loadImage("./assets/test.jpg");

// Always insert the content box first,
// And then the header type.

// When you need to login to Napkin.
export function accLogin() {
	phelp.insertContent();
	phelp.insertMiniHeader("Log in to Napkin");
	phelp.insertBigBreak();
	phelp.insertBoxFull(false);
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.insertBottomButtons([["login", ["button", "buttonsubmit"], "Login"], ["create", ["button", "buttonother"], "Create Account"]]);
}

// When you are creating an account.
export function accCreate() {
	phelp.insertContent();
	phelp.insertMiniHeader("Create a Napkin Account");
	phelp.insertBigBreak();
	phelp.insertBoxFull(false);
	phelp.insertInputBox("User first name:", "firstname", false);
	phelp.insertInputBox("User last name:", "lastname", false);
	phelp.insertInputBox("User screen name:", "screenname", false);
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.insertInputBox("Confirm password:", "confirm", true);
	phelp.insertBottomButtons([["submit", ["button", "buttonsubmit"], "Submit"], ["tologin", ["button", "buttonother"], "Back to Login"]]);
}

// When your account is now pending.
export function accPending() {
	phelp.insertContent();
	phelp.insertMiniHeader("Account Approval Pending");
	phelp.insertBigBreak();
	phelp.insertBoxFull(false);
	phelp.insertText("Your account is still waiting for approval!");
	phelp.insertText("Please check back later.");
	phelp.insertBottomButtons([["tologin", ["button", "buttonother"], "Back to Login"]]);
}

// When you are looking at the ALL feed.
export function myFeed() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "myfeed");
	phelp.insertDecorations();
}

// When you are looking at the JUST YOU feed.
export function accFeed() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "account");
}

// When you look at your list of friends.
export function accFriends() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
}

// When you look at who you have blocked.
export function accBlocked() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
}

// When you're searching for a friend.
export function friendSearch() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "friends");
}

// When you look at your groups.
export function accGroups() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "groups");
}

// When you want to create a post.
export function postCreate() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "addpost");
}

// When you want to edit a post.
export function postEdit() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "addpost"); // Should this be on addpost for editpost?
}

// When you look at your account settings.
export function accSettings() {
	phelp.insertContent();
	phelp.insertHeader(userHeader, "account");
}

// For admins to look at pending accounts.
export function adminPending() {
	const adminPage = "pending";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("New User Requests");
	phelp.insertMiniButton("logout");
	phelp.insertBigBreak();
	phelp.insertBoxFull(true);
	phelp.insertUserItem(testImage, "Will Smith", "will.smith68@gmail.com", "Nov 10th 2022", adminPage);
}

// For admins to look at disabled accounts.
export function adminDisabled() {
	const adminPage = "disabled";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Disabled Accounts");
	phelp.insertMiniButton("logout");
	phelp.insertBigBreak();
	phelp.insertBoxFull(true);
	phelp.insertUserItem(testImage, "Will Smith", "will.smith68@gmail.com", "Nov 10th 2022", adminPage);
}

// For admins to look at active accounts.
export function adminActive() {
	const adminPage = "active";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Active Accounts");
	phelp.insertMiniButton("logout");
	phelp.insertBigBreak();
	phelp.insertBoxFull(true);
	phelp.insertUserItem(testImage, "Will Smith", "will.smith68@gmail.com", "Nov 10th 2022", adminPage);
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	const adminPage = "blacklist";
	phelp.insertContent();
	phelp.insertHeader(adminHeader, adminPage);
	phelp.insertMiniHeader("Blacklisted Emails");
	phelp.insertMiniButton("logout");
	phelp.insertBigBreak();
	phelp.insertBoxFull(true);
	phelp.insertUserItem(testImage, "Will Smith", "will.smith68@gmail.com", "Nov 10th 2022", adminPage);
}