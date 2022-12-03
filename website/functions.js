import * as routes from './routes.js'

export function postCreateAction() {
    let post_title = document.querySelector('#post_title');
    let post_content = document.querySelector('#post_content');
    let post_image = document.querySelector('#post_image');
    let selected  = document.querySelectorAll('#group_selector option:selected');
    let group_ids = Array.from(selected).map(el => el.value);
    
    routes.routePage('#myFeed')
}

