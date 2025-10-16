INSERT INTO ROLE (name) VALUES ('ROLE_USER');
INSERT INTO ROLE (name) VALUES ('ROLE_ADMIN');

INSERT INTO location (name, latitude, longitude) VALUES
('Bulevar Evrope 12, Novi Sad', 45.2510, 19.8365),
('Nemanjina 4, Beograd', 44.8075, 20.4600),
('Kralja Petra Prvog 24, Niš', 43.3209, 21.8958),
('Trg Kralja Milana 5, Niš', 43.3192, 21.8957),
('Kneza Miloša 16, Kragujevac', 44.0128, 20.9110),
('Cara Lazara 7, Subotica', 46.1005, 19.6678),
('Vojvode Mišića 8, Čačak', 43.8915, 20.3498),
('Kralja Aleksandra Obrenovića 10, Leskovac', 42.9982, 21.9462),
('Trg Republike 1, Beograd', 44.8168, 20.4606),
('Bulevar Oslobođenja 1, Novi Sad', 45.2551, 19.8453),
('Bulevar kralja Aleksandra 73, Beograd', 44.8058, 20.4781),
('Knez Mihailova 5, Beograd', 44.8176, 20.4572),
('Zmaj Jovina 22, Novi Sad', 45.2550, 19.8452),
('Cara Dušana 13, Niš', 43.3190, 21.8958),
('Kralja Petra I 12, Kragujevac', 44.0142, 20.9394),
('Trg slobode 1, Subotica', 46.1003, 19.6676),
('Obilićev venac 18, Beograd', 44.8170, 20.4575),
('Bulevar Oslobođenja 102, Novi Sad', 45.2517, 19.8369),
('Vojvode Stepe 14, Čačak', 43.8914, 20.3497),
('Kralja Aleksandra 2, Leskovac', 42.9981, 21.9461),
('Trg slobode 5, Pančevo', 44.8711, 20.6403),
('Kralja Aleksandra I Karađorđevića 15, Zrenjanin', 45.3836, 20.3819),
('Trg Republike 3, Smederevo', 44.6670, 20.9303),
('Gospodar Jevremova 6, Šabac', 44.7556, 19.6917),
('Dimitrija Tucovića 52, Užice', 43.8556, 19.8483),
('Karađorđeva 64, Valjevo', 44.2750, 19.8861);

INSERT INTO registereduser 
(username, password, name, surname, email, address, isactivated, isadmin) 
VALUES
('alice_smith', 'password1', 'Alice', 'Smith', 'alice@example.com', 'Bulevar kralja Aleksandra 73, Beograd', TRUE, FALSE),
('bob_brown', 'password2', 'Bob', 'Brown', 'bob@example.com', 'Knez Mihailova 5, Beograd', TRUE, FALSE),
('admin_user', 'adminpass', 'Melisa', 'Nikolic', 'melisa@example.com', 'Zmaj Jovina 22, Novi Sad', TRUE, TRUE),
('charlie_jones', 'password3', 'Charlie', 'Jones', 'charlie@example.com', 'Cara Dušana 13, Niš', TRUE, FALSE),
('dana_white', 'password4', 'Dana', 'White', 'dana@example.com', 'Kralja Petra I 12, Kragujevac', TRUE, FALSE),
('eve_williams', 'password5', 'Eve', 'Williams', 'eve@example.com', 'Trg slobode 1, Subotica', TRUE, FALSE),
('frank_moore', 'password6', 'Frank', 'Moore', 'frank@example.com', 'Obilićev venac 18, Beograd', TRUE, FALSE),
('grace_hill', 'password7', 'Grace', 'Hill', 'grace@example.com', 'Bulevar Oslobođenja 102, Novi Sad', TRUE, FALSE),
('henry_adams', 'password8', 'Henry', 'Adams', 'henry@example.com', 'Vojvode Stepe 14, Čačak', TRUE, FALSE),
('ivy_green', 'password9', 'Ivy', 'Green', 'ivy@example.com', 'Kralja Aleksandra 2, Leskovac', TRUE, FALSE),
('jack_thomas', 'password10', 'Jack', 'Thomas', 'jack@example.com', 'Bulevar Evrope 12, Novi Sad', TRUE, FALSE),
('kate_martin', 'password11', 'Kate', 'Martin', 'kate@example.com', 'Nemanjina 4, Beograd', TRUE, FALSE),
('admin_user2', 'adminpass2', 'Maya', 'Mirkovic', 'maya@example.com', 'Trg Republike 1, Beograd', TRUE, TRUE),
('lucas_smith', 'password12', 'Lucas', 'Smith', 'lucas@example.com', 'Bulevar Oslobođenja 1, Novi Sad', TRUE, FALSE),
('mia_walker', 'password13', 'Mia', 'Walker', 'mia@example.com', 'Kneza Miloša 16, Kragujevac', TRUE, FALSE),
('noah_baker', 'password14', 'Noah', 'Baker', 'noah@example.com', 'Cara Lazara 7, Subotica', TRUE, FALSE),
('olivia_turner', 'password15', 'Olivia', 'Turner', 'olivia@example.com', 'Vojvode Mišića 8, Čačak', TRUE, FALSE),
('peter_parker', 'password16', 'Peter', 'Parker', 'peter@example.com', 'Kralja Aleksandra Obrenovića 10, Leskovac', TRUE, FALSE),
('quinn_lee', 'password17', 'Quinn', 'Lee', 'quinn@example.com', 'Trg Kralja Milana 5, Niš', TRUE, FALSE),
('rachel_clark', 'password18', 'Rachel', 'Clark', 'rachel@example.com', 'Kralja Petra Prvog 24, Niš', TRUE, FALSE),
('samuel_taylor', 'password19', 'Samuel', 'Taylor', 'samuel@example.com', 'Bulevar kralja Aleksandra 73, Beograd', TRUE, FALSE),
('tina_miller', 'password20', 'Tina', 'Miller', 'tina@example.com', 'Knez Mihailova 5, Beograd', TRUE, FALSE),
('victor_rogers', 'password21', 'Victor', 'Rogers', 'victor@example.com', 'Zmaj Jovina 22, Novi Sad', TRUE, FALSE);

