import * as phelp from "./pageshelpers.js";

// Always insert the content box first,
// And then the header type.

// When you need to login to Napkin.
export function accLogin() {
	phelp.insertContent();
	phelp.insertMiniHeader("Log in to Napkin");
	phelp.insertBigBreak();
	phelp.insertFullBox();
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.bottomButtons([["submit", ["button", "buttonsubmit"], "Submit"], ["create", ["button", "buttonother"], "Create Account"]]);
}

// When you are creating an account.
export function accCreate() {
	phelp.insertContent();
	phelp.insertMiniHeader("Create a Napkin Account");
	phelp.insertBigBreak();
	phelp.insertFullBox();
	phelp.insertInputBox("User first name:", "firstname", false);
	phelp.insertInputBox("User last name:", "lastname", false);
	phelp.insertInputBox("User screen name:", "screenname", false);
	phelp.insertInputBox("User email:", "email", false);
	phelp.insertInputBox("User password:", "password", true);
	phelp.insertInputBox("Confirm password:", "password", true);
}

// When your account is now pending.
export function accPending() {
	console.log("Pending");
}

// When you are looking at the ALL feed.
export function myFeed() {
	phelp.insertContent();
	phelp.insertNapkinHeader("myfeed");
}

// When you are looking at the JUST YOU feed.
export function accFeed() {
	phelp.insertContent();
	phelp.insertNapkinHeader("account");
}

// When you look at your list of friends.
export function accFriends() {
	phelp.insertContent();
	phelp.insertNapkinHeader("friends");
}

// When you look at who you have blocked.
export function accBlocked() {
	phelp.insertContent();
	phelp.insertNapkinHeader("friends");
}

// When you're searching for a friend.
export function friendSearch() {
	phelp.insertContent();
	phelp.insertNapkinHeader("friends");
}

// When you look at your groups.
export function accGroups() {
	phelp.insertContent();
	phelp.insertNapkinHeader("groups");
}

// When you want to create a post.
export function postCreate() {
	phelp.insertContent();
	phelp.insertNapkinHeader("addpost");
}

// When you want to edit a post.
export function postEdit() {
	phelp.insertContent();
	phelp.insertNapkinHeader("addpost"); // Should this be on addpost for editpost?
}

// When you look at your account settings.
export function accSettings() {
	phelp.insertContent();
	phelp.insertNapkinHeader("account");
}

// For admins to look at pending accounts.
export function adminPending() {
	//phelp.highlightItem("pending");
}

// For admins to look at disabled accounts.
export function adminDisabled() {
	//phelp.highlightItem("disabled");
}

// For admins to look at active accounts.
export function adminActive() {
	//phelp.highlightItem("active");
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	//phelp.highlightItem("blacklist");
}