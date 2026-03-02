def test_posting_templates(client):
    template = {
        "name": "deposit",
        "description": "Deposit template",
        "debit_account_type": "cash",
        "credit_account_type": "wallet",
        "default_amount": "100"
    }

    create = client.post("/posting-templates", json=template)
    assert create.status_code == 200

    get = client.get("/posting-templates/deposit")
    assert get.status_code == 200
    assert get.json()["name"] == "deposit"
