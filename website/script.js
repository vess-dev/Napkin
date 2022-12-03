import * as page from "./pages.js";
import * as route from "./routes.js";

onPageLoad();
window.routePage = routePage; // This is horrible. I'm sorry. But it works.

function onPageLoad() {
	// Route to the page login if no route is specified.
	if (window.location.hash == "") {
		window.location.hash = route.PAGE_ACC_LOGIN;
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
		case route.PAGE_ACC_LOGIN:
			page.accLogin();
			break;
		case route.PAGE_ACC_CREATE:
			page.accCreate();
			break;
		case route.PAGE_ACC_PENDING:
			page.accPending();
			break;
		case route.PAGE_MY_FEED:
			page.myFeed();
			break;
		case route.PAGE_ACC_FEED:
			page.accFeed();
			break;
		case route.PAGE_ACC_FRIENDS:
			page.accFriends();
			break;
		case route.PAGE_ACC_BLOCKED:
			page.accBlocked();
			break;
		case route.PAGE_SEARCH:
			page.friendSearch();
			break;
		case route.PAGE_ACC_GROUPS:
			page.accGroups();
			break;
		case route.PAGE_POST_CREATE:
			page.postCreate();
			break;
		case route.PAGE_POST_EDIT:
			page.postEdit();
			break;
		case route.PAGE_ACC_SETTINGS:
			page.accSettings();
			break;
		case route.PAGE_ADMIN_PENDING:
			page.adminPending();
			break;
		case route.PAGE_ADMIN_DISABLED:
			page.adminDisabled();
			break;
		case route.PAGE_ADMIN_ACTIVE:
			page.adminActive();
			break;
		case route.PAGE_ADMIN_BLACKLIST:
			page.adminBlacklist();
			break;
		default:
			// If the route is unknown, redirect.
			// TODO: #myFeed routing should kick back to #accLogin if no session cookie exists.
			routePage("#myFeed");
			break;
	}
}