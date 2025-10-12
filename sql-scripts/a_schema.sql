-- Drop Tables
DROP TABLE IF EXISTS "role" CASCADE;
DROP TABLE IF EXISTS "registereduser" CASCADE;
DROP TABLE IF EXISTS "post" CASCADE;
DROP TABLE IF EXISTS "following";
DROP TABLE IF EXISTS "like";
DROP TABLE IF EXISTS "comment";
DROP TABLE IF EXISTS "location";
DROP TABLE IF EXISTS "bunny_care";

-- Location Table
CREATE TABLE "location" (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    latitude FLOAT,
                    longitude FLOAT,
                    CONSTRAINT unique_lat_long UNIQUE (latitude, longitude)
);

-- RegisteredUser Table
CREATE TABLE "registereduser" (
                      id SERIAL PRIMARY KEY,
                      username VARCHAR(50) UNIQUE NOT NULL,
                      password VARCHAR(255) NOT NULL,
                      name VARCHAR(50),
                      surname VARCHAR(50),
                      email VARCHAR(100) UNIQUE NOT NULL,
                      address VARCHAR(255),
                      isactivated BOOLEAN DEFAULT FALSE,
                      datecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      lastlogin TIMESTAMP,
                      isadmin BOOLEAN DEFAULT FALSE,
                      FOREIGN KEY (address) REFERENCES location(name)

                      
);

-- Post Table
CREATE TABLE "post" (
                      id SERIAL PRIMARY KEY,
                      registereduserid INT NOT NULL,
                      description TEXT,
                      image TEXT,
                      compressedimage TEXT,
                      location_name VARCHAR(255),
                      timecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      likes INT DEFAULT 0,
                      comments INT DEFAULT 0,
                      isdeleted BOOLEAN DEFAULT FALSE,
                      isforad BOOLEAN DEFAULT FALSE,
                      FOREIGN KEY (registereduserid) REFERENCES registereduser(id) ON DELETE CASCADE,
                      FOREIGN KEY (location_name) REFERENCES location(name)

);
--Following Table
CREATE TABLE "following" (
                           idfollower INT,
                           idfollowing INT,
                           PRIMARY KEY (idfollower, idfollowing),
                           FOREIGN KEY (idfollower) REFERENCES registereduser(id) ON DELETE CASCADE,
                           FOREIGN KEY (idfollowing) REFERENCES registereduser(id) ON DELETE CASCADE,
                           CONSTRAINT chk_self_follow CHECK (idfollower <> idfollowing)
);

--Like Table
CREATE TABLE "like" (
                      postid INT,
                      userid INT,
                      timecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (postid, userid),
                      FOREIGN KEY (postid) REFERENCES post(id) ON DELETE CASCADE,
                      FOREIGN KEY (userid) REFERENCES registereduser(id) ON DELETE CASCADE
);

-- -- Comment Table
CREATE TABLE "comment" (
                         id SERIAL PRIMARY KEY,
                         content TEXT NOT NULL,
                         userid INT NOT NULL,
                         postid INT NOT NULL,
                         timecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (userid) REFERENCES registereduser(id) ON DELETE CASCADE,
                         FOREIGN KEY (postid) REFERENCES post(id) ON DELETE CASCADE
);

CREATE TABLE ROLE (
					id SERIAL PRIMARY KEY,
					name TEXT NOT NULL
);

CREATE TABLE USER_ROLE (
					id SERIAL PRIMARY KEY,
					user_id INT NOT NULL,
					role_id INT NOT NULL,
					FOREIGN KEY (user_id) REFERENCES registereduser(id) ON DELETE CASCADE,
					FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

-- Bunny Care Table
CREATE TABLE "bunny_care" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);

--
-- -- Chat Table
-- CREATE TABLE Chat (
--                       chatID SERIAL PRIMARY KEY,
--                       adminID INT,
--                       FOREIGN KEY (adminID) REFERENCES RegisteredUser(userID) ON DELETE SET NULL
-- );
--
-- -- ChatParticipant Table
-- CREATE TABLE ChatParticipant (
--                                  chatID INT,
--                                  userID INT,
--                                  PRIMARY KEY (chatID, userID),
--                                  FOREIGN KEY (chatID) REFERENCES Chat(chatID) ON DELETE CASCADE,
--                                  FOREIGN KEY (userID) REFERENCES RegisteredUser(userID) ON DELETE CASCADE
-- );
-- -- Message Table
-- CREATE TABLE Message (
--                          messageID SERIAL PRIMARY KEY,
--                          chatID INT NOT NULL,
--                          userID INT NOT NULL,
--                          content TEXT NOT NULL,
--                          timeSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--                          FOREIGN KEY (chatID) REFERENCES Chat(chatID) ON DELETE CASCADE,
--                          FOREIGN KEY (userID) REFERENCES RegisteredUser(userID) ON DELETE CASCADE
-- );
