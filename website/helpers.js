// Load an image to use.
export function loadImage(imagePath) {
	const elementImage = document.createElement("img");
	elementImage.setAttribute("src", imagePath)
	return elementImage;
}