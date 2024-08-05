# The Cat App
## How to run


1. Install [Docker](https://docs.docker.com/engine/install/) and [Python](https://www.python.org/downloads/) on your local machine. 

2. Clone this repo and from the root run  `docker compose up -d`. 
This will start a postgres container and expose it on `localhost:5432`.

3. `cd` to the `backend` folder.


4. Create a python virtual env:
```
python -m venv env
```


5. Activate virtual env:
```
 source env/bin/activate
```

6. Install required files
```
pip install -r requirements.txt
``` 

7. Run the [FastAPI](https://fastapi.tiangolo.com/) app with:
```
uvicorn main:app --host 0.0.0.0 --port 8000 --log-level debug
```

Alternatively, `fastapi dev main.py`. 

Access the cat app web at `localhost:8000`. You can select your favorites and filter by breeds.
Allow a few seconds for the application to download images.

![preview app](https://github.com/emad-siddiq/cats/blob/main/backend/static/img/preview.png)


You can turn off the `venv` when you are done with app using `deactivate`.
