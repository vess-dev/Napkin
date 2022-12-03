import * as pages from "./pages.js";
import * as routes from "./routes.js";

onPageLoad();

function onPageLoad() {
	// Route to the page login if no route is specified.
	if (window.location.hash == "") {
		window.location.hash = routes.PAGE_ACC_LOGIN;
	}
	// Route them to the correct page.
	routePage();
}

// Clear the page clean of content.
function clearPage() {
	const contentDOM = document.querySelector("body");
	contentDOM.textContent = "";
}

// If given a page anchor, will load the appropriate page.
// If not passed anything, will look at current URL anchor and load that page.
function routePage(newPage) {
	let currentHash = (newPage ? newPage : window.location.hash);
	if (newPage) {
		history.pushState({}, "", newPage);
	}
	clearPage();
	switch(currentHash) {
		case routes.PAGE_ACC_LOGIN:
			pages.accLogin();
		case routes.PAGE_ACC_CREATE:
			pages.accCreate();
		case routes.PAGE_ACC_PENDING:
			pages.accPending();
		case routes.PAGE_MY_FEED:
			pages.myFeed();
		case routes.PAGE_ACC_FEED:
			pages.accFeed();
		case routes.PAGE_ACC_FRIENDS:
			pages.accFriends();
		case routes.PAGE_ACC_BLOCKED:
			pages.accBlocked();
		case routes.PAGE_SEARCH:
			pages.friendSearch();
		case routes.PAGE_ACC_GROUPS:
			pages.accGroups();
		case routes.PAGE_POST_CREATE:
			pages.postCreate();
		case routes.PAGE_POST_EDIT:
			pages.postEdit();
		case routes.PAGE_ACC_SETTINGS:
			pages.accSettings();
		case routes.PAGE_ADMIN_PENDING:
			pages.adminPending();
		case routes.PAGE_ADMIN_DISABLED:
			pages.adminDisabled();
		case routes.PAGE_ADMIN_ACTIVE:
			pages.adminActive();
		case routes.PAGE_ADMIN_BLACKLIST:
			pages.adminBlacklist();
	}	
}