import * as help from "./helpers.js";
import * as phelp from "./pageshelpers.js";

// Test posts.
export function testPosts() {
	phelp.insertPost(help.loadImage("test1", false), "Post 1", "Will Smith", "Nov 10th 2022", "I am will Smith.", help.loadImage("test1", false), 10, 1);
	phelp.insertBigBreak();
	phelp.insertPost(help.loadImage("test2", false), "Post 2", "Will Smith", "Nov 10th 2022", ".", help.loadImage("test2", false), 20, 3);
	phelp.insertBigBreak();
	phelp.insertPost(help.loadImage("test3", false), "Post 3", "Will Smith", "Nov 10th 2022", help.longText(), help.loadImage("test1", false), 30, 5);
}

// Test friends.
export function testFriends(friendType) {
	phelp.insertFriendItem(help.loadImage("test1", false), "Will Smith", friendType);
}

// Fill the admin pages with bunk data.
export function testAdmin(adminPage) {
	for (let itrFill = 10; itrFill--;) {
		phelp.insertUserItem(help.loadImage("test1", false), "Will Smith " + itrFill, "will.smith68@gmail.com", "Nov 10th 2022", adminPage);
	}
}