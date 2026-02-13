def test_print_db_url():
    from app.config import settings
    print("DB URL:", settings.DATABASE_URL)
    assert True
