from peewee import PostgresqlDatabase

pg_db = PostgresqlDatabase(
    "junction2023",
    user="postgres",
    password="Junction2023!",
    host="junction2023.postgres.database.azure.com",
    port=5432,
)
