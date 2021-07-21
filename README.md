# Ping-Pong-Score-SPA

Track your ping pong score through this app.

You can add, delete or edit users and delete previous matches.

In order to work you need to create database which i exported from phpMyAdmin. The file is called ping_pong.sql.

Application also have soft delete on players so that if you delete player he stays in table and his name is still shown in "games_played" table. I have is_deleted column in "players" table and it's 0 or 1, 0 he's not deleted and 1 if he's deleted. Players menu in application only shows players that have 0 in that column.
