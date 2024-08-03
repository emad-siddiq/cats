import yaml 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Form, File, UploadFile
from db.database import  insert_image, create_table, get_cats_data
import requests
from PIL import Image
from io import BytesIO
import psycopg2 

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
        url = CAT_API_BASE + """search?
                               limit={LIMIT}
                               &order={ORDER}
                               &api_key={CAT_API_KEY}
                               """.format(LIMIT=limit, ORDER=order, CAT_API_KEY=config["CAT_API_KEY"])
        return requests.get(url, timeout=10)

"""Downloads a hundred images and inserts them inside the images table"""
def get_hundred_random_cats():
    print("Loading a hundred cats...")
    cat_count = 0
    while cat_count < 100:
        resp = call_cat_api()
        cats_needed = min(10, 100-cat_count) #fetch 10 cats, unless > 90
        for i in resp.json()[:cats_needed]:
              img = requests.get(i["url"], timeout=10)
              insert_image(i["id"], img.content)  
              cat_count += 1  
        
create_table()
get_hundred_random_cats()

@app.get("/cats")
async def leads():
    return get_cats_data()

app.mount("/", StaticFiles(directory="static",html = True), name="static")
