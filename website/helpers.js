// Make an asset path.
export function pathImage(imageName) {
	return "./assets/" + imageName + ".png";
}

// Load an image to use.
export function loadImage(imageName) {
	let imagePath = pathImage(imageName);
	if (!imagePath) {return null } else {
		const elementImage = document.createElement("img");
		elementImage.setAttribute("src", imagePath);
		return elementImage;
	}
}
// note to Vess - post image URLs are absolute, not relative.  Going to run loadPostImage on feed drawing to 
// avoid breaking your relative images elsewhere. -C
// in hindsight, I guess naming could have been better! :)

export function loadPostImage(imageURL) {
	if (!imageURL) {return null } else {
		const elementImage = document.createElement("img");
		elementImage.setAttribute("src", imageURL);
		return elementImage;
	}
}

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
	window.alert(woopsText);
}