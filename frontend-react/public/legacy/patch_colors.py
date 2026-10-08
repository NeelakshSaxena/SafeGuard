import os

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements for light theme adaptation
    replacements = {
        'rgba(255,255,255,0.02)': 'rgba(0,0,0,0.02)',
        'rgba(255,255,255,0.03)': 'rgba(0,0,0,0.03)',
        'rgba(255,255,255,0.05)': 'rgba(0,0,0,0.05)',
        'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.1)',
        '#2a3a4c': '#f8faf9', # Map background in index.html
        'rgba(0,0,0,0.5)': 'rgba(255,255,255,0.8)', # GPS active background
        'border: 2px dashed var(--success)': 'border: 2px dashed var(--success); box-shadow: 0 0 0 4px #ffffff;',
        "color: white": "color: var(--text-main)", # search bar text
        'color: white; border-color: var(--danger);': 'color: white; border-color: var(--danger); background: var(--danger);' # chip active danger
    }

    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
patch_file('index.html')
patch_file('app.js')
print("Patched!")
