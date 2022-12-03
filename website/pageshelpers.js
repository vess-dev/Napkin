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
		const elementNewHeader = createButton(headerList[itrHeader][0], ["headerbox"], headerList[itrHeader][1], headerList[itrHeader][2]);
		if (headerFocus == headerList[itrHeader][0]) {
			elementNewHeader.classList.add("colorblue");
		}
		elementHeader.append(elementNewHeader);
	}
	elementBody.append(elementHeader);
	// Move the content below the full header.
	const elementContent = document.getElementById("content");
	elementContent.style.marginTop = "4.5rem";
}

// A mini header that is not a full header.
export function insertMiniHeader(headerName, buttonType) {
	const elementContent = document.getElementById("content");
	const elementMiniHeader = document.createElement("div");
	elementMiniHeader.setAttribute("id", "headermini");
	const elementMiniDiv = document.createElement("div");
	elementMiniDiv.setAttribute("id", "minidiv");
	const elementMiniText = document.createElement("div");
	elementMiniText.textContent = headerName;
	elementMiniDiv.append(elementMiniText);
	// Create buttons only on a button type.
	if (buttonType) {
		const elementButtonBox = document.createElement("div");
		elementButtonBox.setAttribute("class", "buttonbox");
		switch (buttonType) {
			case "logout":
				const elementButtonLogout = createButton("logout", ["button", "buttonred"], "Logout", "routePage('#accLogin')");
				elementButtonBox.append(elementButtonLogout);
				break;
			case "manage":
				const elementButtonBlocked= createButton("blocked", ["button", "buttonblue"], "Manage Blocked", "routePage('#accBlocked')");
				elementButtonBox.append(elementButtonBlocked);
				const elementButtonSearch= createButton("search", ["button", "buttonblue"], "Search for Friend", "routePage('#friendSearch')");
				elementButtonBox.append(elementButtonSearch);
				break;

		}
		elementMiniDiv.append(elementButtonBox);
	}
	
	elementMiniHeader.append(elementMiniDiv);
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
		elementBoxFull.style.height = "calc(100vh - 15rem)";
	}
	elementContent.append(elementBoxFull);
}

// A div that has text on the left, and an input box on the right.
export function insertInputBox(inputText, inputName, inputPassword) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementInputFull = document.createElement("div");
	elementInputFull.setAttribute("class", "inputbox");
	elementInputFull.textContent = inputText;
	const elementInputField = document.createElement("input");
	elementInputField.setAttribute("class", "inputfield");
	elementInputField.setAttribute("id", inputName);
	// If the input should hide a password.
	if (inputPassword) {
		elementInputField.setAttribute("type", "password");
	}
	elementInputFull.append(elementInputField);
	elementBoxFull.append(elementInputFull);
}

// Create and add different button types.
export function createButton(buttonId, buttonClasses, buttonText, buttonCall) {
	const elementButton = document.createElement("button");
	elementButton.setAttribute("id", buttonId);
	for (let itrClass in buttonClasses) {
		elementButton.classList.add(buttonClasses[itrClass]);
	}
	elementButton.textContent = buttonText;
	elementButton.setAttribute("onclick", buttonCall);
	return elementButton;
}

// Add buttons to the bottom of a page.
export function insertBottomButtons(buttonList) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivBottom = document.createElement("div");
	for (let itrButton in buttonList) {
		const elementNewButton = createButton(buttonList[itrButton][0], buttonList[itrButton][1], buttonList[itrButton][2], buttonList[itrButton][3]);
		elementDivBottom.append(elementNewButton);
	}
	elementDivBottom.setAttribute("class", "buttonbottom");
	elementBoxFull.append(elementDivBottom);
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
export function insertNextButton() {
	const elementBody = document.querySelector("body");
	const elementNextButton = createButton("nextpage", ["button", "buttonnext", "buttonsubmit"], "Next Page", "TODONEXTPAGE");
	elementBody.append(elementNextButton);
}

