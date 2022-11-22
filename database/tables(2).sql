create table posts(

post_id char(32),
post_title char(34),
post_content varchar(0 to 65500),
post_image varchar(0 to 65500),
post_likes_score int(-2147483648 to 2147483648),
post_comments_count int(-2147483648 to 2147483648),
post_visible bool(0 false, any non zero int is true), 
primary key(post_id)
);
