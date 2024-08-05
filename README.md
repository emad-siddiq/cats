# The Cat App
## How to run


Install [Docker](https://docs.docker.com/engine/install/) and Python on your local machine. 

From repository root run postgres with `docker compose up -d`. This will start a postgres container and expose it on `localhost:5432`.

Change directory to the backend folder to start the FastAPI Server on `localhost:8000`:
```
cd backend
```

Create a python virtual env:
```
python -m venv env
```


Activate virtual env:
```
 source env/bin/activate
```
```
pip install -r requirements.txt
``` 

From the `backend` directory run the FastAPI app with:
```
uvicorn main:app --host 0.0.0.0 --port 8000 --log-level debug
```

Alternatively, `fastapi dev main.py`. 

Access the cat app web at `localhost:8000`. You can select your favorites and filter by breeds.

You can turn off the `venv` when you are done with app using `deactivate`.
