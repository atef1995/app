// "use client";

// import React, { useState, useEffect } from "react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { Copy, Check, FileText } from "lucide-react";

// interface CodeBlockProps {
//   children: string;
//   className?: string;
// }

// const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
//   // Extract language from className (e.g., "language-javascript" -> "javascript")
//   const language = className?.replace(/language-/, "") || "javascript";

//   // Clean up the code string
//   const code = String(children).replace(/\n$/, "");

//   // State for copy functionality
//   const [copied, setCopied] = useState(false);

//   // Handle copy functionality
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(code);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (error) {
//       console.error("Failed to copy code:", error);
//     }
//   };

//   // Custom style based on VS Code Dark theme
//   const customStyle = {
//     ...vscDarkPlus,
//     'pre[class*="language-"]': {
//       ...vscDarkPlus['pre[class*="language-"]'],
//       background: "#1e1e1e", // VS Code dark background
//       border: "1px solid #333",
//       borderRadius: "8px",
//     },
//     'code[class*="language-"]': {
//       ...vscDarkPlus['code[class*="language-"]'],
//       background: "#1e1e1e",
//       color: "#d4d4d4", // VS Code light text
//     },
//     // Enhanced token colors for better visibility
//     ".token.keyword": {
//       color: "#569cd6", // VS Code blue for keywords (function, const, let, etc.)
//       fontWeight: "normal",
//     },
//     ".token.string": {
//       color: "#ce9178", // VS Code orange for strings
//     },
//     ".token.number": {
//       color: "#b5cea8", // VS Code light green for numbers
//     },
//     ".token.boolean": {
//       color: "#569cd6", // VS Code blue for booleans
//     },
//     ".token.function": {
//       color: "#dcdcaa", // VS Code yellow for function names
//     },
//     ".token.variable": {
//       color: "#9cdcfe", // VS Code light blue for variables
//     },
//     ".token.comment": {
//       color: "#6a9955", // VS Code green for comments
//       fontStyle: "italic",
//     },
//     ".token.operator": {
//       color: "#d4d4d4", // Default text color for operators
//     },
//     ".token.punctuation": {
//       color: "#d4d4d4", // Default text color for punctuation
//     },
//   };

//   return (
//     <div className="relative mb-6 rounded-lg overflow-hidden shadow-lg">
//       {/* Header bar to mimic VS Code */}
//       <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
//         <div className="flex items-center space-x-3">
//           {/* Traffic light buttons */}
//           <div className="flex space-x-1">
//             <div className="w-3 h-3 rounded-full bg-red-500"></div>
//             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//             <div className="w-3 h-3 rounded-full bg-green-500"></div>
//           </div>

//           {/* File icon and name */}
//           <div className="flex items-center space-x-2">
//             <FileText size={14} className="text-gray-400" />
//             <span className="text-sm text-gray-400 font-mono">
//               {language === "javascript" ? "script.js" : `code.${language}`}
//             </span>
//           </div>
//         </div>

//         {/* Copy button */}
//         <button
//           onClick={handleCopy}
//           className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200"
//           title={copied ? "Copied!" : "Copy code"}
//         >
//           {copied ? (
//             <>
//               <Check size={12} />
//               <span>Copied!</span>
//             </>
//           ) : (
//             <>
//               <Copy size={12} />
//               <span>Copy</span>
//             </>
//           )}
//         </button>
//       </div>

//       <SyntaxHighlighter
//         language={language}
//         style={customStyle}
//         customStyle={{
//           margin: 0,
//           background: "#1e1e1e",
//           fontSize: "14px",
//           lineHeight: "1.5",
//           padding: "16px",
//           borderRadius: "0px 0px 0px 0px",
//         }}
//         showLineNumbers={true}
//         lineNumberStyle={{
//           color: "#858585",
//           backgroundColor: "#1e1e1e",
//           paddingRight: "16px",
//           minWidth: "2em",
//           textAlign: "right",
//         }}
//         wrapLines={true}
//         wrapLongLines={true}
//       >
//         {code}
//       </SyntaxHighlighter>
//     </div>
//   );
// };

// export default CodeBlock;
