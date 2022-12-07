--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `commenter_id` int(11) NOT NULL,
  `comment_content` varchar(10000) DEFAULT NULL,
  `comment_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `commenter_id` (`commenter_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`commenter_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `friendships`
--

DROP TABLE IF EXISTS `friendships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friendships` (
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `friendship_status` enum('accepted','pending','blocked','unblocked','requested','rejected') DEFAULT NULL,
  `friend_request_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`friend_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_memberships`
--

DROP TABLE IF EXISTS `group_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_memberships` (
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `group_memberships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `group_merge`
--

DROP TABLE IF EXISTS `group_merge`;
/*!50001 DROP VIEW IF EXISTS `group_merge`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `group_merge` AS SELECT
 1 AS `group_id`,
 1 AS `member_id`,
 1 AS `owner_id`,
 1 AS `group_ranking`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` char(64) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `group_ranking` int(11) NOT NULL,
  PRIMARY KEY (`group_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `post_groups`
--

DROP TABLE IF EXISTS `post_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_groups` (
  `group_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  UNIQUE KEY `post_id` (`post_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `post_groups_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`),
  CONSTRAINT `post_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_title` char(34) DEFAULT NULL,
  `post_content` varchar(30000) DEFAULT NULL,
  `post_image` varchar(1000) DEFAULT NULL,
  `post_likes_score` int(11) DEFAULT NULL,
  `post_comment_count` int(11) NOT NULL,
  `post_visable` bit(1) DEFAULT NULL,
  `post_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  UNIQUE KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts_feed`
--

DROP TABLE IF EXISTS `posts_feed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts_feed` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `post_weight` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`post_id`),
  CONSTRAINT `posts_feed_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reactions`
--

DROP TABLE IF EXISTS `reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reactions` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `reactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reactions_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `maxage` datetime DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `session_id` (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_first_name` char(64) NOT NULL,
  `user_last_name` char(64) NOT NULL,
  `user_age` int(11) NOT NULL,
  `user_email` char(64) NOT NULL,
  `user_password` char(255) NOT NULL,
  `user_handle` char(32) NOT NULL,
  `user_status` char(16) NOT NULL,
  `user_image` varchar(1000) DEFAULT NULL,
  `admin_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_handle` (`user_handle`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `visibility`
--

DROP TABLE IF EXISTS `visibility`;
/*!50001 DROP VIEW IF EXISTS `visibility`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `visibility` AS SELECT
 1 AS `post_id`,
 1 AS `viewer_id`,
 1 AS `poster_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `group_merge`
--

/*!50001 DROP VIEW IF EXISTS `group_merge`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sarisky`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `group_merge` AS (select `groups`.`group_id` AS `group_id`,`group_memberships`.`user_id` AS `member_id`,`groups`.`owner_id` AS `owner_id`,`groups`.`group_ranking` AS `group_ranking` from (`group_memberships` join `groups` on((`groups`.`group_id` = `group_memberships`.`group_id`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `visibility`
--

/*!50001 DROP VIEW IF EXISTS `visibility`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sarisky`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `visibility` AS (select `post_groups`.`post_id` AS `post_id`,`group_memberships`.`user_id` AS `viewer_id`,`posts`.`user_id` AS `poster_id` from ((`post_groups` join `group_memberships` on((`post_groups`.`group_id` = `group_memberships`.`group_id`))) join `posts` on((`post_groups`.`post_id` = `posts`.`post_id`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-07  1:00:41