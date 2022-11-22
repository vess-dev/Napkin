create table users(
user_id char(32),
user_first_name char(64),
user_last_name char(64),
user_email char(64),
user_password char(32),
user_handle char(32),
user_status char(16),
primary key(user_id)
);



create table posts(
post_id char(32),
post_title char(34),
post_content varchar(0 to 65500),
post_image varchar(0 to 65500),
post_likes_score int(-2147483648 to 2147483648),
post_comments_count int(-2147483648 to 2147483648),
post_visible bool(0 false, any non zero int is true), 
primary key(post_id)
comment_id char(32),
commenter_id char(32),
comment_content varchar(0 to 65500),
comment_timestamp timestamp(1985-09-25 17:45:30.005),
);

create table group_memberships(
group_id char(32),
owner_id char(32),
group_name char(34),
group_ranking int(1 to 5),
primary key(group_id)
);

create table post_groups(
group_id char(32),
post_id char(32),
poster_id char(32)
owner_id char(32),
group_name char(34),
group_ranking int(1 to 5),
post_title char(64),
post_content varchar(0 to 65500),
post_image varchar(0 to 655000), 
comment_id char(32),
commenter_id char(32),
comment_content varchar(0 to 65500),
comment_timestamp timestamp(1985-09-25 17:45:30.005),
reaction_id int(0 to 1),
post_weight int(0 to MAX),
primary key (group_id)
);  
  
create table friendships(
friend_id char(32),
friendship_status enum('nominal', 'accepted', 'pending', 'blocked', 'unblocked'),
friend_request_timestamp(1985-09-25 17:45:30.005),
primary key(friend_id)
);

create table reactions(
reaction_id int(0 to 1),
post_weight int(0 to MAX),
primary key(reaction_id)
);

create table comments(
comment_id char(32),
commenter_id char(32),
comment_content varchar(0 to 65500),
comment_timestamp timestamp(1985-09-25 17:45:30.005),
reaction_id int(0 to 1),
post_weight int(0 to MAX),
primary_key(comment_id)
);

create table sessions(
session_id char(32),
primary key(session_id)
);


create table posts_feed(
post_id char(32),
session_id char(32),
comment_id char(32),
commenter_id char(32),
comment_content varchar(0 to 65500),
comment_timestamp timestamp(1985-09-25 17:45:30.005),
post_title char(34),
post_content varchar(0 to 65500),
post_image varchar(0 to 65500),
post_likes_score int(-2147483648 to 2147483648),
post_comments_count int(-2147483648 to 2147483648),
post_visible bool(0 false, any non zero int is true),
reaction_id int(0 to 1),
post_weight int(0 to MAX),
primary key(post_id)
);


