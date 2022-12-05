CREATE TABLE Users (
    userid int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    password char(60) NOT NULL,
    fullname varchar(255),
    PRIMARY KEY (userid),
    UNIQUE(username)
);

CREATE TABLE Session (
    userid int NOT NULL,
    sessionuuid varchar(255) NOT NULL,
    maxage DATETIME,
    FOREIGN KEY (userid) REFERENCES Users(userid)
);

CREATE USER 'pmoore'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'pmoore'@'localhost';
FLUSH PRIVILEGES;