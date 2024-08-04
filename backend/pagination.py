from fastapi import FastAPI, Query, HTTPException
from typing import List, Dict
from pydantic import BaseModel
import psycopg2
import yaml
import json 
import base64

with open('./config.yml', 'r') as file:
    config = yaml.safe_load(file)

cat_table = "cat"

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

class Image(BaseModel):
    id: int
    image_url: str
    data: bytes

class PaginatedImagesResponse(BaseModel):
    page: int
    per_page: int
    total_images: int
    images: List[Image]

def get_paginated_images_from_db(page: int, per_page: int) -> PaginatedImagesResponse:
    # Connect to your PostgreSQL database


    """https://docs.python.org/3/library/base64.html
    """
    def decode(bytea_data):
        base64_img = base64.b64encode(bytea_data) #Encode the bytes-like object s using Base64 and return the encoded bytes.
        return base64_img
        
    conn = psycopg2.connect(conn_str)
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
        response = PaginatedImagesResponse(
            page=page,
            per_page=per_page,
            total_images=total_images,
            images=[Image(id=image[0], image_url=image[1], data=decode(image[2])) for image in images]
        )

        return response
    except Exception as error:
        print(f"Error fetching paginated images: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        conn.close()
