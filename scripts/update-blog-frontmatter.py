"""Update all blog MDX files with category and access frontmatter fields."""
import os
import re

BLOG_DIR = r"C:\Users\PLATINUM\projects\cms-bapikir\content\blog"

# Manual mapping based on tags + title analysis
MAPPING = {
    '8-perbedaan-prompt-analisis-diri': ('kehidupan', 'free'),
    'aji-saka-yang-hilang': ('produktivitas-pikir', 'free'),
    'aku-bukan-ekstrovert-kamu-bukan-introvert': ('produktivitas-pikir', 'free'),
    'bangun-cepat-siap-scale': ('produktivitas-pikir', 'free'),
    'bapikir-prompting': ('produktivitas-pikir', 'free'),
    'bot-telegram-analisa-link-marketplace': ('produktivitas-pikir', 'free'),
    'cara-nulis-artikel-tanpa-stres': ('produktivitas-pikir', 'free'),
    'cara-pilih-ssd-agar-tidak-ketipu': ('teknis', 'free'),
    'cerita-ssd-palsu-dan-perjalanan-upgrade': ('kehidupan', 'free'),
    'covert-sales-jualan-tanpa-jualan': ('bisnis-syariah', 'free'),
    'daira': ('produktivitas-pikir', 'free'),
    'dari-berantakan-ke-sistematis': ('produktivitas-pikir', 'free'),
    'dari-cari-ssd-malah-bikin-bot': ('kehidupan', 'free'),
    'dari-coretan-ke-web-app': ('kehidupan', 'free'),
    'fee-persentase-vs-fixed': ('bisnis-syariah', 'free'),
    'ijarah-samsarah-wakalah': ('bisnis-syariah', 'free'),
    'kenapa-produk-digital-kamu-gak-nyambung': ('produktivitas-pikir', 'member'),
    'kenapa-user-lebih-percaya-bot': ('kehidupan', 'free'),
    'keyboard-laptop-rusak-cek-dulu': ('teknis', 'free'),
    'laptop-16gb-sering-freeze': ('teknis', 'free'),
    'maker-vs-ai': ('produktivitas-pikir', 'free'),
    'mengubah-aqad-bank-konvensional': ('bisnis-syariah', 'free'),
    'metode-pembayaran-syariah': ('bisnis-syariah', 'free'),
    'mouse-copy-paste': ('teknis', 'free'),
    'nico-robin-malin-kundang': ('produktivitas-pikir', 'free'),
    'ohara-cerita-dan-kata': ('kehidupan', 'free'),
    'pagi-istri-kirim-prompt-saya-permak': ('kehidupan', 'free'),
    'pajak-dan-zakat': ('bisnis-syariah', 'free'),
    'pakai-barang-kembalikan': ('kehidupan', 'free'),
    'reset-gpu-overlay': ('teknis', 'free'),
    'selamat-datang': ('kehidupan', 'free'),
    'sertifikasi-konsultan-bisnis-syariah': ('kehidupan', 'free'),
    'structured-vs-empathetic-prompting': ('produktivitas-pikir', 'free'),
    'taraf-berpikir': ('produktivitas-pikir', 'free'),
    'waqi-sambil-nulis-waqi': ('produktivitas-pikir', 'free'),
    'waqi': ('produktivitas-pikir', 'free'),
    'white-page-mystery': ('kehidupan', 'free'),
    'wifi-intel-ac8260-error': ('teknis', 'free'),
    'windows-search-832mb': ('teknis', 'free'),
}

count = 0
for fname in sorted(os.listdir(BLOG_DIR)):
    if not (fname.endswith('.mdx') or fname.endswith('.md')):
        continue
    slug = fname.replace('.mdx', '').replace('.md', '')
    if slug not in MAPPING:
        print(f"  SKIP {slug}: no mapping")
        continue

    cat, access = MAPPING[slug]
    fpath = os.path.join(BLOG_DIR, fname)

    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    has_cat = any(l.strip().startswith('category:') for l in lines[:15])
    has_access = any(l.strip().startswith('access:') for l in lines[:15])

    if has_cat and has_access:
        print(f"  OK   {slug}")
        continue

    # Find closing --- of frontmatter
    closing = -1
    for i in range(1, min(25, len(lines))):
        if lines[i].strip() == '---':
            closing = i
            break

    if closing == -1:
        print(f"  ERR  {slug}: no closing ---")
        continue

    additions = []
    if not has_cat:
        additions.append(f"category: {cat}")
    if not has_access:
        additions.append(f"access: {access}")

    new_lines = lines[:closing] + additions + lines[closing:]
    new_content = '\n'.join(new_lines)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  DONE {slug}: +{', '.join(additions)}")
    count += 1

print(f"\n✅ Updated {count} files")
