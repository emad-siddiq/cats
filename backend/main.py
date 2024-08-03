import yaml 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Form, File, UploadFile
from db.database import  insert_image, create_table, get_cats_data
import requests
from PIL import Image
from io import BytesIO
import psycopg2 
import concurrent.futures
import urllib.request

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
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_to_url = {executor.submit(call_cat_api): i for i in range(5)}
            for future in concurrent.futures.as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    resp = future.result()
                    cats_needed = min(10, 100-cat_count) #fetch 10 cats, unless > 90
                    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                        future_to_url_2 = {executor.submit(download_and_insert_image, i["url"], i["id"], 10): i for i in resp.json()[:cats_needed]}
                        for future in  concurrent.futures.as_completed(future_to_url_2):
                            cat_count += 1
                            if cat_count >= 100:
                                return cat_count
                
                except Exception as exc:
                    print('%r generated an exception: %s' % (url, exc))
                else:
                    print('%r cat count is %d bytes' % (cat_count, len(resp.content)))


def download_and_insert_image(url, label, timeout):
    img_binary = requests.get(url, timeout=timeout).content
    insert_image(label, img_binary)  
        
create_table()
print("TOTAL_CATs", get_hundred_random_cats())
@app.get("/cats")
async def leads():
    return get_cats_data()

app.mount("/", StaticFiles(directory="static",html = True), name="static")

