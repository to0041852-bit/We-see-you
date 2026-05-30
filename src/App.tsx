import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  Sparkles, 
  Smartphone, 
  Instagram, 
  Facebook, 
  Youtube, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink, 
  User, 
  Search, 
  Info, 
  X, 
  CheckCircle2,
  Lock,
  Globe,
  Share2,
  ChevronRight
} from "lucide-react";
import AndroidFrame from "./components/AndroidFrame";
import ManualSearchTips from "./components/ManualSearchTips";
import { PRESET_PEOPLE } from "./data/presets";
import { AnalysisResult, GroundingSource, SocialProfile } from "./types";

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [helperText, setHelperText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatusText, setAnalysisStatusText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Results State
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progressive Status scanning animation titles
  const progressSteps = [
    { threshold: 10, text: "Configuring neural image matrices..." },
    { threshold: 30, text: "Detecting facial landmarks & bio-vectors..." },
    { threshold: 50, text: "Querying Sri Lanka domain data indexes..." },
    { threshold: 75, text: "Correlating search groundings & socials..." },
    { threshold: 92, text: "Structuring digital identity matches..." },
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const next = prev + 3;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Find step text matching current progress
          const currentStep = progressSteps.find(step => next <= step.threshold);
          if (currentStep) {
            setAnalysisStatusText(currentStep.text);
          }
          return next;
        });
      }, 95);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // Handle Preset select
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_PEOPLE.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setImagePreview(preset.imageUrl);
    setImageBase64(null); // Clear manual base64 since it is a preset
    setHelperText(preset.sampleHelperText);
    setErrorMsg(null);
    setResult(null);
    setSources([]);
  };

  // Convert uploaded image to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file size (under 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size too large. Please upload an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImageBase64(base64String);
      setSelectedPresetId(null); // Clear selected preset if uploading custom
      setResult(null);
      setSources([]);
      setErrorMsg(null);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop implementation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Trigger file selection click
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Reset current selections
  const handleReset = () => {
    setSelectedPresetId(null);
    setImagePreview(null);
    setImageBase64(null);
    setHelperText("");
    setResult(null);
    setSources([]);
    setErrorMsg(null);
    setAnalysisProgress(0);
    setAnalysisStatusText("");
  };

  // Execute Analysis
  const handleStartAnalysis = async () => {
    if (!imagePreview) {
      setErrorMsg("Please upload an image or select a preset to begin.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStatusText("Initializing localized scan...");
    setErrorMsg(null);

    try {
      // If a preset is selected, we can immediately mock its result or run live analysis if needed
      if (selectedPresetId) {
        const preset = PRESET_PEOPLE.find(p => p.id === selectedPresetId);
        if (preset) {
          // Delay to show realistic face scanning animations
          await new Promise((resolve) => setTimeout(resolve, 3100));
          setResult(preset.mockResult);
          setSources(preset.mockSources);
          setIsAnalyzing(false);
          return;
        }
      }

      // If it is a manually uploaded base64-encoded image:
      if (imageBase64) {
        // We will make a real server side API call to Express /api/analyze
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageBase64,
            helperText: helperText.trim(),
          }),
        });

        // Ensure progress finishes up safely
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "The analysis server encountered an error.");
        }

        const data = await response.json();
        setResult(data.result);
        setSources(data.sources || []);
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setErrorMsg(err.message || "Unable to complete analysis. Verify connection or Settings > Secrets.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render match confidence color coding
  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case "High":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "Medium":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "Low":
        return "bg-amber-800/15 text-amber-500 border border-amber-800/30";
      default:
        return "bg-zinc-800 text-zinc-400 border border-zinc-700/50";
    }
  };

  // Handle open preset suggestions as live google query
  const formatGoogleQuery = (query: string) => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <AndroidFrame>
      {/* App Header Bar */}
      <div className="w-full bg-white/[0.04] backdrop-blur-[24px] px-5 py-4 flex items-center justify-between sticky top-0 z-30 border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#818cf8] text-slate-100 shadow-lg shadow-indigo-950/30">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h1 className="text-xs font-extrabold text-slate-100 tracking-wider uppercase">SriFace AI</h1>
            <p className="text-[9px] text-zinc-400 font-medium">Sri Lanka Profile Locator</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1 text-[9px] text-indigo-300 font-bold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>PRO</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 flex-1 flex flex-col space-y-5">
        
        {/* Intro */}
        <div className="text-left space-y-1">
          <h2 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5">
            <span>Face Profile Finder</span>
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-300 opacity-90 leading-relaxed">
            Upload any face or choose a public figure below. Our automated system searches public networks in Sri Lanka to index associated social profiles.
          </p>
        </div>

        {/* Presets Quick-Select */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block text-left">
            🎯 Demo Presets (Instant Face Match)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_PEOPLE.map((person) => (
              <button
                key={person.id}
                onClick={() => handleSelectPreset(person.id)}
                className={`group flex flex-col items-center p-2 rounded-2xl border text-center transition-all ${
                  selectedPresetId === person.id
                    ? "bg-white/[0.08] backdrop-blur border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/10"
                }`}
              >
                <div className="w-11 h-11 rounded-full overflow-hidden border border-white/15 group-hover:border-white/30 transition-all mb-1.5 relative">
                  <img 
                    src={person.imageUrl} 
                    alt={person.imageAlt} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedPresetId === person.id && (
                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-200 line-clamp-1 truncate w-full">
                  {person.name.split(" ")[0]}
                </span>
                <span className="text-[8px] text-indigo-300 opacity-80 leading-none mt-0.5 line-clamp-1 truncate w-full">
                  {person.role.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Upload Area */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block text-left">
            📸 Photograph Upload & Scan
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!imagePreview ? triggerFileSelect : undefined}
            className={`w-full relative rounded-3xl border flex flex-col items-center justify-center transition-all overflow-hidden ${
              imagePreview ? "p-0 bg-white/[0.01] border-white/10 h-64" : "p-6 cursor-pointer border-dashed"
            } ${
              isDragging 
                ? "border-indigo-500 bg-[#6366f1]/10" 
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            {imagePreview ? (
              <div className="w-full h-full relative group flex items-center justify-center bg-black/40">
                <img
                  src={imagePreview}
                  alt="Scannable face"
                  className="w-full h-full object-contain transition-transform group-hover:scale-102 duration-500 z-10"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Facial Scanner Light Effect during analysis */}
                {isAnalyzing && (
                  <>
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent shadow-[0_0_15px_#6366f1] animate-[bounce_2.5s_infinite] z-20"></div>
                    <div className="absolute inset-0 bg-[#6366f1]/5 mix-blend-overlay animate-pulse z-15"></div>
                  </>
                )}

                {/* Camera Frame Corner Marks matched from the design reference */}
                <div className="absolute inset-4 pointer-events-none z-15">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br-lg"></div>
                </div>

                {/* Close Button overlay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/95 backdrop-blur-md shadow-md transition-all z-25"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Info Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 text-left z-20">
                  <div className="flex items-center gap-1.5 font-sans">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-semibold text-slate-200">
                      {selectedPresetId ? "Preset Person Active" : "Uploaded Photo Ready"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 select-none py-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 text-indigo-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-200">
                    Drag face here OR <span className="text-indigo-400 underline decoration-indigo-400/30">Browse Files</span>
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Supports JPEG, PNG (Max 10MB)</p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Input parameters helper box */}
        <div className="space-y-1 text-left">
          <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block">
            🕵️‍♀️ Helper Details & Context
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-zinc-400">
              <Search className="w-4 h-4 text-indigo-400" />
            </span>
            <input
              type="text"
              value={helperText}
              onChange={(e) => setHelperText(e.target.value)}
              placeholder="e.g. bowler, pop artist, actor Colombo..."
              className="w-full bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl py-3 pl-10 pr-3 text-xs text-slate-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
            />
          </div>
          <p className="text-[9px] text-zinc-400 leading-normal pl-1 opacity-80">
            Supplying helper tags boosts facial model targeting accuracy across regional social nodes.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2">
          {isAnalyzing ? (
            <div className="w-full bg-white/[0.04] backdrop-blur rounded-3xl p-4 border border-white/10 text-center space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                <span className="flex items-center gap-1.5 truncate">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-450 animate-spin flex-shrink-0" />
                  <span className="truncate text-indigo-300 font-bold">{analysisStatusText}</span>
                </span>
                <span className="text-indigo-400 ml-1 font-bold">{analysisProgress}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-indigo-400 h-full rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-shrink-0 px-4 py-3.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center"
                  title="Clear All Inputs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={!imagePreview}
                className={`flex-1 font-bold text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2 tracking-wide transition-all ${
                  imagePreview
                    ? "bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white hover:brightness-110 shadow-[0_10px_30px_rgba(99,102,241,0.30)] active:scale-[0.98] cursor-pointer"
                    : "bg-white/[0.02] border border-white/5 text-zinc-500 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>START IDENTITY ANALYSIS</span>
              </button>
            </div>
          )}
        </div>

        {/* Error reporting alert block */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-2.5 text-left text-[11px] text-rose-400 leading-relaxed animate-pulse">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 max-w-full">
              <span className="font-bold block text-slate-200">Search Blocked</span>
              <p className="opacity-90">{errorMsg}</p>
              {!selectedPresetId && (
                <div className="mt-2 text-[10px] bg-black/40 p-2 rounded-xl border border-white/5 text-zinc-400 leading-normal">
                  <span className="font-semibold text-indigo-400 block mb-0.5">💡 Instant Trial Shortcut:</span>
                  Try choosing any <strong className="text-zinc-200 font-bold">Demo Preset</strong> avatar from the panel above. They work instantly with mock indexes!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {result && (
          <div className="animate-[slideUp_0.4s_ease-out] text-left space-y-4 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-widest">
                📊 Identification Output
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-500">Security Guarded</span>
                <Lock className="w-3 h-3 text-zinc-500" />
              </div>
            </div>

            {/* Individual Profile Card is a Glass Panel */}
            <div className="bg-white/5 backdrop-blur-[24px] rounded-3xl border border-white/10 overflow-hidden shadow-lg shadow-black/30 p-5 space-y-4">
              
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] px-2 py-0.5 font-bold uppercase rounded-md ${
                      result.identified ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/10 text-zinc-400"
                    }`}>
                      {result.identified ? "Identified Public Figure" : "Generic Subject"}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 font-semibold rounded-md ${getConfidenceBadgeColor(result.confidence)}`}>
                      Confidence: {result.confidence}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-100 tracking-tight mt-1.5">
                    {result.name || "Undisclosed Subject"}
                  </h3>
                </div>
              </div>

              {/* Character Biography */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold tracking-wider text-indigo-400 uppercase">Context Bio</span>
                <p className="text-xs text-slate-200 leading-relaxed bg-white/[0.02] backdrop-blur p-3.5 rounded-2xl border border-white/5">
                  {result.bio || "No description provided."}
                </p>
              </div>

              {/* Match Verification Narrative */}
              {result.reasoning && (
                <div className="text-[10px] text-slate-300 leading-normal pl-1 opacity-80">
                  <span className="font-bold text-indigo-350 mr-1">Match Evidence:</span>{result.reasoning}
                </div>
              )}

              {/* Active Profile Links in Sri Lanka */}
              <div className="space-y-2 pt-1">
                <span className="text-[9px] font-bold tracking-wider text-indigo-350 uppercase block">
                  🌐 Social Network Links Located
                </span>
                
                {result.profiles && result.profiles.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {result.profiles.map((profile, idx) => {
                      const isFB = profile.platform === "Facebook";
                      const isIG = profile.platform === "Instagram";
                      const isYT = profile.platform === "YouTube";

                      let btnStyle = "bg-white/[0.04] text-zinc-300 border-white/5 hover:bg-white/[0.08]";
                      let iconColor = "text-slate-400";
                      let icon = <Globe className="w-4 h-4" />;

                      if (isFB) {
                        btnStyle = "bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/20 text-blue-400";
                        iconColor = "text-blue-400";
                        icon = <Facebook className="w-4 h-4" />;
                      } else if (isIG) {
                        btnStyle = "bg-pink-600/10 hover:bg-pink-600/20 border-pink-600/20 text-pink-400";
                        iconColor = "text-pink-400";
                        icon = <Instagram className="w-4 h-4" />;
                      } else if (isYT) {
                        btnStyle = "bg-rose-600/10 hover:bg-rose-600/20 border-rose-600/20 text-rose-455";
                        iconColor = "text-rose-455";
                        icon = <Youtube className="w-4 h-4" />;
                      }

                      return (
                        <a
                          key={idx}
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-xs font-bold ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={iconColor}>{icon}</span>
                            <span>{profile.platform} Profile</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] opacity-80 font-medium">
                              Match: {profile.confidence}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-white/[0.02] rounded-2xl text-xs text-slate-400 border border-white/5">
                    No specific social media directories were verified. Please inspect Search Suggestions below.
                  </div>
                )}
              </div>

              {/* Grounding Sources Carousel (Web Groundings) */}
              {sources && sources.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between text-[9px] font-bold tracking-wider text-indigo-400 uppercase">
                    <span>Google Search Grounding sources</span>
                    <Globe className="w-3 h-3 text-indigo-455" />
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {sources.map((src, index) => (
                      <a
                        key={index}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-xl text-[10px] text-zinc-300 transition-all select-none"
                      >
                        <span className="truncate pr-4 font-semibold">{src.title}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Search Pointers */}
              {result.searchSuggestions && result.searchSuggestions.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <span className="text-[9px] font-bold tracking-wider text-indigo-350 uppercase block">
                    🔍 Recommended Search Query Phrases
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.searchSuggestions.map((query, index) => (
                      <a
                        key={index}
                        href={formatGoogleQuery(query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-3 py-1.5 rounded-xl bg-white/[0.03] text-zinc-300 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all flex items-center gap-1 hover:text-white font-semibold"
                      >
                        <Search className="w-3 h-3 text-indigo-400" />
                        <span className="line-clamp-1">{query}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-zinc-500 ml-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Guideline Informational Module */}
        <ManualSearchTips />

        {/* App Footer Details */}
        <div className="pt-2 text-center select-none">
          <p className="text-[9px] text-zinc-400 opacity-80">
            Powered by Gemini Multimodal Integration Engine & Google Search Grounding.
          </p>
          <p className="text-[8px] text-zinc-500 mt-1">
            Build 2026.0b1 • All rights reserved • Colombo, Sri Lanka
          </p>
        </div>

      </div>
    </AndroidFrame>
  );
}
