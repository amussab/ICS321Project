CREATE TABLE TOURNAMENT (
 tr_id numeric NOT NULL,
 tr_name character varying(40) NOT NULL,
 start_date date NOT NULL,
 end_date date NOT NULL,
PRIMARY KEY (tr_id) );


CREATE TABLE VENUE (
 venue_id numeric NOT NULL,
 venue_name character varying(30) NOT NULL,
 venue_status character(1) NOT NULL,
 venue_capacity numeric NOT NULL,
PRIMARY KEY (venue_id) );


CREATE TABLE TEAM (
 team_id numeric NOT NULL,
 team_name character varying(30) NOT NULL,
PRIMARY KEY (team_id));


CREATE TABLE TOURNAMENT_TEAM (
 team_id numeric NOT NULL,
 tr_id numeric NOT NULL,
 team_group character(1) NOT NULL,
 match_played numeric NOT NULL,
 won numeric NOT NULL,
 draw numeric NOT NULL,
 lost numeric NOT NULL,
 goal_for numeric NOT NULL,
 goal_against numeric NOT NULL,
 goal_diff numeric NOT NULL,
 points numeric NOT NULL,
 group_position numeric NOT NULL,
PRIMARY KEY (team_id, tr_id),
FOREIGN KEY (tr_id) REFERENCES TOURNAMENT (tr_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id));


CREATE TABLE PERSON (
 kfupm_id numeric NOT NULL,
 name character varying(40) NOT NULL,
 date_of_birth date,
PRIMARY KEY (kfupm_id));


CREATE TABLE PLAYING_POSITION (
 position_id character(2) NOT NULL,
 position_desc character varying(15) NOT NULL,
PRIMARY KEY (position_id) );


CREATE TABLE PLAYER (
 player_id numeric NOT NULL,
 jersey_no numeric NOT NULL,
 position_to_play character(2) NOT NULL,
PRIMARY KEY (player_id),
FOREIGN KEY (player_id) REFERENCES PERSON (kfupm_id),
FOREIGN KEY (position_to_play) REFERENCES PLAYING_POSITION (position_id));


CREATE TABLE TEAM_PLAYER (
 player_id numeric NOT NULL,
 team_id numeric NOT NULL,
 tr_id numeric NOT NULL,
PRIMARY KEY (player_id, team_id, tr_id),
FOREIGN KEY (player_id) REFERENCES PLAYER (player_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (tr_id) REFERENCES TOURNAMENT (tr_id));



CREATE TABLE SUPPORT (
 support_type character(2) NOT NULL,
 support_desc character varying(15) NOT NULL,
PRIMARY KEY (support_type));


CREATE TABLE TEAM_SUPPORT (
 support_id numeric NOT NULL,
 team_id numeric NOT NULL,
 tr_id numeric NOT NULL,
 support_type character(2) NOT NULL,
PRIMARY KEY (support_id, team_id, tr_id),
FOREIGN KEY (support_id) REFERENCES PERSON (kfupm_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (tr_id) REFERENCES TOURNAMENT (tr_id),
FOREIGN KEY (support_type) REFERENCES SUPPORT (support_type));

CREATE TABLE MATCH_PLAYED (
 match_no numeric NOT NULL,
 play_stage character(1) NOT NULL,
 play_date date NOT NULL,
 team_id1 numeric NOT NULL,
 team_id2 numeric NOT NULL,
 results character(5) NOT NULL,
 decided_by character(1) NOT NULL,
 goal_score character(5) NOT NULL,
 venue_id numeric NOT NULL,
 audience numeric NOT NULL,
 player_of_match numeric NOT NULL,
 stop1_sec numeric NOT NULL,
 stop2_sec numeric NOT NULL,
PRIMARY KEY (match_no),
FOREIGN KEY (team_id1) REFERENCES TEAM (team_id),
FOREIGN KEY (team_id2) REFERENCES TEAM (team_id),
FOREIGN KEY (venue_id) REFERENCES VENUE (venue_id),
FOREIGN KEY (player_of_match) REFERENCES PLAYER (player_id));


CREATE TABLE match_details (
match_no numeric NOT NULL,
team_id numeric NOT NULL,
win_lose character(1) NOT NULL,
decided_by character(1) NOT NULL,
goal_score numeric NOT NULL,
penalty_score numeric,
player_gk numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (player_gk) REFERENCES PLAYER (player_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no));



CREATE TABLE MATCH_SUPPORT (
 match_no numeric NOT NULL,
 support_id numeric NOT NULL,
 support_type character(2) NOT NULL,
PRIMARY KEY (match_no, support_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no),
FOREIGN KEY (support_id) REFERENCES PERSON (kfupm_id));


CREATE TABLE GOAL_DETAILS (
 goal_id numeric NOT NULL,
 match_no numeric NOT NULL,
 player_id numeric NOT NULL,
 team_id numeric NOT NULL,
 goal_time numeric NOT NULL,
 goal_type character(1) NOT NULL,
 play_stage character(1) NOT NULL,
 goal_schedule character(2) NOT NULL,
 goal_half numeric,
PRIMARY KEY (goal_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (player_id) REFERENCES PLAYER (player_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no));


CREATE TABLE PENALTY_SHOOTOUT (
 kick_id numeric NOT NULL,
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_id numeric NOT NULL,
 score_goal character(1) NOT NULL,
 kick_no numeric NOT NULL,
PRIMARY KEY (kick_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (player_id) REFERENCES PLAYER (player_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no));


CREATE TABLE PLAYER_BOOKED (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_id numeric NOT NULL,
 booking_time numeric NOT NULL,
 sent_off character(1),
 play_schedule character(2) NOT NULL,
 play_half numeric NOT NULL,
PRIMARY KEY (match_no, team_id, player_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (player_id) REFERENCES PLAYER (player_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no));


CREATE TABLE PLAYER_IN_OUT (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_id numeric NOT NULL,
 in_out character(1) NOT NULL,
 time_in_out numeric NOT NULL,
 play_schedule character(2) NOT NULL,
 play_half numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (player_id) REFERENCES PLAYER (player_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no));


CREATE TABLE MATCH_CAPTAIN (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_captain numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (player_captain) REFERENCES PLAYER (player_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no));


CREATE TABLE PENALTY_GK (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_gk numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES TEAM (team_id),
FOREIGN KEY (player_gk) REFERENCES PLAYER (player_id),
FOREIGN KEY (match_no) REFERENCES MATCH_PLAYED (match_no));
