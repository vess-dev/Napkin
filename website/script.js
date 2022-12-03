import * as routes from "./routes.js"

onPageLoad();

function onPageLoad() {
	console.log(routes);
	routePage();
}

/**
 * If given a page anchor, will load the appropriate page
 * If not passed anything, will look at current URL anchor and load that page
 */ 
function routePage(newPage) {
	const currentHash = (newPage ? newPage : window.location.hash);
	if (newPage) {
		history.pushState({}, "", newPage);
	}
	console.log(currentHash);
}

/**
 * Clear the page clean of content
 */ 
function clearPage() {
	const contentDOM = document.querySelector("body");
	contentDOM.textContent = "";
}