CREATE TABLE users (
  user_id int NOT NULL,
  user_first_name char(64) NOT NULL,
  user_last_name char(64) NOT NULL,
  user_email char(64) NOT NULL,
  user_password char(32) NOT NULL,
  user_handle char(32) NOT NULL,
  user_status char(16) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE (user_handle)
);


CREATE TABLE posts(
  post_id int NOT NULL,
  user_id int NOT NULL,
  post_title char(34),
  post_content varchar(30000),
  -- I needed to make these smaller to load the table.  They were bigger than the database can 
  -- handle (badly documented issue, apparently), and really, posts don't need to be dozens of pages long!
  post_image varchar(1000),
  post_likes_score int,
  post_comments_count int NOT NULL,
  post_visible bit NOT NULL, 
  PRIMARY KEY(post_id),
  UNIQUE(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)  
);

CREATE TABLE group_memberships(
  /* please recheck against the database design - you have stuff in here that doesn't belong */
  group_id int NOT NULL,
  user_id int NOT NULL,
  owner_id int NOT NULL,
  group_name varchar(34) NOT NULL,
  group_ranking bit NOT NULL,
  PRIMARY KEY(group_id),
  UNIQUE(group_name),
  FOREIGN KEY (user_id) REFERENCES users(user_id)  
);

/* CREATE TABLE post_groups(

What's up here?  post_groups is supposed to have only post_id and group_id.

  group_id int NOT NULL,
  user_id int NOT NULL
  post_id int NOT NULL,
  poster_id int NOT NULL,
  owner_id int NOT NULL,
  group_name char(34) NOT NULL,
  group_ranking int NOT NULL,
  post_title char(64),
  post_content varchar(65500),
  post_image varchar(65500), 
  comment_id int NOT NULL,
  commenter_id int NOT NULL,
  comment_content varchar(65500),
  comment_timestamp DATETIME NOT NULL,
  reaction_id int,
  post_weight int,
  FOREIGN KEY (user_id) REFERENCES users(user_id)  
);  
*/ 
  
CREATE TABLE friendships(
  user_id int NOT NULL,
  friend_id int NOT NULL,
  friendship_status enum('nominal', 'accepted', 'pending', 'blocked', 'unblocked') NOT NULL,
  friend_request DATE NOT NULL, 
  PRIMARY KEY (user_id, friend_id),
  UNIQUE (friend_id), 
  FOREIGN KEY (user_id) REFERENCES users(user_id)  
);

CREATE TABLE reactions(
 /* I rewrote a little bit - didn't match the database design */ 
  user_id int NOT NULL,
  post_id int,
  PRIMARY KEY(user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id)
  );

CREATE TABLE comments(
  comment_id int NOT NULL,
  commenter_id int NOT NULL,
  --user_id int NOT NULL,
  --user_id and commenter_id are the same. Pick one. :)
  comment_content varchar(10000),
  comment_timestamp DATETIME NOT NULL,
  /* can't store reaction_id here - it's not a 1:1 mapping */ 
  -- reaction_id int,
  post_id int,
  PRIMARY_KEY(comment_id),
  UNIQUE(comment_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE sessions(
  user_id int NOT NULL,
  session_id varchar(255) NOT NULL,
  PRIMARY KEY(session_id),
  UNIQUE(session_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)           
);


CREATE TABLE posts_feed(

  /* this one needs some more attention. The goal isn't to store the whole feed in one table, but just to store the 
  user_id, post_id, and post_weight.  See the database design document. 
  */  
  user_id int NOT NULL, 
  post_id int NOT NULL,
  session_id varchar(255) NOT NULL,
  comment_id int NOT NULL,
  commenter_id int NOT NULL,
  comment_content varchar(65500),
  comment_timestamp DATETIME NOT NULL,
  post_title char(34),
  post_content varchar(65500) NOT NULL,
  post_image varchar(65500) NOT NULL,
  post_likes_score int,
  post_comments_count int,
  post_visible bit,
  reaction_id int,
  post_weight int,
  FOREIGN KEY (user_id) REFERENCES users(user_id)  
);

/* Missing a table - groups, I think? */
