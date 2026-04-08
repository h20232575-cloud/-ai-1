import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Image as ImageIcon, Video, Loader2, Download, RefreshCw, Wand2 } from "lucide-react";
import { generateLogo, animateLogo } from "@/lib/gemini";

type GenerationStep = "idle" | "generating-logo" | "logo-ready" | "animating" | "complete";

export const LogoGenerator: React.FC = () => {
  const [description, setDescription] = useState("");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [step, setStep] = useState<GenerationStep>("idle");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLogo = async () => {
    if (!description.trim()) return;
    setStep("generating-logo");
    setError(null);
    try {
      const url = await generateLogo(description, imageSize);
      setLogoUrl(url);
      setStep("logo-ready");
    } catch (err: any) {
      setError(err.message || "Failed to generate logo");
      setStep("idle");
    }
  };

  const handleAnimate = async () => {
    if (!logoUrl) return;
    setStep("animating");
    setError(null);
    try {
      const url = await animateLogo(logoUrl, description, aspectRatio);
      setVideoUrl(url);
      setStep("complete");
    } catch (err: any) {
      setError(err.message || "Failed to animate logo");
      setStep("logo-ready");
    }
  };

  const reset = () => {
    setStep("idle");
    setLogoUrl(null);
    setVideoUrl(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900">LogoAnimator</h1>
            <p className="text-neutral-500">Transform your brand vision into cinematic motion.</p>
          </div>

          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  Company Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g. A futuristic tech company called 'Nova' that focuses on sustainable energy..."
                  className="min-h-[120px] resize-none focus-visible:ring-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={step !== "idle" && step !== "logo-ready"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Image Quality</Label>
                  <Select
                    value={imageSize}
                    onValueChange={(v: any) => setImageSize(v)}
                    disabled={step !== "idle"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1K">1K Resolution</SelectItem>
                      <SelectItem value="2K">2K Resolution</SelectItem>
                      <SelectItem value="4K">4K Resolution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Video Format</Label>
                  <Select
                    value={aspectRatio}
                    onValueChange={(v: any) => setAspectRatio(v)}
                    disabled={step !== "idle" && step !== "logo-ready"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                      <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {step === "idle" || step === "generating-logo" ? (
                  <Button
                    onClick={handleGenerateLogo}
                    disabled={!description.trim() || step === "generating-logo"}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-all"
                  >
                    {step === "generating-logo" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Designing Logo...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Logo
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={handleAnimate}
                      disabled={step === "animating" || step === "complete"}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                    >
                      {step === "animating" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Animating...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          {step === "complete" ? "Animation Ready" : "Animate Logo"}
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={reset} className="w-full h-12 border-neutral-200">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Start Over
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">How it works</h3>
            <ul className="space-y-3">
              {[
                { icon: ImageIcon, text: "AI generates a unique logo from your text." },
                { icon: Video, text: "Veo transforms the static image into video." },
                { icon: Sparkles, text: "Download your high-res assets instantly." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                  <item.icon className="w-4 h-4 mt-0.5 text-neutral-400" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8">
          <div className="relative aspect-square lg:aspect-video bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-200 shadow-inner flex items-center justify-center">
            <AnimatePresence mode="wait">
              {step === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4 px-8"
                >
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-neutral-300" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-neutral-900">Preview Canvas</h2>
                    <p className="text-neutral-500 max-w-xs mx-auto">
                      Your generated logo and animation will appear here.
                    </p>
                  </div>
                </motion.div>
              )}

              {(step === "generating-logo" || step === "animating") && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-neutral-200 border-t-primary rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {step === "generating-logo" ? <ImageIcon className="w-8 h-8 text-neutral-400" /> : <Video className="w-8 h-8 text-neutral-400" />}
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-neutral-900">
                      {step === "generating-logo" ? "Crafting your brand identity..." : "Bringing your logo to life..."}
                    </h3>
                    <p className="text-neutral-500 text-sm animate-pulse">
                      {step === "generating-logo" ? "Analyzing description & generating vectors" : "This may take a minute or two"}
                    </p>
                  </div>
                </motion.div>
              )}

              {(step === "logo-ready" || (step === "animating" && logoUrl && !videoUrl)) && logoUrl && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="relative w-full h-full flex items-center justify-center p-8"
                >
                  <img
                    src={logoUrl}
                    alt="Generated Logo"
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 flex gap-2">
                    <Badge className="bg-white/90 text-neutral-900 backdrop-blur border-none shadow-sm">
                      Logo Ready
                    </Badge>
                    <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur shadow-sm" asChild>
                      <a href={logoUrl} download="logo.png">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "complete" && videoUrl && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full"
                >
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 right-6 flex gap-2">
                    <Badge className="bg-black/50 text-white backdrop-blur border-none shadow-sm">
                      Animation Complete
                    </Badge>
                    <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur shadow-sm" asChild>
                      <a href={videoUrl} download="logo-animation.mp4">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
             {[
               { label: "AI Model", value: "Gemini 3 Pro" },
               { label: "Engine", value: "Veo 3.1 Fast" },
               { label: "Status", value: step === "complete" ? "Finished" : step === "idle" ? "Ready" : "Processing" }
             ].map((stat, i) => (
               <div key={i} className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-sm font-semibold text-neutral-900">{stat.value}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
