"use client";

import { useState, useEffect } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Code, Sparkles, Table } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Textarea } from "@/components/ui/textarea";

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
];

const promptSuggestions: Record<string, string[]> = {
  python: [
    "def add_numbers(a, b):",
    "def fibonacci(n):",
    "class Person:",
    "with open('file.txt', 'r') as file:",
  ],
  javascript: [
    "function addNumbers(a, b) {",
    "const fibonacci = (n) => {",
    "class Person {",
    "fetch('https://api.example.com/data')",
  ],
  typescript: [
    "function addNumbers(a: number, b: number): number {",
    "const fibonacci = (n: number): number => {",
    "interface Person {",
    "async function fetchData(): Promise<void> {",
  ],
  rust: [
    "fn add_numbers(a: i32, b: i32) -> i32 {",
    "fn fibonacci(n: u32) -> u32 {",
    "struct Person {",
    "use std::fs::File;",
  ],
  go: [
    "func addNumbers(a, b int) int {",
    "func fibonacci(n int) int {",
    "type Person struct {",
    'file, err := os.Open("file.txt")',
  ],
};

type LanguageType = "python" | "javascript" | "typescript" | "rust" | "go";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageType>("python");
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSuggestions(promptSuggestions[language] || []);
  }, [language]);

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (value) {
      const matchingSuggestions = suggestions.filter((s) =>
        s.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(
        matchingSuggestions.length > 0
          ? matchingSuggestions
          : promptSuggestions[language]
      );
    } else {
      setSuggestions(promptSuggestions[language]);
    }
  };

  const generateCodeSnippet = async () => {
    try {
      const response = await fetch("/api/copilotkit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          prompt,
        }),
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to generate code snippet");
      }

      const data = await response.json();
      console.log("Data:", data);
      setGeneratedCode(data.result);
      setOpen(false);
    } catch (error) {
      console.error("Error generating code snippet:", error);
    }
  };

  // const handleKeyDown = (event: React.KeyboardEvent) => {
  //   if (event.key === "Tab" && suggestions.length > 0) {
  //     event.preventDefault();
  //     setPrompt(suggestions[0]);
  //     setSuggestions([]);
  //   }
  // };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-700 text-gray-200 ">
      <header className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center">
          <span className="relative inline-block text-gray-100 font-semibold">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 blur-lg transform -skew-y-3 transition duration-500 ease-in-out" />
            <span className="relative z-10 flex items-center">
              <Code className="mr-2" /> Snippet Sorcerer
            </span>
          </span>
        </h1>
        <Button
          className="bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-300"
          onClick={() => setOpen(true)}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Create New
        </Button>
      </header>

      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Card className="p-8 bg-white/10 backdrop-blur-lg text-gray-300 rounded-lg max-w-2xl w-full mb-8 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            CopilotKit-Powered Code Snippet Generator
          </h2>
          <p className="mb-6 text-lg">
            Harness the power of AI to generate code snippets tailored to your
            needs. Use the CopilotKit to generate code snippets in various
            programming languages.
          </p>
          <Button
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
            onClick={() => setOpen(true)}
          >
            <Sparkles className="mr-2 h-5 w-5" /> Create New Snippet
          </Button>
        </Card>

        {generatedCode && (
          <Card className="mt-6 bg-black/30 backdrop-blur-md text-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Code className="mr-2" /> Generated Code:
            </h3>
            <ScrollArea className="h-[300px] rounded-md border">
              <SyntaxHighlighter
                language={language}
                style={atomDark}
                showLineNumbers
              >
                {generatedCode}
              </SyntaxHighlighter>
            </ScrollArea>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black text-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Sparkles className="mr-2" /> Create Code Snippet
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block mb-2 font-medium">Language:</label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as LanguageType)}
              >
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Prompt:</label>
              <Textarea
                className="border rounded-md p-2 w-full bg-gray-800 text-white placeholder-gray-300"
                placeholder="Start typing your prompt..."
                value={prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                // onKeyDown={handleKeyDown}
                rows={4}
              />
              {suggestions.length > 0 && (
                <div className="mt-2 bg-gray-800 rounded-md p-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:bg-gray-700 p-1 rounded"
                      onClick={() => setPrompt(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-mdtransition-colors duration-300"
              onClick={generateCodeSnippet}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Generate Snippet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CopilotPopup
        instructions={"Generate the best code snippets based on user input."}
        labels={{
          title: "AI Code Assistant",
          initial: "How can I assist you with coding today?",
        }}
        // trigger={
        //   <Button
        //     className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg"
        //     size="icon"
        //   >
        //     <MessageSquare className="h-6 w-6" />
        //   </Button>
        // }
      />
    </main>
  );
}
