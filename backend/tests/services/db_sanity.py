from utils import db_conn

def test_db_basic():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute("SELECT 1")
    row = cur.fetchone()
    ok = row and row[0] == 1
    return ("db.basic", ok, row)

