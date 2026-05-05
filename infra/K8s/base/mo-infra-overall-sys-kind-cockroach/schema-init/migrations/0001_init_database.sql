-- 0001_init_database.sql
-- Initial CockroachDB setup for the GQX platform

-- Create the application database
CREATE DATABASE IF NOT EXISTS gqx_db;

-- Create the application user
CREATE USER IF NOT EXISTS gqx_user;

-- Grant full privileges on the database
GRANT ALL ON DATABASE gqx_db TO gqx_user;

-- Switch into the database for subsequent migrations
SET DATABASE = gqx_db;

