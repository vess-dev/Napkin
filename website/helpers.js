// Make an asset path.
export function pathImage(imageName) {
	return "http://cpsc.roanoke.edu/~napkin/assets/" + imageName + ".png";
}

// Load an image to use.
export function loadImage(imageName, isURL, altImage) {
	if (!altImage) {altImage = "profile"}
	let imagePath;
	
	if (!isURL) imagePath = pathImage(imageName);
	else imagePath = imageName;
	if (!imagePath) {imagePath = pathImage(altImage)};
	
	const elementImage = document.createElement("img");
	elementImage.setAttribute("src", imagePath);
	return elementImage;
	
}
// Note to C: This should work?  Note to V - I think I made it better? You were sometimes returning the url instead of the element? -C

// Return a long string of text.
export function longText() {
	return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}

// Sample client error class from Phil.
export class clientError extends Error {
	constructor (name, statusCode, description) {
		super(description)
		Object.setPrototypeOf(this, new.target.prototype)
		this.name = name
		this.statusCode = statusCode
		Error.captureStackTrace(this)
	}
}

// Simple error window. Fix later?
export function woops(woopsText) {
	window.alert("Error: " + woopsText);
}