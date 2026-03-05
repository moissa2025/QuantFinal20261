# Core service users
gcloud sql users create authuser \
  --instance=globalquantx \
  --password=Gos608eg

gcloud sql users create ledgeruser \
  --instance=globalquantx \
  --password=ledgerGos608eg

gcloud sql users create riskuser \
  --instance=globalquantx \
  --password=riskGos608eg

gcloud sql users create treasuryuser \
  --instance=globalquantx \
  --password=treasuryGos608eg

gcloud sql users create stakinguser \
  --instance=globalquantx \
  --password=stakingGos608eg

gcloud sql users create carduser \
  --instance=globalquantx \
  --password=cardGos608eg

gcloud sql users create marketdatauser \
  --instance=globalquantx \
  --password=marketdataGos608eg

# Operational users
gcloud sql users create migrationuser \
  --instance=globalquantx \
  --password=migrationGos608eg

gcloud sql users create readonlyuser \
  --instance=globalquantx \
  --password=readonlyGos608eg

gcloud sql users create adminuser \
  --instance=globalquantx \
  --password=adminGos608eg

