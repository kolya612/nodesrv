create table users (
    id uuid not null unique,
    name varchar(50) not null,
    email varchar(24) not null,
    sex int
);
