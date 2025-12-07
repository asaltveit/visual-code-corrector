import React, { useMemo } from 'react';

interface SandboxedPreviewProps {
  code: string;
  title: string;
}

export const SandboxedPreview: React.FC<SandboxedPreviewProps> = ({ code, title }) => {
  // Generate HTML content based on code
  const htmlContent = useMemo(() => {
    // Handle empty code
    if (!code || code.trim().length === 0) {
      return `
        <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #64748b; text-align: center; padding: 20px;">
            <div>
                <div style="font-size: 24px; margin-bottom: 10px;">📝</div>
                <b>No Code Available</b><br/>
                <span style="color: #475569; margin-top: 8px; display: block;">Waiting for code to be provided.</span>
            </div>
        </body>
        </html>
      `;
    }

    // Detect if code is likely backend/non-renderable (fallback check)
    // This should rarely trigger if main detection works correctly, but serves as a safety check
    const codeLower = code.toLowerCase();
    const hasFrontendIndicators = (
      code.includes('React') ||
      code.includes('react') ||
      code.includes('useState') ||
      code.includes('useEffect') ||
      code.includes('JSX') ||
      code.includes('jsx') ||
      code.includes('return <') ||
      code.includes('return (') && code.includes('<') ||
      code.trim().startsWith('<') ||
      code.includes('className') ||
      code.includes('ReactDOM')
    );
    
    // Enhanced Python detection
    const isPython = (
      (code.includes('def ') && code.includes(':')) ||
      (code.includes('import ') && (code.includes('numpy') || code.includes('pandas') || code.includes('math'))) ||
      code.includes('if __name__') ||
      (code.includes('print(') && !hasFrontendIndicators) ||
      (code.includes('class ') && code.includes('__init__')) ||
      (code.includes('lambda ') && code.includes(':'))
    );
    
    const isBackend = (
      isPython ||
      (code.includes('def ') && !hasFrontendIndicators) ||
      (code.includes('#include') && !hasFrontendIndicators) ||
      (code.includes('public static void') && !hasFrontendIndicators)
    );

    if (isBackend || isPython) {
        return `
          <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #64748b; text-align: center; padding: 20px;">
              <div>
                  <div style="font-size: 24px; margin-bottom: 10px;">🔍</div>
                  <b>${isPython ? 'Python Code Detected' : 'Backend/Logic Code Detected'}</b><br/>
                  Runtime preview is not available for ${isPython ? 'Python' : 'backend'} code.<br/>
                  <span style="color: #475569; margin-top: 8px; display: block;">View the <strong>Visual Diagram</strong> tab to see logic flow visualization using Nano banana style.</span>
              </div>
          </body>
          </html>
        `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- External Dependencies for Runtime -->
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background-color: #ffffff; overflow: auto; }
            #root { padding: 1rem; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useState, useEffect, useRef, useMemo, useCallback } = React;
          
          // Error Boundary to catch runtime crashes
          class ErrorBoundary extends React.Component {
            constructor(props) {
              super(props);
              this.state = { hasError: false, error: null };
            }
            static getDerivedStateFromError(error) {
              return { hasError: true, error };
            }
            render() {
              if (this.state.hasError) {
                return (
                    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm font-mono">
                        <strong>Runtime Error:</strong><br/>
                        {this.state.error.toString()}
                    </div>
                );
              }
              return this.props.children;
            }
          }

          try {
             // Inject User Code - wrap in IIFE to capture any component definitions
             (function() {
                ${code}
             })();

             // Heuristic to find the component to mount
             let ComponentToRender = null;
             const componentNames = ['App', 'Component', 'Example', 'Demo', 'Main', 'Root'];
             
             // Try to find components in the current scope
             for (const name of componentNames) {
               try {
                 if (typeof eval(name) !== 'undefined') {
                   ComponentToRender = eval(name);
                   break;
                 }
               } catch (e) {
                 // Continue searching
               }
             }
             
             // Also check window/global scope
             if (!ComponentToRender) {
               for (const name of componentNames) {
                 if (typeof window[name] !== 'undefined') {
                   ComponentToRender = window[name];
                   break;
                 }
               }
             }

             // Check if code is raw HTML - use the code string for checking
             const codeStr = ${JSON.stringify(code.trim())};
             const isRawHTML = codeStr && codeStr.substring(0, 1) === '<';

             const root = ReactDOM.createRoot(document.getElementById('root'));
             
             if (isRawHTML) {
                 root.render(
                    <ErrorBoundary>
                        <div dangerouslySetInnerHTML={{__html: codeStr}} />
                    </ErrorBoundary>
                 );
             } else if (ComponentToRender) {
                 root.render(
                    <ErrorBoundary>
                        <ComponentToRender />
                    </ErrorBoundary>
                 );
             } else {
                 // Enhanced fallback: try to parse and find any React component pattern
                 const functionMatch = codeStr.match(/(?:function|const|let|var)\\s+([A-Z][a-zA-Z0-9]*)\\s*[=(]/);
                 
                 if (functionMatch) {
                   const foundName = functionMatch[1];
                   try {
                     ComponentToRender = eval(foundName);
                     if (ComponentToRender) {
                       root.render(
                         <ErrorBoundary>
                           <ComponentToRender />
                         </ErrorBoundary>
                       );
                       return;
                     }
                   } catch (e) {
                     // Fall through to error message
                   }
                 }
                 
                 root.render(
                    <div className="p-4 text-slate-400 text-sm text-center">
                        <p className="font-semibold mb-2">Could not auto-detect a React Component</p>
                        <p className="text-xs mb-4">The code should define a component named <code className="bg-slate-100 px-1 rounded">App</code>, <code className="bg-slate-100 px-1 rounded">Component</code>, or <code className="bg-slate-100 px-1 rounded">Example</code></p>
                        {codeStr && (
                          <details className="text-left text-xs bg-slate-50 p-2 rounded mt-2">
                            <summary className="cursor-pointer font-medium">View code</summary>
                            <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">{codeStr.substring(0, 500)}{codeStr.length > 500 ? '...' : ''}</pre>
                          </details>
                        )}
                    </div>
                 );
             }

          } catch (err) {
             const root = ReactDOM.createRoot(document.getElementById('root'));
             root.render(
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm font-mono">
                    <strong>Runtime Error:</strong><br/>
                    <pre className="mt-2 text-xs whitespace-pre-wrap">{err.toString()}</pre>
                    {err.stack && <pre className="mt-2 text-xs opacity-75 whitespace-pre-wrap">{err.stack}</pre>}
                </div>
             );
          }
        </script>
      </body>
      </html>
    `;
  }, [code]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
         <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
         </div>
      </div>
      <div className="flex-grow relative bg-white">
        <iframe
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin" // allow-same-origin needed for React to work properly in some cases, but risky. For hackathon, okay.
            srcDoc={htmlContent}
        />
      </div>
    </div>
  );
};