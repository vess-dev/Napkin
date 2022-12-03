// Insert a content box where... Content is displayed. Haha.
export function insertContent() {
	const elementBody = document.querySelector("body");
	const elementContent = document.createElement("div");
	elementContent.setAttribute("id", "content");
	elementBody.append(elementContent);
}

// Insert the WIDE and full Napkin header.
export function insertNapkinHeader(headerFocus) {
	const elementBody = document.querySelector("body");
	const elementHeader = document.createElement("div");
	elementHeader.setAttribute("id", "header");
	const listHeaders = [["home", "Napkin"], ["myfeed", "My Feed"], ["addpost", "Add a Post"], ["friends", "Friends"], ["groups", "Groups"], ["account", "My Account"]];
	// Create each header button turn by turn.
	for (let itr_header in listHeaders) {
		const elementNewHeader = createButton(listHeaders[itr_header][0], ["headerbox"], listHeaders[itr_header][1], false);
		if (headerFocus == listHeaders[itr_header][0]) {
			elementNewHeader.classList.add("colorblue");
		}
		elementHeader.append(elementNewHeader);
	}
	elementBody.append(elementHeader);
	// Move the content below the full header.
	const elementContent = document.getElementById("content");
	elementContent.style.paddingTop = "6rem";
}

// A mini header that is not a full header.
export function insertMiniHeader(headerName) {
	const elementContent = document.getElementById("content");
	const elementMiniHeader = document.createElement("div");
	elementMiniHeader.setAttribute("class", "headermini");
	elementMiniHeader.textContent = headerName;
	elementContent.append(elementMiniHeader);
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

// A div that has text on the left, and an input box on the right.
export function insertInputBox(inputText, inputName, inputPassword) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementFullInput = document.createElement("div");
	elementFullInput.setAttribute("class", "inputbox");
	elementFullInput.textContent = inputText;
	const elementFieldInput = document.createElement("input");
	elementFieldInput.setAttribute("class", "inputfield");
	elementFieldInput.setAttribute("id", inputName);
	// If the input should hide a password.
	if (inputPassword) {
		elementFieldInput.setAttribute("type", "password");
	}
	elementFullInput.append(elementFieldInput);
	elementBoxFull.append(elementFullInput);
}

// Create and add different button types.
export function createButton(buttonId, buttonClasses, buttonText) {
	const elementButton = document.createElement("button");
	elementButton.setAttribute("id", buttonId);
	for (let itr_class in buttonClasses) {
		elementButton.classList.add(buttonClasses[itr_class]);
	}
	elementButton.textContent = buttonText;
	return elementButton;
}

// Add buttons to the bottom of a page.
export function bottomButtons(buttonList) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementBottomDiv = document.createElement("div");
	for (let itr_button in buttonList) {
		const elementNewButton = createButton(buttonList[itr_button][0], buttonList[itr_button][1], buttonList[itr_button][2]);
		elementBottomDiv.append(elementNewButton);
	}
	elementBottomDiv.setAttribute("class", "buttonbox");
	elementBoxFull.append(elementBottomDiv);
}