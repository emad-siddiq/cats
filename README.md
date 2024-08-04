## How to run

Install Docker.

Run postgres with `docker compose up -d`. This will start a postgres container and expose it on `localhost:5432`.

Remove postgres with `docker compose down --volumes`.


Activate virtual env `source env/bin/activate`, `pip install -r requirements.txt` and run with 
`uvicorn main:app --host 0.0.0.0 --port 8000 --log-level debug`

See all leads at `localhost:8000/leads`
`tsc -w` in `frontend/ts` to edit typescript files