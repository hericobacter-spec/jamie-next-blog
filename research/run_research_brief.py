#!/usr/bin/env python3
"""Research brief: arXiv + Exa (via mcporter).

Usage:
  python3 run_research_brief.py "query" --arxiv 5 --web 5 --type fast

Requires:
  - mcporter configured with server name `exa`
"""

import argparse
import json
import subprocess
import sys
import textwrap
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ARXIV_API = "https://export.arxiv.org/api/query"


def fetch_arxiv(query: str, n: int):
    params = {
        "search_query": f"all:{query}",
        "start": "0",
        "max_results": str(n),
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    }
    url = ARXIV_API + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        data = r.read()

    # Atom feed with default namespace
    ns = {"a": "http://www.w3.org/2005/Atom"}
    root = ET.fromstring(data)
    out = []
    for entry in root.findall("a:entry", ns):
        title = (entry.findtext("a:title", default="", namespaces=ns) or "").strip()
        summary = (entry.findtext("a:summary", default="", namespaces=ns) or "").strip()
        published = (entry.findtext("a:published", default="", namespaces=ns) or "").strip()
        authors = [a.findtext("a:name", default="", namespaces=ns).strip() for a in entry.findall("a:author", ns)]

        arxiv_url = ""
        pdf_url = ""
        for link in entry.findall("a:link", ns):
            href = link.attrib.get("href", "")
            rel = link.attrib.get("rel", "")
            title_attr = link.attrib.get("title", "")
            if rel == "alternate" and href:
                arxiv_url = href
            if title_attr == "pdf" and href:
                pdf_url = href

        out.append(
            {
                "title": " ".join(title.split()),
                "published": published,
                "authors": [a for a in authors if a],
                "summary": " ".join(summary.split()),
                "url": arxiv_url,
                "pdf": pdf_url,
            }
        )
    return out


def run_exa_web_search(query: str, n: int, type_: str):
    # mcporter prints a human-ish format by default; we keep it as text.
    cmd = [
        "mcporter",
        "call",
        f"exa.web_search_exa(query: {json.dumps(query)}, numResults: {n}, type: {json.dumps(type_)})",
    ]
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "mcporter call failed")
    return p.stdout.strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("query")
    ap.add_argument("--arxiv", type=int, default=5)
    ap.add_argument("--web", type=int, default=5)
    ap.add_argument("--type", choices=["auto", "fast", "deep"], default="fast")
    args = ap.parse_args()

    query = args.query.strip()

    arxiv = fetch_arxiv(query, args.arxiv) if args.arxiv else []
    exa_text = run_exa_web_search(query, args.web, args.type) if args.web else ""

    print(f"# Research Brief: {query}\n")

    if arxiv:
        print("## arXiv (최신)\n")
        for i, p in enumerate(arxiv, 1):
            authors = ", ".join(p["authors"][:6]) + (" et al." if len(p["authors"]) > 6 else "")
            print(f"{i}. {p['title']}")
            if p["published"]:
                print(f"   - Date: {p['published'][:10]}")
            if authors:
                print(f"   - Authors: {authors}")
            if p["url"]:
                print(f"   - Link: {p['url']}")
            if p["pdf"]:
                print(f"   - PDF: {p['pdf']}")
            if p["summary"]:
                print("   - Abstract: " + textwrap.shorten(p["summary"], width=280, placeholder="…"))
            print()

    if exa_text:
        print("## Web (Exa)\n")
        # Keep output compact; Exa returns multiple blocks.
        print(exa_text)
        print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
