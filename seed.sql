TRUNCATE TABLE "user_trust" CASCADE;
TRUNCATE TABLE "user" CASCADE;

CREATE TABLE IF NOT EXISTS "user" (
    userid INTEGER PRIMARY KEY,
    phone TEXT NOT NULL,
    username TEXT NOT NULL,
    realname TEXT NOT NULL,
    profileimage TEXT
);

CREATE TABLE IF NOT EXISTS "user_trust" (
    user1 INTEGER REFERENCES "user"(userid),
    user2 INTEGER REFERENCES "user"(userid),
    tstatus TEXT CHECK (tstatus IN ('trusts', 'blocked', 'ignored', 'none')),
    PRIMARY KEY (user1, user2)
);

INSERT INTO "user" (userid, phone, username, realname, profileimage) 
VALUES 
    (1, '11111111111', 'john_doe', 'John Doe', '/images/john.png'),
    (2, '22222222222', 'jane_smith', 'Jane Smith', '/images/jane.png'),
    (3, '33333333333', 'bob_wilson', 'Bob Wilson', '/images/bob.png'),
    (4, '44444444444', 'alice_brown', 'Alice Brown', '/images/alice.png'),
    (5, '55555555555', 'charlie_davis', 'Charlie Davis', '/images/charlie.png'),
    (6, '66666666666', 'emma_taylor', 'Emma Taylor', '/images/emma.png'),
    (7, '77777777777', 'david_miller', 'David Miller', '/images/david.png'),
    (8, '88888888888', 'sarah_jones', 'Sarah Jones', '/images/sarah.png'),
    (9, '99999999999', 'mike_anderson', 'Mike Anderson', '/images/mike.png'),
    (10, '10101010101', 'lisa_white', 'Lisa White', '/images/lisa.png');

INSERT INTO "user_trust" (user1, user2, tstatus) VALUES
    (1, 2, 'trusts'),
    (1, 3, 'blocked'),
    (1, 4, 'ignored'),
    (1, 5, 'trusts'),
    (1, 6, 'none');

INSERT INTO "user_trust" (user1, user2, tstatus) VALUES
    (2, 1, 'trusts'),
    (2, 3, 'trusts'),
    (2, 4, 'blocked'),
    (2, 7, 'ignored');

INSERT INTO "user_trust" (user1, user2, tstatus) VALUES
    (3, 1, 'trusts'),
    (3, 2, 'trusts'),
    (3, 4, 'trusts');

INSERT INTO "user_trust" (user1, user2, tstatus) VALUES
    (4, 1, 'trusts'),
    (4, 5, 'blocked'),
    (4, 6, 'trusts');

INSERT INTO "user_trust" (user1, user2, tstatus) VALUES
    (5, 1, 'trusts'),
    (5, 2, 'ignored'),
    (5, 8, 'trusts');

INSERT INTO "user_trust" (user1, user2, tstatus) VALUES
    (6, 7, 'trusts'),
    (7, 6, 'trusts'),
    (8, 9, 'blocked'),
    (9, 10, 'ignored'),
    (10, 1, 'trusts');