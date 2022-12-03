
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
}

// When you are looking at the JUST YOU feed.
export function accFeed() {
	insertNapkinHeader();
}

// When you look at your list of friends.
export function accFriends() {
	insertNapkinHeader();
}

// When you look at who you have blocked.
export function accBlocked() {
	insertNapkinHeader();
}

// When you're searching for a friend.
export function friendSearch() {
	insertNapkinHeader();
}

// When you look at your groups.
export function accGroups() {
	insertNapkinHeader();
}

// When you want to create a post.
export function postCreate() {
	insertNapkinHeader();
}

// When you want to edit a post.
export function postEdit() {
	insertNapkinHeader();
}

// When you look at your account settings.
export function accSettings() {
	insertNapkinHeader();
}

// For admins to look at pending accounts.
export function adminPending() {
	console.log("Pending");
}

// For admins to look at disabled accounts.
export function adminDisabled() {
	console.log("Disabled");
}

// For admins to look at active accounts.
export function adminActive() {
	console.log("Active");
}

// For admins to look at blacklisted accounts.
export function adminBlacklist() {
	console.log("Blacklist");
}