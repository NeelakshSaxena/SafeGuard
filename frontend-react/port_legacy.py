import re
import os

with open('g:/Projects/DBTHON/frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract body
body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
if body_match:
    body = body_match.group(1)
    
    # Extract styles to put in CSS
    style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
    if style_match:
        with open('g:/Projects/DBTHON/frontend-react/src/legacy.css', 'w', encoding='utf-8') as css_file:
            css_file.write(style_match.group(1))

    # Convert HTML to JSX
    body = body.replace('class=', 'className=')
    body = body.replace('for=', 'htmlFor=')
    body = body.replace('<!--', '{/*')
    body = body.replace('-->', '*/}')
    
    # Strip event handlers like onclick
    body = re.sub(r'on[a-z]+=\"[^\"]*\"', '', body)
    
    # Fix self closing tags like img, input, hr, br
    body = re.sub(r'(<img[^>]*?)(?<!/)>', r'\1 />', body)
    body = re.sub(r'(<input[^>]*?)(?<!/)>', r'\1 />', body)
    body = re.sub(r'(<hr[^>]*?)(?<!/)>', r'\1 />', body)
    body = re.sub(r'(<br[^>]*?)(?<!/)>', r'\1 />', body)
    
    # Strip inline styles because React expects objects for style, not strings
    # We will rely on legacy.css and the classNames
    body = re.sub(r'style=\"[^\"]*\"', '', body)
    
    with open('g:/Projects/DBTHON/frontend-react/src/LegacyUI.jsx', 'w', encoding='utf-8') as out:
        out.write('import React, { useEffect } from "react";\n')
        out.write('import "./legacy.css";\n\n')
        out.write('export default function LegacyUI() {\n')
        out.write('  useEffect(() => {\n')
        out.write('    const script = document.createElement("script");\n')
        out.write('    script.src = "/app.js";\n')
        out.write('    script.async = true;\n')
        out.write('    document.body.appendChild(script);\n')
        out.write('    return () => document.body.removeChild(script);\n')
        out.write('  }, []);\n\n')
        out.write('  return (\n    <>\n')
        out.write(body)
        out.write('\n    </>\n  );\n}\n')

# Copy app.js to public folder so it can be served
import shutil
shutil.copy('g:/Projects/DBTHON/frontend/app.js', 'g:/Projects/DBTHON/frontend-react/public/app.js')
