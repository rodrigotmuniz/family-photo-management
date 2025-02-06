-- Ensure the script runs without stopping on errors
\set ON_ERROR_STOP on

-- Create the dev database if it doesn't exist
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dev') THEN
        CREATE DATABASE dev;
    END IF;
END
$$;

-- Create the test database if it doesn't exist
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test') THEN
        CREATE DATABASE test;
    END IF;
END
$$;
