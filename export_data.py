r"""
export_data.py  v2
Run from the AMPUDB folder (one level above 'site') to regenerate
site/data/entries.json and site/data/glossary.json from the master CSVs.

Usage:
    cd C:\Users\pietroa\Documents\AMPUDB
    python3 site/export_data.py
"""
import csv, json, pathlib

BASE  = pathlib.Path(__file__).parent.parent   # AMPUDB folder
SITE  = pathlib.Path(__file__).parent          # site folder
DATA  = SITE / 'data'
DATA.mkdir(exist_ok=True)

# These two names are the authoritative declaration of which data files are active.
# Superseded versions live in old_versions/ -- never point at them.
MASTER   = BASE / 'master_data' / 'AMPUDB_master_v361.csv'   # v361: + Parentage class (v291) column, copied from the AMPUDB working folder 2026-10-12
GLOSSARY = BASE / 'master_data' / 'AMPUDB_glossary_v39.csv'   # v39, copied from the AMPUDB working folder 2026-10-12

for _p in (MASTER, GLOSSARY):
    if not _p.exists():
        raise SystemExit(f"Active data file missing: {_p}\n"
                         f"Check master_data/ and update MASTER/GLOSSARY at the top of this script.")
print(f"Using master:   {MASTER.name}")
print(f"Using glossary: {GLOSSARY.name}")

def load_csv(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        for k in row:
            row[k] = (row[k] or '').strip()
    return rows

# -- Entries ------------------------------------------------------------------
entries = load_csv(MASTER)

# -- Glossary -----------------------------------------------------------------
glossary_raw = load_csv(GLOSSARY)
glossary = []
for row in glossary_raw:
    cats = [c.strip() for c in row.get('Categories', '').split('|') if c.strip()]
    glossary.append({
        'Code':             row['Code'],
        'Name':             row['Name'],
        'Aliases':          row.get('Aliases', ''),
        'Categories':       cats,
        'SMILES':           row.get('SMILES', ''),
        'PubChem_CID':      row.get('PubChem_CID', ''),
        'Source':           row.get('Source', ''),
        # Boolean flags derived from categories (backwards-compatible with filter logic)
        'UAA':              '1',
        'DAA':              '1' if 'D-configuration' in cats else '0',
        'Peptoid':          '1' if ('peptoid' in cats or 'beta-peptoid' in cats) else '0',
        'Charge':           '1' if 'positively-charged' in cats else ('-1' if 'negatively-charged' in cats else '0'),
        'Alpha amino acid': '1' if 'alpha-AA' in cats else '0',
    })

with open(DATA / 'entries.json',  'w', encoding='utf-8') as f:
    json.dump(entries,  f, ensure_ascii=False, separators=(',', ':'))
with open(DATA / 'glossary.json', 'w', encoding='utf-8') as f:
    json.dump(glossary, f, ensure_ascii=False, separators=(',', ':'))

print(f"entries.json:  {len(entries)} entries")
print(f"glossary.json: {len(glossary)} entries")
print("Done.")
