import {Helpers} from "./helpers.js";
import {ClientError} from "./ClientError.js";
import {SERVER, LOGIN_PAGE, GET_POSTS_PAGE} from "./routes-client.js";

export var Posts = {
	POST:"post",

	getPosts:function() {
		return new Promise((resolve, reject) => {
			let options = {
				method: "GET",
				credentials: "include",
				headers: {
				"Content-Type": "application/json"
			  }
			};
		 
			fetch(SERVER + this.POST, options)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				else {
					throw new ClientError("User Error", response.status,"Unable to retrieve users");
				}
			})
			.then((postList) => {
				return resolve(postList)
			})
			.catch((error) => {
				return reject(error);
			});
		});
	},

	/**
	 * 
	 */
	loadListPostsPage:function() {
		const contentDOM = document.querySelector("#content");

		// Get user list
		Posts.getPosts()
		.then(postList => {
			const rowContainerElement = document.createElement("div");
			rowContainerElement.setAttribute("id", "posts_list");
			const tableHeaderElement = document.createElement("h2");
			tableHeaderElement.textContent = "POSTS";
			rowContainerElement.appendChild(tableHeaderElement);
			// Display users in a table
			for (const post of postList) {
				const rowElement = document.createElement("div");
				rowElement.textContent = `${post.post_id} || ${post.post_content} || ${post.post_title}`
				rowContainerElement.appendChild(rowElement);
			}
			contentDOM.appendChild(rowContainerElement); 
		})
		.catch(error => {
			console.error(error.statusCode + " : " + error.message);
			// Unauthorized, so kick user back to login page
			if (error.statusCode && error.statusCode === 401) {
				window.dispatchEvent(new CustomEvent("navigate", {detail: {page: LOGIN_PAGE}, bubbles: true}));
				//Helpers.showNotification(error.message);
				Helpers.showNotification("User not authorized to perform that action");
			}
			else {
				Helpers.showNotification(error.message);
			}
		});
	}
}