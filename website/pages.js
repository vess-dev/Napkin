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

export function accLogin() {
	console.log("Login");
}

export function accCreate() {
	console.log("Create");
}

export function accPending() {
	console.log("Pending");
}

export function myFeed() {
	insertNapkinHeader();
}

export function accFeed() {
	insertNapkinHeader();
}

export function accFriends() {
	insertNapkinHeader();
}

export function accBlocked() {
	insertNapkinHeader();
}

export function friendSearch() {
	insertNapkinHeader();
}

export function accGroups() {
	insertNapkinHeader();
}

export function postCreate() {
	insertNapkinHeader();
}

export function postEdit() {
	insertNapkinHeader();
}

export function accSettings() {
	insertNapkinHeader();
}

export function adminPending() {
	console.log("Pending");
}

export function adminDisabled() {
	console.log("Disabled");
}

export function adminActive() {
	console.log("Active");
}

export function adminBlacklist() {
	console.log("Blacklist");
}