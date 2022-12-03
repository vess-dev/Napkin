
// Insert the WIDE and full Napkin header.
function insertNapkinHeader() {
	const elementBody = document.querySelector("body");
	const elementHeader = document.createElement("div");
	elementHeader.setAttribute("id", "header");
	const listHeaders = [["home", "Napkin"], ["myfeed", "My Feed"], ["addpost", "Add a Post"], ["friends", "Friends"], ["groups", "Groups"], ["account", "My Account"]];
	for (let itr_header in listHeaders) {
		const elementNewHeader = document.createElement("div");
		elementNewHeader.setAttribute("class", "headerbox");
		elementNewHeader.setAttribute("id", listHeaders[itr_header][0]);
		elementNewHeader.textContent = listHeaders[itr_header][1];
		elementHeader.append(elementNewHeader);
	}
	elementBody.append(elementHeader);
}

// Set the current header to be highlighted.
function highlightHeader(elementId) {
	const elementBox = document.getElementById(elementId);
	elementBox.style.backgroundColor = "DodgerBlue";
}

// When you need to login to Napkin.
export function accLogin() {
	console.log("Login");
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
	insertNapkinHeader();
	highlightHeader("myfeed");
}

// When you are looking at the JUST YOU feed.
export function accFeed() {
	insertNapkinHeader();
	highlightHeader("account");
}

// When you look at your list of friends.
export function accFriends() {
	insertNapkinHeader();
	highlightHeader("friends");
}

// When you look at who you have blocked.
export function accBlocked() {
	insertNapkinHeader();
	highlightHeader("friends");
}

// When you're searching for a friend.
export function friendSearch() {
	insertNapkinHeader();
	highlightHeader("friends");
}

// When you look at your groups.
export function accGroups() {
	insertNapkinHeader();
	highlightHeader("groups");
}

// When you want to create a post.
export function postCreate() {
	insertNapkinHeader();
	highlightHeader("addpost");
}

// When you want to edit a post.
export function postEdit() {
	insertNapkinHeader();
	highlightHeader("addpost"); // Should this be on addpost for editpost?
}

// When you look at your account settings.
export function accSettings() {
	insertNapkinHeader();
	highlightHeader("account");
}

// For admins to look at pending accounts.
export function adminPending() {
	highlightHeader("pending");
}

// For admins to look at disabled accounts.
export function adminDisabled() {
	highlightHeader("disabled");
}

// For admins to look at active accounts.
export function adminActive() {
	highlightHeader("active");
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	highlightHeader("blacklist");
}