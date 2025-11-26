import json
import os

JOURNAL_FILE = "journal.json"

def save_to_journal(dream_text, interpretation):
    entry = {
        "dream": dream_text,
        "interpretation": interpretation
    }
    if not os.path.exists(JOURNAL_FILE):
        with open(JOURNAL_FILE, "w") as f:
            json.dump([], f)

    with open(JOURNAL_FILE, "r+") as f:
        data = json.load(f)
        data.append(entry)
        f.seek(0)
        json.dump(data, f, indent=2)
