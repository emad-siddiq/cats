
# Note: the module name is psycopg, not psycopg3
import psycopg
import yaml 

with open('./../config.yml', 'r') as file:
    config = yaml.safe_load(file)

conn_str = """dbname={dbname}
                user={user} 
                host={host} 
                password={password}
                port={port}
            """.format(dbname=config['pg']['dbname'], 
                       host = config['pg']['host'],
                       user = config['pg']['user'],
                       password=config['pg']['pwd'], 
                       port=config['pg']['port'])
                       

def create_table():
    with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS cat_images (
                        id SERIAL PRIMARY KEY,
                        label VARCHAR(100), 
                        data bytea 
                    )
                """)
                conn.commit()
            except Exception as e:
                print(e)


def insert_image(label, binary_data):
   with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute("""
                    INSERT INTO images (label, data)
                    VALUES (%s, %s)
                """, (label, psycopg.Binary(binary_data)))
                conn.commit()
                conn.close()
            except Exception as e:
                print(e)

def get_cats_data():
    with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute("SELECT * FROM cat_images")
                objects = cursor.fetchall()
                return objects
            except Exception as e:
                print(e)
            


