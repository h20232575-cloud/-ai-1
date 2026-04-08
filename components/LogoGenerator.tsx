import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Image as ImageIcon, Loader2, Download, RefreshCw, Wand2, Search, ExternalLink } from "lucide-react";
import { generateLogo, findInspiration } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

type GenerationStep = "idle" | "generating" | "ready";

export const LogoGenerator: React.FC = () => {
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<GenerationStep>("idle");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [inspiration, setInspiration] = useState<{ text: string; sources: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setStep("generating");
    setError(null);
    try {
      const url = await generateLogo(description);
      setLogoUrl(url);
      setStep("ready");
    } catch (err: any) {
      setError(err.message || "로고 생성에 실패했습니다.");
      setStep("idle");
    }
  };

  const handleFindInspiration = async () => {
    if (!description.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const result = await findInspiration(description);
      setInspiration(result);
    } catch (err: any) {
      setError(err.message || "영감을 찾는 데 실패했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const reset = () => {
    setStep("idle");
    setLogoUrl(null);
    setInspiration(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900">LogoDesigner</h1>
            <p className="text-neutral-500">무료로 유니크한 로고를 제작하고 브랜드 영감을 얻으세요.</p>
          </div>

          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  회사 설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="예: 지속 가능한 에너지를 연구하는 'Nova'라는 이름의 미래 지향적인 기술 회사..."
                  className="min-h-[120px] resize-none focus-visible:ring-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={step === "generating"}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  onClick={handleGenerate}
                  disabled={!description.trim() || step === "generating"}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-all"
                >
                  {step === "generating" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      로고 디자인 중...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      로고 생성하기
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleFindInspiration}
                  disabled={!description.trim() || isSearching}
                  className="w-full h-12 border-neutral-200"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      검색 중...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      디자인 영감 찾기
                    </>
                  )}
                </Button>

                {step === "ready" && (
                  <Button variant="ghost" onClick={reset} className="w-full h-12 text-neutral-500">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    다시 시작하기
                  </Button>
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
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">무료 기능</h3>
            <ul className="space-y-3">
              {[
                { icon: ImageIcon, text: "텍스트를 바탕으로 AI가 유니크한 로고를 생성합니다." },
                { icon: Search, text: "유사한 브랜드와 디자인 스타일을 찾아줍니다." },
                { icon: Sparkles, text: "생성된 자산을 즉시 다운로드할 수 있습니다." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                  <item.icon className="w-4 h-4 mt-0.5 text-neutral-400" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Preview & Inspiration */}
        <div className="lg:col-span-8 space-y-8">
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
                    <h2 className="text-xl font-semibold text-neutral-900">디자인 캔버스</h2>
                    <p className="text-neutral-500 max-w-xs mx-auto">
                      생성된 로고가 여기에 표시됩니다.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === "generating" && (
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
                      <ImageIcon className="w-8 h-8 text-neutral-400" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-neutral-900">브랜드 아이덴티티 제작 중...</h3>
                    <p className="text-neutral-500 text-sm animate-pulse">설명을 분석하여 벡터 이미지를 생성하고 있습니다.</p>
                  </div>
                </motion.div>
              )}

              {step === "ready" && logoUrl && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                      로고 준비됨
                    </Badge>
                    <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur shadow-sm">
                      <a href={logoUrl} download="logo.png">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inspiration Section */}
          <AnimatePresence>
            {inspiration && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-neutral-900">디자인 영감</h2>
                </div>
                
                <Card className="border-neutral-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6 prose prose-neutral max-w-none">
                    <ReactMarkdown>{inspiration.text}</ReactMarkdown>
                    
                    {inspiration.sources.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-neutral-100">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">출처 및 링크</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {inspiration.sources.map((source, i) => (
                            <a
                              key={i}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                            >
                              <span className="text-sm font-medium text-neutral-700 truncate mr-2">{source.title}</span>
                              <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-primary" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
