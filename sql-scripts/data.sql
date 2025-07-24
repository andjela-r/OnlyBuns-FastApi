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
('Kralja Aleksandra 2, Leskovac', 42.9981, 21.9461);

INSERT INTO registereduser 
(username, password, name, surname, email, address, isactivated, isadmin) 
VALUES
('alice_smith', 'password1', 'Alice', 'Smith', 'alice@example.com', 'Bulevar kralja Aleksandra 73, Beograd', TRUE, FALSE),
('bob_brown', 'password2', 'Bob', 'Brown', 'bob@example.com', 'Knez Mihailova 5, Beograd', TRUE, FALSE),
('admin_user', 'adminpass', 'Admin', 'RegisteredUser', 'admin@example.com', 'Zmaj Jovina 22, Novi Sad', TRUE, TRUE),
('charlie_jones', 'password3', 'Charlie', 'Jones', 'charlie@example.com', 'Cara Dušana 13, Niš', TRUE, FALSE),
('dana_white', 'password4', 'Dana', 'White', 'dana@example.com', 'Kralja Petra I 12, Kragujevac', TRUE, FALSE),
('eve_williams', 'password5', 'Eve', 'Williams', 'eve@example.com', 'Trg slobode 1, Subotica', TRUE, FALSE),
('frank_moore', 'password6', 'Frank', 'Moore', 'frank@example.com', 'Obilićev venac 18, Beograd', TRUE, FALSE),
('grace_hill', 'password7', 'Grace', 'Hill', 'grace@example.com', 'Bulevar Oslobođenja 102, Novi Sad', TRUE, FALSE),
('henry_adams', 'password8', 'Henry', 'Adams', 'henry@example.com', 'Vojvode Stepe 14, Čačak', TRUE, FALSE),
('ivy_green', 'password9', 'Ivy', 'Green', 'ivy@example.com', 'Kralja Aleksandra 2, Leskovac', TRUE, FALSE),
('jack_thomas', 'password10', 'Jack', 'Thomas', 'jack@example.com', 'Bulevar Evrope 12, Novi Sad', TRUE, FALSE),
('kate_martin', 'password11', 'Kate', 'Martin', 'kate@example.com', 'Nemanjina 4, Beograd', TRUE, FALSE),
('admin_user2', 'adminpass2', 'Admin', 'UserTwo', 'admin2@example.com', 'Trg Republike 1, Beograd', TRUE, TRUE),
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

