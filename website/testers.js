import * as help from "./helpers.js";
import * as phelp from "./pageshelpers.js";

// Test posts.
export function testPosts() {
	phelp.insertPost(help.loadImage("./assets/test1.jpg"), "Post 1", "Will Smith", "Nov 10th 2022", "I am will Smith.", help.loadImage("./assets/test1.jpg"), 10);
	phelp.insertBigBreak();
	phelp.insertPost(help.loadImage("./assets/test2.jpg"), "Post 2", "Will Smith", "Nov 10th 2022", ".", help.loadImage("./assets/test2.jpg"), 20);
	phelp.insertBigBreak();
	phelp.insertPost(help.loadImage("./assets/test3.jpg"), "Post 3", "Will Smith", "Nov 10th 2022", help.longText(), help.loadImage("./assets/test3.jpg"), 30);
}