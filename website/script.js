import * as routes from "./routes.js"

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
	switch(currentHash) {
		case HOME_PAGE:
			loadHomePage();
			break;
		case ADD_USER_PAGE:
			Users.loadAddUserPage();
			break;
		case LIST_USERS_PAGE:
			Users.loadListUsersPage();
			break;	
		case GET_POSTS_PAGE:
			console.log("asked for post page")
			Posts.loadListPostsPage();
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