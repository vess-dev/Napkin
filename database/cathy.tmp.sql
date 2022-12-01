Future query of doom

select * from 
(
select max(group_ranking) from groups where owner_id = 11 group by owner_id
) as t 
join 
(select group_id from group_memberships where user_id=5) as q using (group_id);



select max(group_ranking) from groups where owner_id = 11 group by owner_id



create view groups_merge as (

select groups.group_id, user_id as member_id, owner_id, group_ranking  
from group_memberships 
join 
groups 
on (groups.group_id=group_memberships.group_id) ;

// make the visibility VIEW
select post_groups.post_id, user_id as viewer_id from post_groups JOIN group_memberships using (group_id) 

// USE ME - better visibility view
select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)


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
select * from (
select owner_id, member_id, max(group_ranking) as max_ranking from group_merge group by owner_id, member_id 
) as tab1
JOIN 
(select post_groups.post_id, group_memberships.user_id as viewer_id, posts.user_id as poster_id from 
(post_groups JOIN group_memberships using (group_id)) 
JOIN posts using (post_id)) as tab2
on (tab1.owner_id = tab2.poster_id AND tab1.member_id = tab2.viewer_id);