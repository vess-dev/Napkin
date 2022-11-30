export var Helpers = {
	ERROR: "error",

	toggleMenu:function() {
		const menuElement = document.querySelector("#menu");
		if (menuElement.classList.contains("hidden")) {
			menuElement.classList.remove("hidden");
		}
		else {
			menuElement.classList.add("hidden");
		}

	},

	/**
	 *  Displays a notification message
	 */
	showNotification:function (message, type) {
		const navHookElement = document.querySelector("#notification_hook");
		const navSpan = document.querySelector("#notification_hook span");
		navSpan.textContent = message;

		const errorIconElement = document.querySelector("#error_icon");
		if (type === this.ERROR) {		
			errorIconElement.classList.remove("hidden");
		}
		else {
			errorIconElement.classList.add("hidden");
		}

		navHookElement.classList.remove("hidden");

		setTimeout(this.hideNotification, 5000);
	},

	/**
	 * Hides notification and resets icon
	 */
	hideNotification:function () {
		const navHookElement = document.querySelector("#notification_hook");
		navHookElement.classList.add("hidden");

		// Reset icon
		const errorIconElement = document.querySelector("#error_icon");
		errorIconElement.classList.add("hidden");
	},

	/**
	 * Given a label and an id, creates a text input field with the label, assigns the id
	 *  to the field, groups them both in a div and returns that div
	 */
	createField:function (label, id) {
		const fieldElement = document.createElement("div");

		const labelElement = document.createElement("label");
		labelElement.textContent = label;
		labelElement.setAttribute("for", id);
		fieldElement.appendChild(labelElement);

		const inputElement = document.createElement("input");
		inputElement.setAttribute("type", "text");
		inputElement.setAttribute("name", id);
		inputElement.setAttribute("id", id);
		fieldElement.appendChild(inputElement);

		return fieldElement;
	}
};