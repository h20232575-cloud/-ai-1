import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface ApiKeySelectionProps {
  onKeySelected: () => void;
}

export const ApiKeySelection: React.FC<ApiKeySelectionProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) {
          onKeySelected();
        }
      }
    };
    checkKey();
  }, [onKeySelected]);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success as per skill instructions to avoid race conditions
      onKeySelected();
    }
  };

  if (hasKey === true) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 p-4">
      <Card className="w-full max-w-md border-neutral-200 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Key className="text-white w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">API Key Required</CardTitle>
          <CardDescription className="text-neutral-500">
            To use high-quality image and video generation, you need to select a paid Gemini API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-neutral-100 p-4 rounded-lg text-sm text-neutral-600 space-y-2">
            <p>
              This app uses <strong>gemini-3-pro-image-preview</strong> and <strong>veo-3.1-fast-generate-preview</strong>, which require a billing-enabled Google Cloud project.
            </p>
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary font-medium hover:underline"
            >
              Learn about billing <ExternalLink className="ml-1 w-3 h-3" />
            </a>
          </div>
          <Button onClick={handleSelectKey} className="w-full h-12 text-base font-medium">
            Select API Key
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
