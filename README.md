## How to run

Install Docker.

Run postgres with `docker compose up -d`. This will start a postgres container and expose it on `localhost:5432`.

Remove postgres with `docker compose down --volumes`.


Activate virtual env `source env/bin/activate`, `pip install -r requirements.txt` and run with `fastapi dev main.py`

See all leads at `localhost:8000/leads`
