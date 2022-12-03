// Insert a content box where... Content is displayed. Haha.
export function insertContent() {
	const elementBody = document.querySelector("body");
	const elementContent = document.createElement("div");
	elementContent.setAttribute("id", "content");
	elementBody.append(elementContent);
}

// Insert the WIDE and full Napkin header.
export function insertHeader(headerList, headerFocus) {
	const elementBody = document.querySelector("body");
	const elementHeader = document.createElement("div");
	elementHeader.setAttribute("id", "header");
	// Create each header button turn by turn.
	for (let itrHeader in headerList) {
		const elementNewHeader = createButton(headerList[itrHeader][0], ["headerbox"], headerList[itrHeader][1], false);
		if (headerFocus == headerList[itrHeader][0]) {
			elementNewHeader.classList.add("colorblue");
		}
		elementHeader.append(elementNewHeader);
	}
	elementBody.append(elementHeader);
	// Move the content below the full header.
	const elementContent = document.getElementById("content");
	elementContent.style.marginTop = "4rem";
}

// A mini header that is not a full header.
export function insertMiniHeader(headerName) {
	const elementContent = document.getElementById("content");
	const elementMiniHeader = document.createElement("div");
	elementMiniHeader.setAttribute("id", "headermini");
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
export function insertFullBox(miniHeader) {
	const elementContent = document.getElementById("content");
	const elementBoxFull = document.createElement("div");
	elementBoxFull.setAttribute("id", "boxfull");
	// Account for a page height difference with a mini header.
	if (miniHeader) {
		elementBoxFull.style.height = "calc(100vh - 13rem)";
	}
	elementContent.append(elementBoxFull);
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
	for (let itrClass in buttonClasses) {
		elementButton.classList.add(buttonClasses[itrClass]);
	}
	elementButton.textContent = buttonText;
	return elementButton;
}

// Add buttons to the bottom of a page.
export function insertBottomButtons(buttonList) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementBottomDiv = document.createElement("div");
	for (let itrButton in buttonList) {
		const elementNewButton = createButton(buttonList[itrButton][0], buttonList[itrButton][1], buttonList[itrButton][2]);
		elementBottomDiv.append(elementNewButton);
	}
	elementBottomDiv.setAttribute("class", "buttonbox");
	elementBoxFull.append(elementBottomDiv);
}

// Add a text content to an element.
export function insertText(divText) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementTextDiv = document.createElement("div");
	elementTextDiv.setAttribute("class", "textdiv");
	elementTextDiv.textContent = divText;
	elementBoxFull.append(elementTextDiv);
}

// Add a next page button to the bottom right of the page.
// Also add the search feed and sort feed buttons.
export function insertDecorations() {
	const elementBody = document.querySelector("body");
	const elementNextButton = createButton("nextpage", ["button", "buttonnext", "buttonsubmit"], "Next Page");
	elementBody.append(elementNextButton);
}

// Add a button to the mini header.
export function insertMiniButton(buttonType) {
	const elementMiniHeader = document.getElementById("headermini");
	let elementNewButton;
	if (buttonType == "logout") {
		elementNewButton = createButton("logout", ["button", "buttonlogout"], "Logout");
	}
	elementMiniHeader.append(elementNewButton);
}

// Create an admin user info div. Picture, name, email, date, item type.
export function insertUserItem(userPicture, userName, userEmail, itemDate, itemType) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementUserDiv = document.createElement("div");
	elementUserDiv.setAttribute("class", "userdiv");
	// Format the user picture with the appropriate class.
	userPicture.setAttribute("class", "userpicture");
	elementUserDiv.append(userPicture);
	// Create a text block for the name and email.
	const elementUserText = document.createElement("div");
	elementUserText.setAttribute("class", "usertext");
	elementUserText.textContent = userName + ", " + userEmail;
	elementUserDiv.append(elementUserText);
	// Create a text block for the date info.
	const elementUserDate = document.createElement("div");
	elementUserDate.setAttribute("class", "usertext");
	let finalText = "";
	switch(itemType) {
		case "pending":
			finalText = "Created on: ";
			break;
		case "disabled":
			finalText = "Disabled on: ";
			break;
		case "active":
			finalText = "Approved on: ";
			break;
		case "blacklist":
			finalText = "Blacklisted on: ";
			break;
	}
	finalText += itemDate;
	elementUserDate.textContent = finalText;
	elementUserDiv.append(elementUserDate);
	elementBoxFull.append(elementUserDiv);
}