INSERT INTO USER_ROLE (user_id, role_id) VALUES (1, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (2, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (3, 2);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (4, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (5, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (6, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (7, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (8, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (9, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (10, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (11, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (12, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (13, 2);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (14, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (15, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (16, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (17, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (18, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (19, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (20, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (21, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (22, 1);
INSERT INTO USER_ROLE (user_id, role_id) VALUES (23, 1);


INSERT INTO "post"
(registereduserid, description, image, location_name, timecreated)
VALUES
(1, 'Sharing tips on bunny care', 'images/post1.jpg', 'Bulevar kralja Aleksandra 73, Beograd', '2025-10-02 10:16:45'),
(2, 'New bunny play area setup', 'images/post2.jpg', 'Knez Mihailova 5, Beograd', '2025-10-03 22:49:51'),
(3, 'Bunny enjoying fresh carrots', 'images/post3.jpg', 'Kralja Petra I 12, Kragujevac', '2025-10-04 02:03:32'),
(4, 'Grooming advice for bunnies', 'images/post4.jpg', 'Trg slobode 1, Subotica', '2025-10-05 21:25:57'),
(5, 'Bunny exploring the backyard', 'images/post5.jpg', 'Obilićev venac 18, Beograd', '2025-10-06 05:14:21'),
(6, 'Building a bunny hideout', 'images/post6.jpg', 'Bulevar Oslobođenja 102, Novi Sad', '2025-10-07 07:19:31'),
(7, 'Bunny hopping around the garden', 'images/post7.jpg', 'Vojvode Stepe 14, Čačak', '2025-10-08 15:08:35'),
(8, 'Bunny playdate fun', 'images/post8.jpg', 'Kralja Aleksandra 2, Leskovac', '2025-09-09 13:37:05'), -- OLD
(9, 'Favorite bunny treats', 'images/post9.jpg', 'Bulevar Evrope 12, Novi Sad', '2025-09-10 08:19:29'), -- OLD
(10, 'Creating a cozy bunny corner', 'images/post10.jpg', 'Bulevar kralja Aleksandra 73, Beograd', '2025-09-11 08:00:00'), -- OLD
(11, 'Bunny enjoying a sunny day', 'images/post11.jpg', 'Kralja Petra I 12, Kragujevac', '2025-09-12 14:55:40'), -- OLD
(12, 'Setting up a bunny obstacle course', 'images/post12.jpg', 'Nemanjina 4, Beograd', '2025-09-13 08:00:00'), -- OLD
(13, 'Bunny bonding session', 'images/post13.jpg', 'Bulevar Oslobođenja 1, Novi Sad', '2025-10-14 23:28:15'),
(14, 'Tips for bunny health checks', 'images/post14.jpg', 'Kneza Miloša 16, Kragujevac', '2025-09-15 13:31:52'), -- OLD
(15, 'Bunny napping in a hammock', 'images/post15.jpg', 'Knez Mihailova 5, Beograd', '2025-09-16 21:22:52'), -- OLD
(16, 'Bunny running in the park', 'images/post16.jpg', 'Obilićev venac 18, Beograd', '2025-09-17 02:01:28'), -- OLD
(17, 'Bunny playing with new toys', 'images/post17.jpg', 'Bulevar Oslobođenja 102, Novi Sad', '2025-10-02 18:00:00'),
(18, 'Bunny enjoying a new treat', 'images/post18.jpg', 'Vojvode Stepe 14, Čačak', '2025-10-03 13:06:24'),
(19, 'Bunny meeting a new friend', 'images/post19.jpg', 'Kralja Aleksandra 2, Leskovac', '2025-09-18 11:00:00'), -- OLD
(20, 'Bunny’s first adventure outside', 'images/post20.jpg', 'Bulevar Evrope 12, Novi Sad', '2025-09-19 09:00:00'), -- OLD
(21, 'Bunny-proofing the house for safety!', 'images/post21.jpg', 'Trg slobode 5, Pančevo', '2025-09-20 10:05:00'), -- OLD
(22, 'My bunny loves dandelion greens.', 'images/post22.jpg', 'Kralja Aleksandra I Karađorđevića 15, Zrenjanin', '2025-09-21 11:30:00'), -- OLD
(23, 'Our bunny just learned a new trick!', 'images/post23.jpg', 'Trg Republike 3, Smederevo', '2025-10-14 12:45:00'),
(22, 'Morning cuddles with this little one.', 'images/post24.jpg', 'Gospodar Jevremova 6, Šabac', '2025-10-13 09:00:00'),
(22, 'Building a new hutch for the winter.', 'images/post25.jpg', 'Dimitrija Tucovića 52, Užice', '2025-10-12 18:20:00'),
(23, 'Harvesting some fresh herbs from the garden for a treat.', 'images/post26.jpg', 'Karađorđeva 64, Valjevo', '2025-10-11 16:30:00'),
(2, 'Just a sleepy bunny on a lazy afternoon.', 'images/post27.jpg', 'Zmaj Jovina 22, Novi Sad', '2025-10-10 15:00:00'),
(17, 'Look at that twitchy nose!', 'images/post28.jpg', 'Trg Republike 1, Beograd', '2025-10-09 19:10:00'),
(12, 'Trying to teach him to come when called.', 'images/post29.jpg', 'Cara Dušana 13, Niš', '2025-10-08 20:00:00'),
(3, 'The cutest little tail.', 'images/post30.jpg', 'Kralja Petra I 12, Kragujevac', '2025-10-07 17:30:00');

INSERT INTO "following" (idfollower, idfollowing)
VALUES
(1, 2), (1, 4), (2, 1), (2, 5), (3, 6), (4, 2), (4, 7), (5, 8), (6, 1), (7, 3),
(8, 2), (9, 4), (10, 5), (11, 6), (12, 7), (1, 3), (1, 5), (2, 3), (3, 4), (3, 7),
(4, 5), (5, 6), (6, 2), (6, 9), (7, 1), (7, 8), (8, 3), (8, 10), (9, 1), (9, 7),
(10, 2), (10, 11), (11, 4), (12, 6), (12, 9),
(1, 6), (1, 8), (2, 4), (2, 10), (3, 1), (3, 2), (4, 9), (4, 11), (5, 1), (5, 12),
(6, 7), (6, 13), (7, 11), (7, 14), (8, 5), (8, 15), (9, 2), (9, 16), (10, 1), (10, 13),
(11, 1), (11, 12), (12, 1), (12, 11), (13, 1), (13, 2), (13, 3), (14, 5), (14, 15),
(15, 10), (15, 14), (16, 17), (16, 20), (17, 18), (18, 19), (19, 20), (20, 21), (21, 22), (22, 23),
(23, 1), (23, 3), (1, 20), (2, 19), (4, 18), (5, 17), (8, 16);

INSERT INTO "like" (postid, userid, timecreated)
VALUES
-- Post 1 (High Likes)
(1, 2, '2025-10-02 19:25:12'), (1, 3, '2025-10-03 10:17:45'), (1, 4, '2025-10-04 16:51:53'), (1, 5, '2025-10-05 18:38:21'),
(1, 11, '2025-10-06 15:34:47'), (1, 14, '2025-10-07 02:50:44'), (1, 10, '2025-10-08 04:46:48'), (1, 6, '2025-10-08 11:20:11'),
(1, 7, '2025-10-09 09:15:33'), (1, 8, '2025-10-10 14:05:00'), (1, 9, '2025-10-11 16:10:21'), (1, 12, '2025-10-12 18:30:45'),
(1, 13, '2025-10-13 19:00:00'), (1, 15, '2025-10-14 20:11:12'), (1, 16, '2025-10-15 21:22:13'), (1, 17, '2025-10-16 08:33:51'),
-- Post 2 (High Likes)
(2, 7, '2025-10-04 13:08:48'), (2, 8, '2025-10-04 23:49:51'), (2, 13, '2025-10-06 04:10:25'), (2, 3, '2025-10-07 04:11:39'),
(2, 9, '2025-10-08 06:50:28'), (2, 6, '2025-10-09 21:57:22'), (2, 1, '2025-10-10 01:10:10'), (2, 4, '2025-10-10 11:11:11'),
(2, 5, '2025-10-11 12:12:12'), (2, 10, '2025-10-12 13:13:13'), (2, 11, '2025-10-13 14:14:14'), (2, 12, '2025-10-14 15:15:15'),
(2, 14, '2025-10-15 16:16:16'), (2, 15, '2025-10-16 09:17:18'),
-- Post 3
(3, 10, '2025-10-04 10:34:55'), (3, 11, '2025-10-05 07:56:50'), (3, 12, '2025-10-06 23:08:56'), (3, 13, '2025-10-07 02:03:32'),
(3, 14, '2025-10-08 14:36:59'), (3, 20, '2025-10-09 18:47:56'),
-- Post 4
(4, 14, '2025-10-06 21:25:57'), (4, 15, '2025-10-07 02:19:32'), (4, 16, '2025-10-08 05:27:48'), (4, 17, '2025-10-09 14:08:21'),
-- Post 5 (High Likes)
(5, 18, '2025-10-07 01:33:47'), (5, 19, '2025-10-08 10:48:19'), (5, 20, '2025-10-09 13:49:59'), (5, 21, '2025-10-10 11:47:44'),
(5, 11, '2025-10-11 05:14:21'), (5, 1, '2025-10-11 08:00:00'), (5, 2, '2025-10-11 09:00:00'), (5, 3, '2025-10-11 10:00:00'),
(5, 4, '2025-10-12 11:00:00'), (5, 6, '2025-10-12 12:00:00'), (5, 7, '2025-10-13 13:00:00'), (5, 8, '2025-10-13 14:00:00'),
(5, 9, '2025-10-14 15:00:00'), (5, 10, '2025-10-15 16:00:00'), (5, 12, '2025-10-16 08:00:00'),
-- Post 6
(6, 22, '2025-10-07 09:19:31'), (6, 23, '2025-10-08 21:48:20'), (6, 1, '2025-10-09 17:33:07'), (6, 2, '2025-10-10 09:39:49'),
-- Post 7 (High Likes)
(7, 3, '2025-10-09 14:43:58'), (7, 4, '2025-10-10 05:05:18'), (7, 5, '2025-10-11 00:13:52'), (7, 6, '2025-10-12 15:08:35'),
(7, 1, '2025-10-12 16:00:00'), (7, 2, '2025-10-12 17:00:00'), (7, 8, '2025-10-13 18:00:00'), (7, 9, '2025-10-13 19:00:00'),
(7, 10, '2025-10-13 20:00:00'), (7, 11, '2025-10-14 21:00:00'), (7, 12, '2025-10-14 22:00:00'), (7, 13, '2025-10-15 08:00:00'),
(7, 14, '2025-10-15 09:00:00'), (7, 15, '2025-10-15 10:00:00'), (7, 16, '2025-10-16 11:00:00'),
-- Post 8 (OLD)
(8, 7, '2025-09-10 12:01:59'), (8, 6, '2025-09-11 13:37:05'), (8, 8, '2025-09-12 00:45:46'),
-- Post 9 (OLD)
(9, 4, '2025-09-11 09:19:29'), (9, 5, '2025-09-12 10:20:30'),
-- Post 10 (OLD)
(10, 1, '2025-09-12 09:00:00'), (10, 2, '2025-09-13 10:00:00'),
-- Post 11 (OLD)
(11, 1, '2025-09-13 14:55:40'), (11, 10, '2025-09-14 15:00:00'),
-- Post 12 (OLD)
(12, 1, '2025-09-14 09:00:00'), (12, 2, '2025-09-15 11:00:00'),
-- Post 13 (High Likes)
(13, 3, '2025-10-15 23:28:15'), (13, 4, '2025-10-16 00:30:00'), (13, 1, '2025-10-16 01:00:00'), (13, 2, '2025-10-16 02:00:00'),
(13, 5, '2025-10-16 03:00:00'), (13, 6, '2025-10-16 04:00:00'), (13, 7, '2025-10-16 05:00:00'), (13, 8, '2025-10-16 06:00:00'),
(13, 9, '2025-10-16 07:00:00'), (13, 10, '2025-10-16 08:00:00'), (13, 11, '2025-10-16 09:00:00'), (13, 12, '2025-10-16 10:00:00'),
(13, 14, '2025-10-16 11:00:00'), (13, 15, '2025-10-16 12:00:00'), (13, 16, '2025-10-16 13:00:00'), (13, 17, '2025-10-16 14:00:00'),
-- Post 14 (OLD)
(14, 19, '2025-09-16 14:31:52'), (14, 20, '2025-09-17 15:00:00'),
-- Post 15 (OLD)
(15, 4, '2025-09-17 22:22:52'), (15, 5, '2025-09-18 08:30:00'),
-- Post 16 (OLD)
(16, 9, '2025-09-18 03:01:28'), (16, 10, '2025-09-19 09:00:00'),
-- Post 17
(17, 1, '2025-10-02 19:00:00'), (17, 2, '2025-10-03 20:00:00'),
-- Post 18
(18, 18, '2025-10-04 20:06:43'), (18, 11, '2025-10-05 13:06:24'), (18, 19, '2025-10-06 14:00:00'),
-- Post 19 (OLD)
(19, 1, '2025-09-19 12:00:00'), (19, 2, '2025-09-20 13:00:00'),
-- Post 20 (OLD)
(20, 1, '2025-09-20 10:00:00'), (20, 2, '2025-09-21 11:00:00'),
-- Post 21 (OLD)
(21, 1, '2025-09-21 11:00:00'), (21, 2, '2025-09-22 12:00:00'),
-- Post 22 (OLD)
(22, 3, '2025-09-22 12:00:00'), (22, 4, '2025-09-23 13:00:00'),
-- Post 23
(23, 5, '2025-10-14 13:00:00'), (23, 6, '2025-10-15 14:00:00'),
-- Post 24
(24, 7, '2025-10-13 10:00:00'), (24, 8, '2025-10-14 11:00:00'),
-- Post 25
(25, 9, '2025-10-12 19:00:00'), (25, 10, '2025-10-13 20:00:00'),
-- Post 26
(26, 11, '2025-10-11 17:00:00'), (26, 12, '2025-10-12 18:00:00'),
-- Post 27
(27, 13, '2025-10-10 16:00:00'), (27, 14, '2025-10-11 17:00:00'),
-- Post 28
(28, 15, '2025-10-09 20:00:00'), (28, 16, '2025-10-10 21:00:00'),
-- Post 29
(29, 17, '2025-10-08 21:00:00'), (29, 18, '2025-10-09 22:00:00'),
-- Post 30
(30, 19, '2025-10-07 18:00:00'), (30, 20, '2025-10-08 19:00:00');

INSERT INTO "comment" (content, userid, postid)
VALUES
('This is a great bunny care tip!', 2, 1),
('I love the bunny play area, so cute!', 3, 2),
('My bunny loves fresh carrots too!', 4, 3),
('Thanks for the grooming advice, it really helped!', 5, 4),
('Your bunny is so cute exploring the yard!', 6, 5),
('This hideout is amazing for bunnies!', 7, 6),
('Bunnies hopping in the garden are so adorable!', 8, 7),
('A playdate sounds like so much fun for them!', 9, 8),
('My bunny would love these treats!', 2, 9),
('My bunny loves this cozy corner, will try it!', 1, 10),
('Your bunny looks so relaxed in the sun!', 11, 11),
('Great obstacle course setup for bunnies!', 10, 12),
('I love this bonding session, so sweet!', 1, 13),
('This is so helpful for keeping my bunny healthy!', 3, 14),
('A hammock for a bunny? That is adorable!', 5, 15);