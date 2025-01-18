CREATE TABLE IF NOT EXISTS "user" (
    userid INTEGER PRIMARY KEY,
    phone TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    realname TEXT NOT NULL,
    profileimage TEXT
);

CREATE TABLE IF NOT EXISTS "user_trust" (
    user1 INTEGER REFERENCES "user"(userid),
    user2 INTEGER REFERENCES "user"(userid),
    tstatus TEXT CHECK (tstatus IN ('trusts', 'blocked', 'ignored', 'none')),
    PRIMARY KEY (user1, user2)
);