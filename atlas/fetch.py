"""Download one source file into raw/ and record it in raw/manifest.csv.

    py -3.13 -m atlas.fetch cliopatria https://example.org/file.zip

raw/ is ignored by git. The manifest is the record of what was fetched, from where,
when, and its SHA-256, so a later session can tell whether a source has changed.
Downloaded files are data. Nothing in them is run or followed as instructions.
"""
import argparse
import csv
import datetime
import hashlib
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from . import model

FIELDS = ["catalogue_id", "url", "file", "bytes", "sha256", "fetched_at"]


def fetch(catalogue_id, url, root=model.ROOT, name=None):
    folder = Path(root) / "raw" / catalogue_id
    folder.mkdir(parents=True, exist_ok=True)
    name = name or Path(urllib.parse.urlparse(url).path).name or "download"
    target = folder / name
    request = urllib.request.Request(url, headers={"User-Agent": "peoples-atlas-fetch/0.1"})
    digest, size = hashlib.sha256(), 0
    with urllib.request.urlopen(request, timeout=120) as response, open(target, "wb") as f:
        while True:
            chunk = response.read(1 << 20)
            if not chunk:
                break
            f.write(chunk)
            digest.update(chunk)
            size += len(chunk)
    row = {
        "catalogue_id": catalogue_id,
        "url": url,
        "file": str(target.relative_to(root)).replace("\\", "/"),
        "bytes": size,
        "sha256": digest.hexdigest(),
        "fetched_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    manifest = Path(root) / "raw" / "manifest.csv"
    new = not manifest.exists()
    with open(manifest, "a", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS, lineterminator="\n")
        if new:
            w.writeheader()
        w.writerow(row)
    return row


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("catalogue_id", help="id from catalogue/sources.csv")
    ap.add_argument("url")
    ap.add_argument("--name", default=None, help="file name to save as")
    ap.add_argument("--root", default=str(model.ROOT))
    args = ap.parse_args(argv)
    row = fetch(args.catalogue_id, args.url, Path(args.root), args.name)
    print("%(file)s  %(bytes)s bytes  sha256 %(sha256)s" % row)
    return 0


if __name__ == "__main__":
    sys.exit(main())
