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
	const elementHeaderItem = document.getElementById(elementId);
	elementHeaderItem.style.backgroundColor = "dodgerblue";
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
export function insertBigBreak() {
	const elementContent = document.getElementById("content");
	const elementBigBreak = document.createElement("div");
	elementBigBreak.setAttribute("class", "bigbreak");
	elementContent.append(elementBigBreak);
}

// A box for content that almost hits the bottom height.
export function insertFullBox() {
	const elementContent = document.getElementById("content");
	const elementFullBox = document.createElement("div");
	elementFullBox.setAttribute("id", "boxfull");
	elementContent.append(elementFullBox);
}