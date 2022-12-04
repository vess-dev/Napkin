import * as help from "./helpers.js";
import * as phelp from "./pageshelpers.js";

// Test posts.
export function testPosts() {
	phelp.insertPost(help.loadImage("test1"), "Post 1", "Will Smith", "Nov 10th 2022", "I am will Smith.", help.loadImage("test1"), 10);
	phelp.insertBigBreak();
	phelp.insertPost(help.loadImage("test2"), "Post 2", "Will Smith", "Nov 10th 2022", ".", help.loadImage("test2"), 20);
	phelp.insertBigBreak();
	phelp.insertPost(help.loadImage("test3"), "Post 3", "Will Smith", "Nov 10th 2022", help.longText(), help.loadImage("test1"), 30);
}

// Test friends.
export function testFriends(friendType) {
	phelp.insertFriendItem(help.loadImage("test1"), "Will Smith", friendType);
}

// Fill the admin pages with bunk data.
export function testAdmin(adminPage) {
	for (let itrFill = 10; itrFill--;) {
		phelp.insertUserItem(help.loadImage("test1"), "Will Smith " + itrFill, "will.smith68@gmail.com", "Nov 10th 2022", adminPage);
	}
}