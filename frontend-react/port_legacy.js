const fs = require('fs');

const html = fs.readFileSync('g:/Projects/DBTHON/frontend/index.html', 'utf8');

// Extract body
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (bodyMatch) {
    let body = bodyMatch[1];
    
    // Extract styles to put in CSS
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        fs.writeFileSync('g:/Projects/DBTHON/frontend-react/src/legacy.css', styleMatch[1]);
    }

    // Convert HTML to JSX
    body = body.replace(/class=/g, 'className=');
    body = body.replace(/for=/g, 'htmlFor=');
    body = body.replace(/<!--/g, '{/*');
    body = body.replace(/-->/g, '*/}');
    
    // Strip event handlers like onclick
    body = body.replace(/on[a-z]+=\"[^\"]*\"/g, '');
    
    // Fix self closing tags like img, input, hr, br
    body = body.replace(/(<img[^>]*?)(?<!\/)>/g, '$1 />');
    body = body.replace(/(<input[^>]*?)(?<!\/)>/g, '$1 />');
    body = body.replace(/(<hr[^>]*?)(?<!\/)>/g, '$1 />');
    body = body.replace(/(<br[^>]*?)(?<!\/)>/g, '$1 />');
    body = body.replace(/(<source[^>]*?)(?<!\/)>/g, '$1 />');
    
    // Strip inline styles
    body = body.replace(/style=\"[^\"]*\"/g, '');
    
    const out = `import React, { useEffect } from "react";
import "./legacy.css";

export default function LegacyUI() {
  useEffect(() => {
    // Attempt to run the legacy app.js script logic
    const script = document.createElement("script");
    script.src = "/app.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <>
${body}
    </>
  );
}
`;

    fs.writeFileSync('g:/Projects/DBTHON/frontend-react/src/LegacyUI.jsx', out);
}

// Copy app.js
fs.copyFileSync('g:/Projects/DBTHON/frontend/app.js', 'g:/Projects/DBTHON/frontend-react/public/app.js');
