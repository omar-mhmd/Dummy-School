-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2019-09-24 14:15:31.607

-- tables
-- Table: Admin
CREATE TABLE IF NOT EXISTS Admin (
    id integer NOT NULL CONSTRAINT Admin_pk PRIMARY KEY,
    username text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    refresh_token text NOT NULL UNIQUE,
    password text NOT NULL,
    CONSTRAINT AK_1 UNIQUE (email)
);

-- Table: Files
CREATE TABLE IF NOT EXISTS Files (
    id integer NOT NULL CONSTRAINT Files_pk PRIMARY KEY,
    file_path text NOT NULL,
    file_name text NOT NULL,
    grade_id integer NOT NULL,
    CONSTRAINT Files_Grade FOREIGN KEY (grade_id)
    REFERENCES Grade (id)
    ON DELETE CASCADE
);

-- Table: Grade
CREATE TABLE IF NOT EXISTS Grade (
    id integer NOT NULL CONSTRAINT Grade_pk PRIMARY KEY,
    name text NOT NULL
);

-- Table: Professor
CREATE TABLE IF NOT EXISTS Professor (
    id integer NOT NULL CONSTRAINT Prof_pk PRIMARY KEY,
    pin text NOT NULL,
    expiry_date date NOT NULL,
    grade_id integer NOT NULL,
    CONSTRAINT AK_0 UNIQUE (pin),
    CONSTRAINT Professor_Grade FOREIGN KEY (grade_id)
    REFERENCES Grade (id)
    ON DELETE CASCADE
);

-- Table: Students
CREATE TABLE IF NOT EXISTS Students (
    id integer NOT NULL CONSTRAINT Students_pk PRIMARY KEY,
    pin text NOT NULL,
    expiry_date date NOT NULL,
    grade_id integer NOT NULL,
    CONSTRAINT Students_Grade FOREIGN KEY (grade_id)
    REFERENCES Grade (id)
    ON DELETE CASCADE
);

-- End of file.

