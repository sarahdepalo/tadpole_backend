CREATE TABLE users (
    id serial PRIMARY KEY,
    firstName text NOT NULL,
    lastName text,
    email varchar(200),
    password varchar(255) NOT NULL,
    primaryLocationState text,
    primaryLocationCity text,
    primaryLocationZip integer,
    favoriteLocationCity text,
    favoriteLocationZip integer,
    favoriteLocationCity2 text,
    favoriteLocationZip2 integer,
    UNIQUE (email)
);