import requests
import psycopg2
import json
import time
from config import DB

def get(url, expected=200):
    r = requests.get(url)
    return validate(r, expected)

def post(url, payload, expected=200):
    r = requests.post(url, json=payload)
    return validate(r, expected)

def validate(response, expected):
    if response.status_code != expected:
        return False, {"status": response.status_code, "body": response.text}
    try:
        return True, response.json()
    except Exception:
        return True, response.text

def db_conn():
    conn = psycopg2.connect(
        host=DB["host"],
        port=DB["port"],
        user=DB["user"],
        password=DB["password"],
        dbname=DB["database"],
        sslmode=DB["sslmode"],
    )
    conn.autocommit = True
    return conn

def wait_for(condition_fn, timeout=10, interval=0.5):
    start = time.time()
    while time.time() - start < timeout:
        if condition_fn():
            return True
        time.sleep(interval)
    return False
