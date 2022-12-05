Future query of doom work

select * from 
(
select max(group_ranking) from groups where owner_id = 11 group by owner_id
) as t 
join 
(select group_id from group_memberships where user_id=5) as q using (group_id);



select max(group_ranking) from groups where owner_id = 11 group by owner_id

=======
// Final code for groups_merge group
create view groups_merge as (

select groups.group_id, user_id as member_id, owner_id, group_ranking  
from group_memberships 
join 
groups 
on (groups.group_id=group_memberships.group_id) );
===============================

// make the visibility VIEW
select post_groups.post_id, user_id as viewer_id from post_groups JOIN group_memberships using (group_id) 

// USE ME - better visibility view
select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)
=================================

insert into posts_feed (select viewer_id as user_id, post_id, 0 as post_weight from visibility) ;

select max(group_ranking) from group_merge where member_id= 2 and owner_id = 1 ;

// can I get max into the visibility view?  Because then we would d be almost done.  Not yet :(
select max, post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
((post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id) 
JOIN 
(select max(group_ranking) as max 
from group_merge where member_id = group_memberships.user_id AND owner_id = poster_id ) as t 
using (group_id, user_id))

select * from (

select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id 
from 
(select * from 
    (post_groups 
    JOIN 
    group_memberships using (group_id) ) 
    JOIN posts using (post_id)
    ) )
    as part1
JOIN 
(select max(group_ranking), member_id, owner_id from group_merge ) as table2
on (table2.member_id = part1.viewer_id AND table_2.owner_id = part1.poster_id) ) as table3
);

SELECT *
FROM   (

select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)) as tab1


// THis works -- integrate with the rest?
select owner_id, member_id, max(group_ranking) as max_ranking from group_merge group by owner_id, member_id ;

// THIS. THIS RIGHT HERE.
select viewer_id, poster_id, post_id, max_ranking from (
select owner_id, member_id, max(group_ranking) as max_ranking from group_merge group by owner_id, member_id 
) as tab1
JOIN 
(select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)) as tab2
on (tab1.owner_id = tab2.poster_id AND tab1.member_id = tab2.viewer_id);

// rewrite to remove bonus view

select viewer_id, poster_id, post_id, max_ranking from (
select owner_id, member_id, max(group_ranking) as max_ranking from 
(select groups.group_id, user_id as member_id, owner_id, group_ranking  
from group_memberships 
join 
groups 
on (groups.group_id=group_memberships.group_id) ) as tab3
group by owner_id, member_id 
) as tab1
JOIN 
(select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)) as tab2
on (tab1.owner_id = tab2.poster_id AND tab1.member_id = tab2.viewer_id);
// ^^ this gets group_rankings swapped.  Trying again, below!

// BAM. This is it! // 
select viewer_id, poster_id, post_id, max_ranking from (
select owner_id, member_id, max(group_ranking) as max_ranking from 
(select groups.group_id, user_id as member_id, owner_id, group_ranking  
from group_memberships 
join 
groups 
on (groups.group_id=group_memberships.group_id) ) as tab3
group by owner_id, member_id 
) as tab1
JOIN 
(select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)) as tab2
on (tab1.owner_id = tab2.viewer_id AND tab1.member_id = tab2.poster_id);

// but why not add more?

select viewer_id, poster_id, post_id, max_ranking, post_likes_score, post_comment_count, post_timestamp from (
select owner_id, member_id, max(group_ranking) as max_ranking from 
(select groups.group_id, user_id as member_id, owner_id, group_ranking  
from group_memberships 
join 
groups 
on (groups.group_id=group_memberships.group_id) ) as tab3
group by owner_id, member_id 
) as tab1
JOIN 
(select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id,
posts.post_likes_score, posts.post_comment_count, posts.post_timestamp 
from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)) as tab2
on (tab1.owner_id = tab2.viewer_id AND tab1.member_id = tab2.poster_id);


replace INTO group_memberships (group_id, user_id)
         select 10, 11
         WHERE
         10 IN (select group_id from groups where owner_id=1)
         AND 11 IN (select friend_id from friendships where user_id=1 and friendship_status='accepted') 

         [group_id, friend_id, group_id, user_id, friend_id, user_id]


delete from group_memberships where user_id=1 and friend_id = 13 and friend

select group_id, group_name, user_id as inGroup from (select group_id, user_id from group_memberships where user_id=?) b right join groups using (group_id) 
    where group_id in (select group_id from groups where owner_id=?)`, [friendID, userID],
`
select * from friendships 

select * from friendships where (user_id=12 and friend_id = 1 and friendship_status in ('accepted', 'pending')) or (user_id=1 and friend_id=12 and friendship_status in ('accepted', 'requested')) 
