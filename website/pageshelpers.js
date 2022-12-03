// Insert the WIDE and full Napkin header.
export function insertNapkinHeader() {
	const elementBody = document.querySelector("body");
	const elementHeader = document.createElement("div");
	elementHeader.setAttribute("id", "header");
	const listHeaders = [["home", "Napkin"], ["myfeed", "My Feed"], ["addpost", "Add a Post"], ["friends", "Friends"], ["groups", "Groups"], ["account", "My Account"]];
	// Create each header item box by box.
	for (let itr_header in listHeaders) {
		const elementNewHeader = document.createElement("div");
		elementNewHeader.setAttribute("class", "headerbox");
		elementNewHeader.setAttribute("id", listHeaders[itr_header][0]);
		elementNewHeader.textContent = listHeaders[itr_header][1];
		elementHeader.append(elementNewHeader);
	}
	elementBody.append(elementHeader);
	// Move the content below the full header.
	const elementContent = document.getElementById("content");
	elementContent.style.paddingTop = "6rem";
}

// Set the current header to be highlighted.
export function highlightHeader(elementId) {
	const elementBox = document.getElementById(elementId);
	elementBox.style.backgroundColor = "DodgerBlue";
}

// A mini header that is not a full header.
export function insertMiniHeader(headerName) {
	const elementBody = document.querySelector("body");
	const elementContent = document.createElement("div");
	elementContent.setAttribute("id", "content");
	const elementMiniHeader = document.createElement("div");
	elementMiniHeader.setAttribute("class", "headermini");
	elementMiniHeader.textContent = headerName;
	elementContent.append(elementMiniHeader);
	elementBody.append(elementContent);
}

// Add a small break between content.
export function insertBreak() {
	const elementContent = document.getElementById("content");
	const elementBreak = document.createElement("div");
	elementBreak.setAttribute("class", "break");
	//elementContent.append()
}