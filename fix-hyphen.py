#!/usr/bin/env python3
"""Fix narrative ' - ' (AI-ish) -> ',' in blog MDX prose.

Hanya menyentuh PROSA. Melewati (skip) konteks di mana ' - ' itu sah:
  - frontmatter (--- ... ---)
  - code fence (``` ... ```)  <- WAJIB: dulu bug ini merusak template prompt
  - baris heading (#, ##, ...)  <- ' - ' = pemisah judul/subjudul
  - baris tabel Markdown (mengandung |)
  - bullet list item (baris diawali '-')
"""

import os

blog_dir = "C:\\Users\\PLATINUM\\projects\\cms-bapikir\\content\\blog"
total_fixed = 0

for fname in sorted(os.listdir(blog_dir)):
    if not fname.endswith(".mdx"):
        continue
    path = os.path.join(blog_dir, fname)
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    in_frontmatter = False
    in_fence = False
    new_lines = []
    fixed = 0

    for line in lines:
        stripped = line.rstrip("\n")
        lstripped = stripped.lstrip()

        # Track code fence (```), lalu skip semua isinya
        if lstripped.startswith("```"):
            in_fence = not in_fence
            new_lines.append(line)
            continue
        if in_fence:
            new_lines.append(line)
            continue

        # Track frontmatter
        if stripped == "---":
            in_frontmatter = not in_frontmatter
            new_lines.append(line)
            continue

        # Skip konteks non-prosa: frontmatter, heading, tabel, bullet
        if (
            in_frontmatter
            or lstripped.startswith("#")
            or lstripped.startswith("-")
            or "|" in stripped
        ):
            new_lines.append(line)
            continue

        # Replace narrative ' - ' with ', ' (prosa saja)
        new_line = stripped.replace(" - ", ", ")
        if new_line != stripped:
            fixed += 1
        new_lines.append(new_line + "\n")

    with open(path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

    if fixed > 0:
        print(f"{fname}: {fixed} fix")
        total_fixed += fixed

print(f"\nTotal: {total_fixed} fix di semua file")
