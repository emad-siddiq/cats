
# Note: the module name is psycopg, not psycopg3
import psycopg
import yaml 
from fastapi import HTTPException
from typing import List, Dict
from pydantic import BaseModel
import psycopg
import yaml
import base64

with open('./../config.yml', 'r') as file:
    config = yaml.safe_load(file)


db_config = {
    'user': config['pg']['user'],
    'password': config['pg']['pwd'], 
    'dbname': config['pg']['dbname'],
    'host': config['pg']['host'],
    'port': config['pg']['port'],
} 

def create_table(db_config=db_config):

    create_table_query = """
    DROP TABLE IF EXISTS cats;
    CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    data BYTEA NOT NULL
);
"""
    try:
        # Connect to the PostgreSQL database
        conn = psycopg.connect(**db_config)
        cur = conn.cursor()

        # Execute the create table query
        cur.execute(create_table_query)
        conn.commit()

        # Close the cursor and connection
        cur.close()
        conn.close()
        
        print("Table 'cats' created successfully")

    except Exception as e:
        print(f"Error creating table: {e}")

def insert_image(label: str, binary_data: bytes, db_config=db_config):
    try:
        conn = psycopg.connect(**db_config)
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


def get_all_cats(dbconfig=db_config):
    with psycopg.connect(**db_config) as conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute("SELECT * FROM cats;")
                objects = cursor.fetchall()
                return objects
            except Exception as e:
                print(e)

def get_cats_from(start, end, db_config=db_config):
    try:
        conn = psycopg.connect(**db_config)
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

def images_table_len(db_config=db_config):
    try:
        # Define the query to count rows in the table
        conn = psycopg.connect(**db_config)
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


"""Images are obtained in bytes (memoryview) from the postgres tables
   We convert this to a base64 encoded byte string to send as JSON
"""
def decode(bytea_data):
    base64_img = base64.b64encode(bytea_data) #Encode the bytes-like object s using Base64 and return the encoded bytes.
    return base64_img


def get_paginated_images_from_db(page: int, per_page: int, db_config: Dict = db_config):

    """https://docs.python.org/3/library/base64.html
    """

    conn = psycopg.connect(**db_config)
    cursor = conn.cursor()  

    try:
        
        # Count total images
        cursor.execute("SELECT COUNT(*) FROM cats;")
        total_images = cursor.fetchone()[0]

        # Calculate pagination details
        offset = (page - 1) * per_page

        # Retrieve paginated images
        cursor.execute("SELECT * FROM cats ORDER BY id LIMIT %s OFFSET %s;", (per_page, offset))
        images = cursor.fetchall()

        # Construct response
        response = {
            "page":page,
            "per_page":per_page,
            "total_images":total_images,
            "images": [{
                "id":image[0],
                "image_url":image[1],
                "data":decode(image[2])} for image in images]
        }

        return response
    except Exception as error:
        print(f"Error fetching paginated images: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        conn.close()

 
            


