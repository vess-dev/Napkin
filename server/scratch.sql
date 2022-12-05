select users.user_handle, users.user_image, post_timestamp, posts.post_id, 
     post_title, post_content, post_image, post_likes_score, post_comment_count   
     from posts 
     inner join users on posts.user_id=users.user_id 
     where posts.user_id= 1
     order by post_timestamp desc