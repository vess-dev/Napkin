CREATE TABLE users (
  user_id int NOT NULL AUTO_INCREMENT,
  user_first_name char(64) NOT NULL,
  user_last_name char(64) NOT NULL,
  user_age int NOT NULL,
  user_email char(64) NOT NULL,
  user_image varchar(1000) NOT NULL, 
  user_password char(255) NOT NULL,
  user_handle char(32) NOT NULL,
  user_status char(16) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE (user_handle)
);

alter table users add column user_image varchar(1000);

CREATE TABLE posts(
  post_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  post_title char(34),
  post_content varchar(30000),
  post_image varchar(1000),
  post_likes_score int,
  post_comment_count int NOT NULL,
  post_visable bit,
  post_timestamp DATETIME NOT NULL,
  PRIMARY KEY(post_id),
  UNIQUE(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)  
);

CREATE TABLE groups(
  group_id int NOT NULL AUTO_INCREMENT,
  group_name char(64) NOT NULL,
  owner_id int NOT NULL,
  group_ranking int NOT NULL,
  PRIMARY KEY(group_id),
  FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

CREATE TABLE group_memberships(
  group_id int NOT NULL,
  user_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  foreign key (group_id) references groups(group_id)
);

CREATE TABLE post_groups(
  group_id int NOT NULL, 
  post_id int NOT NULL, 
  foreign key (post_id) references posts(post_id),
  foreign key (group_id) references groups(group_id)
);  
 
  
CREATE TABLE friendships(
  user_id int NOT NULL,
  friend_id int NOT NULL,
  friendship_status enum('nominal', 'accepted', 'pending', 'blocked', 'unblocked') NOT NULL,
  friend_request_timestamp DATE NOT NULL, 
  PRIMARY KEY (user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  foreign key (friend_id) references users(user_id)
);

CREATE TABLE reactions(
  user_id int NOT NULL,
  post_id int NOT NULL,
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id)
  );

CREATE TABLE comments (
  comment_id int NOT NULL AUTO_INCREMENT,
  commenter_id int NOT NULL,
  comment_content varchar(10000),
  comment_timestamp DATETIME NOT NULL,
  post_id int NOT NULL,
  PRIMARY KEY (comment_id),
  FOREIGN KEY (commenter_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE sessions(
  user_id int NOT NULL,
  session_id varchar(255) NOT NULL,
  maxage DATETIME,
  PRIMARY KEY (session_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)           
);

CREATE TABLE posts_feed(
  user_id int NOT NULL, 
  post_id int NOT NULL,
  post_weight int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  foreign key (post_id) references posts(post_id)
);


