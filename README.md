# AMPUDB

**Antimicrobial Peptides with Unnatural amino acids DataBase**

Live site: https://PietroAronica.github.io/AMPUDB/

A manually curated database of antimicrobial peptides incorporating unnatural amino acids (UAAs), with bioactivity data, spectrum classification, and a full UAA glossary.

## Repository structure

```
index.html       Browse & search all entries
glossary.html    UAA code glossary
about.html       About the database
cite.html        Citation information
style.css        Shared stylesheet
data/
  entries.json   349 peptide entries
  glossary.json  116 UAA definitions
```

## Local preview

Because the site fetches JSON data files, you need to serve it via a local web server (not open the HTML directly as a file):

```bash
cd site/
python3 -m http.server 8000
# then open http://localhost:8000
```

## Updating the data

1. Edit `AMPUDB_master_v4.csv` and/or `AMPUDB_glossary_v2.csv`
2. Re-run the data export script:
   ```bash
   python3 export_data.py
   ```
3. Commit and push — the site updates automatically.
