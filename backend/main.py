import yaml 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Form, File, UploadFile
from db.database import  insert_image, create_table, get_paginated_cats_from_db,select_by_breed_id, get_breeds, decode
import concurrent.futures
import time
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Generator
from math import ceil
from fastapi import FastAPI, Query, HTTPException
import requests
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

# Allow CORS
origins = [
    "http://localhost",
    "http://localhost:8000",  # React or other frontend development server
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows CORS for specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

CAT_API_BASE = "https://api.thecatapi.com/v1/images/"

with open('./../config.yml', 'r') as file:
    config = yaml.safe_load(file)

print(config["CAT_API_KEY"])

"""Call Cat API, requesting 10 random cats
params:
    limit: int, max cats to download
    order: ASCD | DESC | RAND
"""
def call_cat_api(limit=10, order="RAND", breed=None):
        url = CAT_API_BASE + """search?has_breeds=1&limit={LIMIT}&order={ORDER}&api_key={CAT_API_KEY}""".format(LIMIT=limit, ORDER=order, CAT_API_KEY=config["CAT_API_KEY"])
        if breed:
            print(breed)
            url += "&breed_ids=" + breed
            print(url)
        return requests.get(url, timeout=10)


"""Downloads a hundred images and inserts them inside the images table"""
def get_hundred_random_cats(breed=None):
    cats = []
    while len(cats) < 100:
        with ThreadPoolExecutor(max_workers=16) as executor:
            future_cats = {executor.submit(call_cat_api, 10, "RAND", breed)}
            for future in concurrent.futures.as_completed(future_cats):
                 if future.result():
                    cats += future.result().json()
                 if len(cats) > 100:
                      return cats
    return cats[:100]


def download_and_get_binary(cat_json, timeout):
    url = cat_json["url"]
    breed_id = ""
    breed_name = ""
    other_details = ""
    if cat_json["breeds"] and len(cat_json["breeds"]) > 0:
          breed_id = cat_json["breeds"][0]["id"]
          breed_name = cat_json["breeds"][0]["name"]
          
          details = ["Temperament", "Origin", "Life_span"]
          other_details = []
          for i in details:
                if i.lower() in cat_json["breeds"][0]:
                      other_details.append(i + ": "+ cat_json["breeds"][0][i.lower()])
    print(breed_id, breed_name, other_details)
    img_binary = requests.get(url, timeout=timeout).content
    return [breed_id, breed_name, other_details, img_binary]

def download_images(cats):
    count = 0
    print(cats[0])
    with ThreadPoolExecutor(max_workers=16) as executor:
        future_images = {executor.submit(download_and_get_binary, i, 10) for i in cats}
        for future in concurrent.futures.as_completed(future_images):
            result = future.result()
            count += 1
            print("Download Image #", count)
            insert_image(str(result[0]), str(result[1]), str(result[2]), result[3])  


### MAIN
def main():
    print("Start main")

    start = time.perf_counter()
    print("Creating table")
    create_table()

    cats = get_hundred_random_cats(breed=None)

    print(f"Total time: {time.perf_counter() - start}")
    download_images(cats)

main()




# GET endpoint for paginated images
@app.get("/cats")
async def get_cats(page: int = Query(1, alias="page"), per_page: int = Query(10, alias="per_page")):
    return get_paginated_cats_from_db(page, per_page)

# Define the request body model
class Item(BaseModel):
    value: str


@app.get("/breeds")
async def breeds():
    
    return get_breeds()

# Define the POST endpoint
@app.post("/set_breed/")
async def create_item(item: Item):
    print("BREED", item.value)
    # Select only images that are of this breed
    
    cats = select_by_breed_id(item.value)

    response = {
            "page":1,
            "per_page":len(cats),
            "total_images":len(cats),
            "images": [{
                "id": cat[0],
                "breed_id":cat[1],
                "breed_name":cat[2],
                "other_details":cat[3],
                "data":decode(cat[4])} for cat in cats]
        }


app.mount("/", StaticFiles(directory="./static",html = True), name="static")