INSERT INTO USER_ROLE (user_id, role_id) VALUES (1, 1); --USER 1 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (2, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (3, 2); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (4, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (5, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (6, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (7, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (8, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (9, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (10, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (11, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (12, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (13, 2); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (14, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (15, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (16, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (17, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (18, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (19, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (20, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (21, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (22, 1); --USER 2 ROLE USER
INSERT INTO USER_ROLE (user_id, role_id) VALUES (23, 1); --USER 2 ROLE USER


INSERT INTO "post"
(registereduserid, description, image, location_name, timecreated)
VALUES
(1, 'Sharing tips on bunny care', 'images/post1.jpg', 'Bulevar kralja Aleksandra 73, Beograd', '2025-04-29 10:16:45'),
(2, 'New bunny play area setup', 'images/post2.jpg', 'Knez Mihailova 5, Beograd', '2025-05-08 22:49:51'),
(4, 'Bunny enjoying fresh carrots', 'images/post3.jpg', 'Kralja Petra I 12, Kragujevac', '2025-05-01 02:03:32'),
(5, 'Grooming advice for bunnies', 'images/post4.jpg', 'Trg slobode 1, Subotica', '2025-05-01 21:25:57'),
(6, 'Bunny exploring the backyard', 'images/post5.jpg', 'Obilićev venac 18, Beograd', '2025-04-27 05:14:21'),
(7, 'Building a bunny hideout', 'images/post6.jpg', 'Bulevar Oslobođenja 102, Novi Sad', '2025-05-16 07:19:31'),
(8, 'Bunny hopping around the garden', 'images/post7.jpg', 'Vojvode Stepe 14, Čačak', '2025-04-28 15:08:35'),
(9, 'Bunny playdate fun', 'images/post8.jpg', 'Kralja Aleksandra 2, Leskovac', '2025-04-30 13:37:05'),
(10, 'Favorite bunny treats', 'images/post9.jpg', 'Bulevar Evrope 12, Novi Sad', '2025-06-01 08:19:29'),
(1, 'Creating a cozy bunny corner', 'images/post10.jpg', 'Bulevar kralja Aleksandra 73, Beograd', '2024-10-24 08:00:00'),
(4, 'Bunny enjoying a sunny day', 'images/post11.jpg', 'Kralja Petra I 12, Kragujevac', '2025-05-25 14:55:40'),
(12, 'Setting up a bunny obstacle course', 'images/post12.jpg', 'Nemanjina 4, Beograd', '2024-10-26 08:00:00'),
(14, 'Bunny bonding session', 'images/post13.jpg', 'Bulevar Oslobođenja 1, Novi Sad', '2025-06-29 23:28:15'),
(15, 'Tips for bunny health checks', 'images/post14.jpg', 'Kneza Miloša 16, Kragujevac', '2025-06-11 13:31:52'),
(2, 'Bunny napping in a hammock', 'images/post15.jpg', 'Knez Mihailova 5, Beograd', '2025-06-11 21:22:52'),
(6, 'Bunny running in the park', 'images/post16.jpg', 'Obilićev venac 18, Beograd', '2025-05-16 02:01:28'),
(7, 'Bunny playing with new toys', 'images/post17.jpg', 'Bulevar Oslobođenja 102, Novi Sad', '2024-10-31 08:00:00'),
(8, 'Bunny enjoying a new treat', 'images/post18.jpg', 'Vojvode Stepe 14, Čačak', '2025-06-16 13:06:24'),
(9, 'Bunny meeting a new friend', 'images/post19.jpg', 'Kralja Aleksandra 2, Leskovac', '2024-11-01 08:00:00'),
(10, 'Bunny’s first adventure outside', 'images/post20.jpg', 'Bulevar Evrope 12, Novi Sad', '2024-11-02 08:00:00');

INSERT INTO "following" (idfollower, idfollowing)
VALUES
(1, 2),
(1, 4), 
(2, 1), 
(2, 5), 
(3, 6),
(4, 2), 
(4, 7), 
(5, 8), 
(6, 1), 
(7, 3),
(8, 2),
(9, 4),
(10, 5), 
(11, 6), 
(12, 7), 
(1, 3),
(1, 5),
(2, 3), 
(3, 4), 
(3, 7), 
(4, 5), 
(5, 6), 
(6, 2),
(6, 9), 
(7, 1),
(7, 8),
(8, 3),
(8, 10),
(9, 1),
(9, 7),
(10, 2),
(10, 11),
(11, 4),
(12, 6), 
(12, 9);

INSERT INTO "like" (postid, userid, timecreated)
VALUES
(1, 2, '2025-05-11 19:25:12'),
(1, 3, '2025-05-03 10:16:45'),
(1, 4, '2025-05-27 16:51:53'),
(1, 5, '2025-05-24 18:38:21'),
(2, 7, '2025-05-14 13:08:48'),
(2, 8, '2025-05-10 22:49:51'),
(3, 10, '2025-05-09 10:34:55'),
(3, 11, '2025-06-27 07:56:50'),
(3, 12, '2025-06-10 23:08:56'),
(3, 13, '2025-05-04 02:03:32'),
(4, 14, '2025-05-03 21:25:57'),
(4, 15, '2025-05-10 02:19:32'),
(4, 16, '2025-05-22 05:27:48'),
(4, 17, '2025-05-23 14:08:21'),
(5, 18, '2025-06-19 01:33:47'),
(5, 19, '2025-06-28 10:48:19'),
(5, 20, '2025-05-03 13:49:59'),
(5, 21, '2025-06-24 11:47:44'),
(6, 22, '2025-05-20 07:19:31'),
(6, 23, '2025-06-22 21:48:20'),
(6, 1, '2025-06-10 17:33:07'),
(6, 2, '2025-05-22 09:39:49'),
(7, 3, '2025-06-13 14:43:58'),
(7, 4, '2025-06-27 05:05:18'),
(7, 5, '2025-05-28 00:13:52'),
(7, 6, '2025-05-01 15:08:35'),
(8, 7, '2025-05-16 12:01:59'),
(14, 19, '2025-06-15 13:31:52'),
(8, 6, '2025-05-04 13:37:05'),
(11, 11, '2025-05-30 14:55:40'),
(9, 4, '2025-06-03 08:19:29'),
(1, 11, '2025-06-20 15:34:47'),
(15, 4, '2025-06-16 21:22:52'),
(16, 9, '2025-05-21 02:01:28'),
(1, 14, '2025-06-29 02:50:44'),
(2, 13, '2025-06-21 04:10:25'),
(18, 18, '2025-06-24 20:06:43'),
(3, 14, '2025-05-31 14:36:59'),
(5, 11, '2025-05-02 05:14:21'),
(5, 5, '2025-06-08 15:57:43'),
(3, 20, '2025-06-19 18:47:56'),
(2, 3, '2025-06-12 04:11:39'),
(2, 9, '2025-06-22 06:50:28'),
(13, 3, '2025-07-01 23:28:15'),
(2, 6, '2025-06-27 21:57:22'),
(1, 10, '2025-06-17 04:46:48'),
(18, 11, '2025-06-20 13:06:24'),
(8, 8, '2025-06-11 00:45:46');

INSERT INTO "comment" (content, userid, postid)
VALUES
('This is a great bunny care tip!', 2, 1),
('I love the bunny play area, so cute!', 3, 2),
('My bunny loves fresh carrots too!', 4, 3),
('Thanks for the grooming advice, it really helped!', 5, 4),
('Your bunny is so cute, I need to try this!', 6, 5),
('This hideout is amazing for bunnies!', 7, 6),
('Bunnies hopping in the garden are so adorable!', 8, 7),
('I’m going to try this bunny treat recipe!', 9, 8),
('Your bunny looks so relaxed in the sun!', 2, 9),
('Great obstacle course setup for bunnies!', 10, 10),
('I love this bonding session, so sweet!', 11, 11),
('How do you make sure the bunny stays healthy?', 12, 12),
('My bunny loves this cozy corner, will try it!', 1, 13),
('Such a cute bunny, thank you for sharing!', 3, 14),
('I need to bunny-proof my home as well!', 5, 15);