// Create a friend user info div. Picture, name, and type.
export function insertFriendItem(userPicture, userName, itemType) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivFriend = document.createElement("div");
	elementDivFriend.setAttribute("class", "userdiv");
	// Format the user picture with the appropriate class.
	userPicture.setAttribute("class", "userpicture");
	elementDivFriend.append(userPicture);
	// Create a text block for the name.
	const elementUserName = document.createElement("div");
	elementUserName.setAttribute("id", "username");
	elementUserName.setAttribute("class", "usertext");
	elementUserName.textContent = userName;
	elementDivFriend.append(elementUserName);
	// Setup the buttons properly.
	const elementButtonBox = document.createElement("div");
	elementButtonBox.setAttribute("class", "buttonbox");
	switch (itemType) {
		case "current":
			const elementButtonRemove = createButton("remove", ["button", "buttonred"], "Remove", "TODOREMOVE");
			elementButtonBox.append(elementButtonRemove);
			break;
		case "outgoing":
			const elementButtonCancel = createButton("cancel", ["button", "buttonred"], "Cancel Request", "TODOCANCEL");
			elementButtonBox.append(elementButtonCancel);
			break;
		case "incoming":
			const elementButtonApprove = createButton("approve", ["button", "buttongreen"], "Approve", "TODOAPPROVE");
			elementButtonBox.append(elementButtonApprove);
			const elementButtonDecline = createButton("decline", ["button", "buttonred"], "Decline", "TODODECLINE");
			elementButtonBox.append(elementButtonDecline);
			break;
		case "blocked":
			break;
		case "search":
			break;
	}
	elementDivFriend.append(elementButtonBox);
	elementBoxFull.append(elementDivFriend);
}

// Create an admin user info div. Picture, name, email, date, item type.
export function insertUserItem(userPicture, userName, userEmail, itemDate, itemType) {
	const elementBoxFull = document.getElementById("boxfull");
	const elementDivUser = document.createElement("div");
	elementDivUser.setAttribute("class", "userdiv");
	// Format the user picture with the appropriate class.
	userPicture.setAttribute("class", "userpicture");
	elementDivUser.append(userPicture);
	// Create a text block for the name.
	const elementUserName = document.createElement("div");
	elementUserName.setAttribute("id", "username");
	elementUserName.setAttribute("class", "usertext");
	elementUserName.textContent = userName;
	elementDivUser.append(elementUserName);
	// Create a text block for the email.
	const elementUserEmail = document.createElement("div");
	elementUserEmail.setAttribute("id", "useremail");
	elementUserEmail.setAttribute("class", "usertext");
	elementUserEmail.textContent = userEmail;
	elementDivUser.append(elementUserEmail);
	// Create a text block for the date info.
	const elementUserDate = document.createElement("div");
	elementUserDate.setAttribute("class", "usertext date");
	// Setup the buttons properly, along with the date text.
	const elementButtonBox = document.createElement("div");
	elementButtonBox.setAttribute("class", "buttonbox");
	let finalText = "";
	switch (itemType) {
		case "pending":
			finalText = "Created on: ";
			const elementButtonApprove = createButton("approve", ["button", "buttongreen"], "Approve", "TODOAPPROVE");
			elementButtonBox.append(elementButtonApprove);
			const elementButtonDecline = createButton("decline", ["button", "buttonred"], "Decline", "TODODECLINE");
			elementButtonBox.append(elementButtonDecline);
			break;
		case "disabled":
			finalText = "Disabled on: ";
			const elementButtonEnable = createButton("enable", ["button", "buttongreen"], "Enable", "TODOENABLE");
			elementButtonBox.append(elementButtonEnable);
			break;
		case "active":
			finalText = "Approved on: ";
			const elementButtonDisable = createButton("disable", ["button", "buttonred"], "Disable", "TODODISABLE");
			elementButtonBox.append(elementButtonDisable);
			break;
		case "blacklist":
			finalText = "Blacklisted on: ";
			const elementButtonUnblack = createButton("unblacklist", ["button", "buttongreen"], "Unblacklist", "TODOUNBLACKLIST");
			elementButtonBox.append(elementButtonUnblack);
			break;
	}
	finalText += itemDate;
	elementUserDate.textContent = finalText;
	elementDivUser.append(elementUserDate);
	elementDivUser.append(elementButtonBox);
	elementBoxFull.append(elementDivUser);
}