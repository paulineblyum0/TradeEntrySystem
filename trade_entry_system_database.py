import psycopg2

def get_db_connection():
    connection = psycopg2.connect(
        dbname="trades_db",
        user="postgres",
        password="postgres", 
        host="localhost",
        port="5432"
    )
    cursor = connection.cursor()
    return connection, cursor
