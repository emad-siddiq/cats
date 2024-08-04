import yaml 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Form, File, UploadFile
from db.database import  insert_image, create_table, get_paginated_cats_from_db
import concurrent.futures
import time
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Generator
from math import ceil
from fastapi import FastAPI, Query, HTTPException
import requests


app = FastAPI()
CAT_API_BASE = "https://api.thecatapi.com/v1/images/"

with open('./../config.yml', 'r') as file:
    config = yaml.safe_load(file)

print(config["CAT_API_KEY"])

"""Call Cat API, requesting 10 random cats
params:
    limit: int, max cats to download
    order: ASCD | DESC | RAND
"""
def call_cat_api(limit=10, order="RAND"):
        url = CAT_API_BASE + """search?limit={LIMIT}&order={ORDER}&api_key={CAT_API_KEY}""".format(LIMIT=limit, ORDER=order, CAT_API_KEY=config["CAT_API_KEY"])
        return requests.get(url, timeout=10)


"""Downloads a hundred images and inserts them inside the images table"""
def get_hundred_random_cats():
    cats = []
    while len(cats) < 100:
        with ThreadPoolExecutor(max_workers=16) as executor:
            future_cats = {executor.submit(call_cat_api)}
            for future in concurrent.futures.as_completed(future_cats):
                 if future.result():
                    cats += future.result().json()
                 if len(cats) > 100:
                      return cats
    return cats[:100]


def download_and_get_binary(url,label, timeout):
    print("Downloading image")
    img_binary = requests.get(url, timeout=timeout).content
    return [label, img_binary]

def download_images(cats):
    count = 0
    with ThreadPoolExecutor(max_workers=16) as executor:
        future_images = {executor.submit(download_and_get_binary, i["url"], i["id"], 10) for i in cats}
        for future in concurrent.futures.as_completed(future_images):
            result = future.result()
            count += 1
            print("Download Image #", count)
            insert_image(result[0], result[1])  


### MAIN
def main():
    print("Start main")

    start = time.perf_counter()
    print("Creating table")
    create_table()

    cats = get_hundred_random_cats()

    print(f"Total time: {time.perf_counter() - start}")
    download_images(cats)

main()




# GET endpoint for paginated images
@app.get("/cats")
async def get_cats(page: int = Query(1, alias="page"), per_page: int = Query(10, alias="per_page")):
    return get_paginated_cats_from_db(page, per_page)


app.mount("/", StaticFiles(directory="./static",html = True), name="static")





