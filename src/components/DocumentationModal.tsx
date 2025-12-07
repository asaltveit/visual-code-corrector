import React, { useState } from 'react';
import { X, Copy, Play, Image as ImageIcon, FileText, Layers, Presentation, Send } from 'lucide-react';
import { generateImageFromPrompt } from '../services/geminiService';
import { Spinner } from './Spinner';

interface DocumentationModalProps {
  onClose: () => void;
}

type DocTab = 'summary' | 'visuals' | 'architecture' | 'slides' | 'submission';

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<DocTab>('summary');
  const [demoImage, setDemoImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDemo = async (prompt: string) => {
    setIsGenerating(true);
    setDemoImage(null);
    try {
      const result = await generateImageFromPrompt(prompt);
      setDemoImage(result.imageUrl);
    } catch (e) {
      console.error(e);
      alert("Failed to generate demo image. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs: { id: DocTab; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Summary', icon: <FileText size={16} /> },
    { id: 'visuals', label: 'Visual Examples', icon: <ImageIcon size={16} /> },
    { id: 'architecture', label: 'Architecture', icon: <Layers size={16} /> },
    { id: 'slides', label: 'Slide Copy', icon: <Presentation size={16} /> },
    { id: 'submission', label: 'Submission', icon: <Send size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Project Documentation</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-2 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-white">
            
            {activeTab === 'summary' && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Tagline</h3>
                  <p className="text-xl text-indigo-600 font-medium">"Refactor with confidence, verify with vision."</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Project Overview</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    The <strong>Multi-Modal Code Refactorer</strong> is a cutting-edge client-side application designed to modernize legacy codebases while ensuring logic retention through visual verification. By leveraging <strong>Gemini 3</strong> for intelligent semantic refactoring and <strong>Nano Banana Pro</strong> for diagrammatic generation, developers can instantly transform messy "spaghetti code" into clean, testable, and documented solutions.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Unlike standard refactoring tools that operate in a text-only vacuum, this project introduces a "trust but verify" loop. It generates unit tests alongside the new code and produces logic flowcharts, allowing developers to visually confirm that the refactored logic matches the original intent without parsing thousands of lines of syntax manually.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Technical Explanation</h3>
                  <div className="space-y-4 text-slate-700">
                    <p>
                      The application operates entirely client-side using Next.js and the Gemini API SDK, ensuring zero latency from backend processing and maximum privacy for the user's workflow.
                    </p>
                    <p>
                      <strong>1. Semantic Refactoring (Gemini 3):</strong> The core engine ingests raw code strings and utilizes Gemini 3's advanced reasoning capabilities. We strictly type the output using a JSON Schema to ensure the model returns not just the code, but also a corresponding suite of unit tests and a natural language explanation of the optimization strategy.
                    </p>
                    <p>
                      <strong>2. Visual Synthesis (Nano Banana Pro):</strong> Simultaneously, the input code is sent to the Nano Banana Pro (Gemini 3 Image Preview) model. The prompt engineering here is critical; we instruct the model to interpret the <em>control flow</em> and <em>data structures</em> of the code, translating abstract syntax trees into human-readable 2K resolution diagrams or flowcharts.
                    </p>
                    <p>
                      <strong>3. State Management:</strong> The application uses React Context and LocalStorage to maintain a persistent history of refactoring sessions. This allows developers to toggle between "Original" and "Refactored" states while comparing them against the generated visual baseline.
                    </p>
                    <p>
                      <strong>4. Verification Loop:</strong> By presenting the Refactored Code, Unit Tests, and Visual Diagram in a unified tabbed interface, we reduce cognitive load. The user verifies the visual logic first (high level), checks the tests (functional level), and finally reviews the syntax (implementation level).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visuals' && (
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8">
                  <h3 className="text-lg font-bold text-indigo-900 mb-2">Live Demo Generator</h3>
                  <p className="text-indigo-700 text-sm mb-4">
                    Click the buttons below to generate the example images requested using Nano Banana Pro (Gemini 3 Pro Image).
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <button 
                      onClick={() => handleGenerateDemo("Flowchart of messy JavaScript code refactored automatically by an AI agent, futuristic style, 2K resolution")}
                      className="text-left p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Play size={16} className="text-indigo-600 group-hover:scale-110 transition-transform"/>
                        <span className="font-semibold text-slate-800">Futuristic Flowchart</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">"Flowchart of messy JavaScript code refactored automatically..."</p>
                    </button>

                    <button 
                      onClick={() => handleGenerateDemo("Before/after code snippet visualization, glowing code blocks, neon edges, high clarity, 2K")}
                      className="text-left p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Play size={16} className="text-indigo-600 group-hover:scale-110 transition-transform"/>
                        <span className="font-semibold text-slate-800">Neon Comparison</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">"Before/after code snippet visualization, glowing code blocks..."</p>
                    </button>

                    <button 
                      onClick={() => handleGenerateDemo("Unit test visual diagram showing code paths, AI-generated, professional, clean, high resolution")}
                      className="text-left p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Play size={16} className="text-indigo-600 group-hover:scale-110 transition-transform"/>
                        <span className="font-semibold text-slate-800">Unit Test Paths</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">"Unit test visual diagram showing code paths..."</p>
                    </button>
                  </div>
                </div>

                <div className="min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50">
                   {isGenerating ? (
                     <div className="flex flex-col items-center">
                        <Spinner className="h-8 w-8 text-indigo-600 mb-4" />
                        <p className="text-slate-500 animate-pulse">Generating high-res visual...</p>
                     </div>
                   ) : demoImage ? (
                     <img src={demoImage} alt="Generated Demo" className="max-h-[500px] object-contain rounded-lg shadow-lg" />
                   ) : (
                     <div className="text-center text-slate-400">
                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Select a prompt above to generate a preview</p>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Architecture Diagram</h3>
                <div className="p-6 bg-slate-900 rounded-xl text-slate-300 font-mono text-sm overflow-x-auto shadow-inner">
                  <pre>{`flowchart TD
    A[User Input Code] --> B[Gemini 3 Refactor API]
    B --> C[Refactored Code]
    B --> D[Generated Unit Tests]
    B --> E[Nano Banana Visual Diagram]
    C --> F[UI Display]
    D --> F
    E --> F`}</pre>
                </div>
                
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex justify-center">
                    {/* CSS Implementation of the Mermaid Chart for visual display */}
                    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
                        <div className="px-4 py-2 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono text-sm">User Input Code</div>
                        <div className="h-6 w-0.5 bg-slate-300"></div>
                        <div className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg">Gemini 3 Refactor API</div>
                        <div className="h-6 w-full flex justify-between relative">
                            <div className="absolute top-0 left-[20%] w-[60%] h-4 border-t-2 border-l-2 border-r-2 border-slate-300 rounded-t-xl"></div>
                            <div className="absolute top-0 left-1/2 h-4 border-l-2 border-slate-300"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 w-full text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="px-4 py-2 bg-green-50 border border-green-200 rounded text-green-800 text-xs font-semibold">Refactored Code</div>
                                <div className="h-8 w-0.5 bg-slate-300"></div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs font-semibold">Unit Tests</div>
                                <div className="h-8 w-0.5 bg-slate-300"></div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded text-purple-800 text-xs font-semibold">Visual Diagram</div>
                                <div className="h-8 w-0.5 bg-slate-300"></div>
                            </div>
                        </div>
                        <div className="w-full border-t-2 border-slate-300 mt-[-1rem] relative z-0"></div>
                        <div className="h-4 w-0.5 bg-slate-300"></div>
                        <div className="px-6 py-3 bg-slate-800 text-white rounded-lg shadow-md font-mono">UI Display</div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'slides' && (
              <div className="space-y-8">
                 <h3 className="text-2xl font-bold text-slate-900">Presentation Copy</h3>
                 
                 <div className="grid gap-6">
                    {/* Slide 1 */}
                    <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Slide 1: Problem</div>
                        <h4 className="text-xl font-bold mb-3">The "Black Box" of Refactoring</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Legacy code is brittle; developers fear touching it.</li>
                            <li>Automated refactoring tools exist, but blind trust leads to bugs.</li>
                            <li>Reading diffs (text comparison) is mentally exhausting and error-prone.</li>
                            <li><strong>Gap:</strong> No immediate visual verification of logic preservation.</li>
                        </ul>
                    </div>

                    {/* Slide 2 */}
                    <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Slide 2: Solution</div>
                        <h4 className="text-xl font-bold mb-3">Multi-Modal Refactorer</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li><strong>Code + Vision:</strong> We don't just change the code; we visualize the change.</li>
                            <li><strong>Gemini 3 Powered:</strong> Handles complex semantic refactoring and unit test generation.</li>
                            <li><strong>Nano Banana Pro:</strong> Generates "Visual Diffs" (Flowcharts/Diagrams) from the AST.</li>
                            <li><strong>Result:</strong> Developers verify logic at a glance, then review syntax.</li>
                        </ul>
                    </div>

                    {/* Slide 3 */}
                    <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Slide 3: How it Works</div>
                        <h4 className="text-xl font-bold mb-3">The "Trust & Verify" Pipeline</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li><strong>Input:</strong> User pastes messy/legacy code.</li>
                            <li><strong>Parallel Processing:</strong> 
                                <ul className="pl-5 mt-1 list-circle text-sm">
                                    <li>Gemini 3 optimizes syntax & writes tests.</li>
                                    <li>Nano Banana Pro maps the control flow to an image.</li>
                                </ul>
                            </li>
                            <li><strong>Output:</strong> A unified dashboard showing Code, Tests, and Diagram.</li>
                        </ul>
                    </div>

                     {/* Slide 4 */}
                     <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Slide 4: Technical Highlights</div>
                        <h4 className="text-xl font-bold mb-3">Built for the Future</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li><strong>Client-Side Only:</strong> Zero backend latency, maximum privacy.</li>
                            <li><strong>Structured JSON Output:</strong> Strictly typed AI responses for UI stability.</li>
                            <li><strong>Multi-Modal Integration:</strong> Seamlessly blending Text-to-Text and Text-to-Image models.</li>
                        </ul>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'submission' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="text-2xl font-bold text-slate-900">Hackathon Submission Text</h3>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-serif">
                   <p className="mb-4">
                       <strong>What we built:</strong> The Multi-Modal Code Refactorer is a developer productivity tool that solves the "fear of legacy code." We combined the reasoning power of Gemini 3 with the visual synthesis of Nano Banana Pro to create a refactoring workflow that is transparent and verifiable. Instead of just getting a block of new code, developers receive a "Proof of Logic" package: the optimized code, a fresh suite of unit tests, and a high-resolution logic flowchart generated directly from the source.
                   </p>
                   <p className="mb-4">
                       <strong>How it works:</strong> The application runs entirely client-side using Next.js. When code is submitted, we trigger a parallel pipeline. First, Gemini 3 analyzes the code to improve performance and readability while strictly adhering to a JSON schema to generate executable unit tests. Simultaneously, we prompt the Nano Banana Pro vision model to "draw" the code's control flow. This multi-modal approach (Text + Vision) allows developers to spot architectural changes instantly in the diagram before diving into the syntax.
                   </p>
                   <p>
                       <strong>Why it matters:</strong> As AI writes more code, humans need faster ways to verify it. Reading diffs is slow. Looking at a diagram is fast. By innovating on the "Visual Verification" layer, we are building trust in AI-generated refactors and making it safer to modernize critical infrastructure.
                   </p>
                </div>
                <button 
                  className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
                  onClick={() => navigator.clipboard.writeText(`The Multi-Modal Code Refactorer is a developer productivity tool that solves the "fear of legacy code." We combined the reasoning power of Gemini 3 with the visual synthesis of Nano Banana Pro to create a refactoring workflow that is transparent and verifiable. Instead of just getting a block of new code, developers receive a "Proof of Logic" package: the optimized code, a fresh suite of unit tests, and a high-resolution logic flowchart generated directly from the source.\n\nThe application runs entirely client-side using Next.js. When code is submitted, we trigger a parallel pipeline. First, Gemini 3 analyzes the code to improve performance and readability while strictly adhering to a JSON schema to generate executable unit tests. Simultaneously, we prompt the Nano Banana Pro vision model to "draw" the code's control flow. This multi-modal approach (Text + Vision) allows developers to spot architectural changes instantly in the diagram before diving into the syntax.\n\nAs AI writes more code, humans need faster ways to verify it. Reading diffs is slow. Looking at a diagram is fast. By innovating on the "Visual Verification" layer, we are building trust in AI-generated refactors and making it safer to modernize critical infrastructure.`)}
                >
                    <Copy size={16} /> Copy to Clipboard
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};