"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { Play, Save, Copy } from "lucide-react";

interface SQLEditorProps {
  defaultQuery?: string;
  onExecute?: (results: any) => void;
  onSave?: (query: string) => void;
}

export default function SQLEditor({ defaultQuery = "", onExecute, onSave }: SQLEditorProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.rpc('execute_query', { query_text: query });
      if (error) throw error;
      setResults(data);
      if (onExecute) onExecute(data);
    } catch (err: any) {
      setError(err.message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (onSave) onSave(query);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>SQL Editor</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              onClick={handleExecute}
              size="sm"
              disabled={isLoading}
              className="gap-2 bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
            >
              <Play className="h-4 w-4" />
              Execute
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query..."
          className="font-mono min-h-[200px] mb-4"
        />
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {results && (
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Object.keys(results[0] || {}).map((key) => (
                    <th key={key} className="border p-2 bg-muted text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row: any, i: number) => (
                  <tr key={i}>
                    {Object.values(row).map((value: any, j: number) => (
                      <td key={j} className="border p-2">
                        {JSON.stringify(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 