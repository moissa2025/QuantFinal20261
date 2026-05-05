-- 0002_schemas.sql

SET DATABASE = gqx_db;
-- 0002_schemas.sql
-- Create all logical schemas for the GQX platform

SET DATABASE = gqx_db;

CREATE SCHEMA IF NOT EXISTS aml;
ALTER SCHEMA aml OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS api;
ALTER SCHEMA api OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS auth;
ALTER SCHEMA auth OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS kyc;
ALTER SCHEMA kyc OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS ledger;
ALTER SCHEMA ledger OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS onboarding;
ALTER SCHEMA onboarding OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS reconciliation;
ALTER SCHEMA reconciliation OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS risk;
ALTER SCHEMA risk OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS trading;
ALTER SCHEMA trading OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS users;
ALTER SCHEMA users OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS wallet;
ALTER SCHEMA wallet OWNER TO gqx_user;

CREATE SCHEMA IF NOT EXISTS intelligence;
ALTER SCHEMA intelligence OWNER TO gqx_user;

