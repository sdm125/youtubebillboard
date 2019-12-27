-- 1988-07-16
-- if date is sunday start_date = date
-- if date is saturday end_date = date
-- if date is not sunday and not saturday start_date = DATE_SUB(date, INTERVAL ((DAYOFWEEK(date) - 1)  DAY)
-- if date is not sunday and not saturday end_date =  DATE_ADD(date, INTERVAL (7 - (DAYOFWEEK(date) DAY)  

-- select date_sub(date, INTERVAL DAYOFWEEK(date) DAY),
-- date_add(date, INTERVAL DAYOFWEEK(date) DAY)
-- from charts;

-- Update charts.start_date to the Sunday before date value
alter table charts add column start_date date;
alter table charts add column end_date date;

update charts as c1, charts as c2
set c1.start_date = DATE_SUB(c2.date, INTERVAL DAYOFWEEK(c2.date) - 1  DAY)
where c1.id = c2.id

-- Update charts.end_date to the Saturday after date value
update charts as c1, charts as c2
set c1.end_date = DATE_ADD(c2.date, INTERVAL 7 - DAYOFWEEK(c2.date) DAY)
where c1.id = c2.id;

-- find dups
SELECT song_id, artist_id, rank, start_date, end_date, COUNT(*) c 
FROM charts_test GROUP BY start_date HAVING c > 100;

-- delete dups from charts
DELETE FROM `charts` 
  WHERE id NOT IN (
    SELECT * FROM (
      SELECT MAX(id) FROM charts 
        GROUP BY song_id, artist_id, rank, start_date, end_date
    ) as t
  )
ALTER TABLE `charts` DROP INDEX `song_id`,`artist_id`,`rank`,`date`;