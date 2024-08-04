
# Note: the module name is psycopg, not psycopg3
import psycopg
import yaml 

with open('./config.yml', 'r') as file:
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
                    CREATE TABLE IF NOT EXISTS cats(
                        id SERIAL PRIMARY KEY,
                        label VARCHAR(100), 
                        data bytea 
                    )
                """)
                conn.commit()
            except Exception as e:
                print(e)

def insert_image(label, binary_data):
    try:
        conn = psycopg.connect(conn_str)
        cursor = conn.cursor()

        # Insert the image data into the images table
        insert_query = """
        INSERT INTO cats(label, data)
        VALUES (%s, %s)
        """
        print("Type of downloaded image", "")
        cursor.execute(insert_query, (label, psycopg.Binary(binary_data)))

        # Commit the transaction
        conn.commit()

        print("Image inserted successfully")
    except Exception as error:
        print(f"Error inserting image: {error}")
        conn.rollback()
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


def get_all_cats():
    with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute("SELECT * FROM cats;")
                objects = cursor.fetchall()
                return objects
            except Exception as e:
                print(e)

def get_cats_from(start, end):
    try:
        conn = psycopg.connect(conn_str)
        cursor = conn.cursor()
        cursor.execute("""SELECT * FROM cats 
                                        WHERE id BETWEEN
                                         {start} AND {end};""".format(start=start, end=end))
        cats = cursor.fetchall()
        return cats
    except Exception as error:
        print(f"Error fetching table length: {error}")
        return -1
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

def images_table_len():
    try:
        # Define the query to count rows in the table
        conn = psycopg.connect(conn_str)
        cursor = conn.cursor()
        query = f"SELECT COUNT(*) FROM cats;"
        cursor.execute(query)

        # Fetch the result
        row_count = cursor.fetchone()[0]

        return row_count
    except Exception as error:
        print(f"Error fetching table length: {error}")
        return -1
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()
 
            


