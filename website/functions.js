import * as routes from './routes.js'

export default function postCreateAction() {
    let post_title = document.querySelector('#post_title');
    let post_content = document.querySelector('#post_content');
    let post_image = document.querySelector('#post_image');
    let selected  = document.querySelectorAll('#group_selector option:selected');
    let group_ids = Array.from(selected).map(el => el.value);
    let groupList 
    for (let one of group_ids) {groupList += one+','}

	return new Promise((resolve, reject) => {
		let options = {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json"},
            body: JSON.stringify({
                post_title: post_title,
                post_content: post_content,
                post_image, post_image,
                group_id: groupList
              })
		};
		fetch(routes.SERVER+'post', options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				throw new Error('error', response)
			}
		})
		.then(() => {
            routes.routePage('#myFeed')
			return resolve(true)
		})
		.catch((error) => {
			return reject(error);
		});
	});
}

    


