Some old queries that I just wanted to save.

Leaderboard query {

select players.ime as "ime", players.prezime as "prezime", count(case when p1_score > p2_score then p1_id else p2_id end) as "total" 
                                   from games_played 
                                   INNER join players on (case when p1_score > p2_score then p1_id else p2_id end)=players.id 
                                   group by (case when p1_score > p2_score then p1_id else p2_id end) 
                                   order by count(case when p1_score > p2_score then p1_id else p2_id end) desc

select ime, prezime, (
    SELECT COUNT(*)
	from games_played gp
	where (gp.p1_score>gp.p2_score and gp.p1_id=p.id)
	OR (gp.p1_score<gp.p2_score and gp.p2_id=p.id)) as "total"
from players p
order by total DESC                                   
}