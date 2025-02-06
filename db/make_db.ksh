# !/bin/bash

# Wait for PostgreSQL to be ready
until psql -h localhost -U postgres -c '\l'; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Create dev and test databases if they don't exist
echo "Creating dev and test databases if they don't exist..."
psql -U postgres -d postgres -c "SELECT 'CREATE DATABASE dev' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dev');"
psql -U postgres -d postgres -c "SELECT 'CREATE DATABASE test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test');"

echo "Databases created (if not already present)."

# export PGUSER=postgres
# psql <<- EOSQL
#     CREATE USER docker;
#     CREATE DATABASE docker;
#     GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
# EOSQL
