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

// If given a page anchor, will load the appropriate page.
// If not passed anything, will look at current URL anchor and load that page.
function routePage(newPage) {
	let currentHash = (newPage ? newPage : window.location.hash);
	if (newPage) {
		history.pushState({}, "", newPage);
	}
	//clearPage();
	switch(currentHash) {
		case routes.PAGE_ACC_LOGIN:
			break;
		case routes.PAGE_ACC_CREATE:
			break;
		case routes.PAGE_ACC_PENDING:
			break;
		case routes.PAGE_MY_FEED:
			break;
		case routes.PAGE_ACC_FEED:
			break;
		case routes.PAGE_ACC_FRIENDS:
			break;
		case routes.PAGE_ACC_BLOCKED:
			break;
		case routes.PAGE_SEARCH:
			break;
		case routes.PAGE_ACC_GROUPS:
			break;
		case routes.PAGE_POST_CREATE:
			break;
		case routes.PAGE_POST_EDIT:
			break;
		case routes.PAGE_ACC_SETTINGS:
			break;
		case routes.PAGE_ADMIN_PENDING:
			break;
		case routes.PAGE_ADMIN_DISABLED:
			break;
		case routes.PAGE_ADMIN_ACTIVE:
			break;
		case routes.PAGE_ADMIN_BLACKLIST:
			break;
		default:
			loadLoginPage();
	}	
}

// Clear the page clean of content.
function clearPage() {
	const contentDOM = document.querySelector("body");
	contentDOM.textContent = "";
}