import * as phelp from "./pageshelpers.js";

// When you need to login to Napkin.
export function accLogin() {
	phelp.insertMiniHeader("Log in to Napkin");
}

// When you are creating an account.
export function accCreate() {
	console.log("Create");
}

// When your account is now pending.
export function accPending() {
	console.log("Pending");
}

// When you are looking at the ALL feed.
export function myFeed() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("myfeed");
}

// When you are looking at the JUST YOU feed.
export function accFeed() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("account");
}

// When you look at your list of friends.
export function accFriends() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("friends");
}

// When you look at who you have blocked.
export function accBlocked() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("friends");
}

// When you're searching for a friend.
export function friendSearch() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("friends");
}

// When you look at your groups.
export function accGroups() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("groups");
}

// When you want to create a post.
export function postCreate() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("addpost");
}

// When you want to edit a post.
export function postEdit() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("addpost"); // Should this be on addpost for editpost?
}

// When you look at your account settings.
export function accSettings() {
	phelp.insertNapkinHeader();
	phelp.highlightHeader("account");
}

// For admins to look at pending accounts.
export function adminPending() {
	phelp.highlightHeader("pending");
}

// For admins to look at disabled accounts.
export function adminDisabled() {
	phelp.highlightHeader("disabled");
}

// For admins to look at active accounts.
export function adminActive() {
	phelp.highlightHeader("active");
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	phelp.highlightHeader("blacklist");
}