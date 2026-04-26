#!/usr/bin/env python3
import os
import shutil
import zipfile

# Create directories
os.makedirs('build', exist_ok=True)
os.makedirs('dist', exist_ok=True)

# Copy source files
if os.path.exists('build'):
    shutil.rmtree('build')
shutil.copytree('src', 'build')

# Create XPI file (ZIP archive)
xpi_path = 'dist/zotero-jisedigi-api-1.0.0.xpi'
with zipfile.ZipFile(xpi_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('build'):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, 'build')
            zipf.write(file_path, arcname)

print(f"XPI file created: {xpi_path}")
print(f"File size: {os.path.getsize(xpi_path)} bytes")
