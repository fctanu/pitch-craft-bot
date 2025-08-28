import { Button } from "@/components/ui/button";
import {
  Mic,
  Loader2,
  StopCircle,
  RotateCcw,
  Sparkles,
  Save,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { usePitches } from "@/context/PitchContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// Phases of the pitch creation state machine
type Phase =
  | "idle"
  | "recording"
  | "recorded"
  | "transcribing"
  | "review"
  | "generating"
  | "result";

// Minimal SpeechRecognition type declarations (experimental Web Speech API)
interface SpeechRecognitionResultItem {
  transcript: string;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  0: SpeechRecognitionResultItem;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => unknown)
    | null;
  onerror: ((this: ISpeechRecognition, ev: Event) => unknown) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionConstructor = new () => ISpeechRecognition;

const MAX_SECONDS = 120;

const CreatePitch: React.FC = () => {
  const { addPitch } = usePitches();
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [structure, setStructure] = useState<string[]>([]);
  const [generationSource, setGenerationSource] = useState<
    "gemini" | "fallback" | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const interimRef = useRef<string>("");
  const hadTranscriptRef = useRef(false);

  // Timer for recording duration
  useEffect(() => {
    if (phase === "recording") {
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stopRecording();
          }
          return s + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        setPhase("recorded");
        // Immediately start transcription and open dialog
        setDialogOpen(true);
        void transcribe();
      };
      mr.start();
      setSeconds(0);
      setTranscript("");
      setPhase("recording");

      // Start speech recognition (browser) if available
      const win = window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      };
      const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
        win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionCtor) {
        const recognition = new SpeechRecognitionCtor();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalText = "";
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              finalText += res[0].transcript + " ";
            } else {
              interim += res[0].transcript;
            }
          }
          if (finalText) {
            setTranscript((prev) => {
              const next = (prev + " " + finalText).trim();
              if (next) hadTranscriptRef.current = true;
              return next;
            });
          }
          interimRef.current = interim; // store interim for display if needed later
        };
        recognition.onerror = (e: Event) => {
          console.warn("SpeechRecognition error", e);
        };
        try {
          recognition.start();
        } catch (err) {
          /* start race ignored */
        }
      } else {
        console.info(
          "SpeechRecognition API not supported in this browser. Using fallback."
        );
      }
    } catch (e) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      /* ignore stop race */
    }
  };

  const rerecord = () => {
    setPhase("idle");
    setSeconds(0);
    setTranscript("");
    setOneLiner("");
    setStructure([]);
    setGenerationSource(null);
  };

  const transcribe = async () => {
    setPhase("transcribing");
    // Build blob
    // Raw audio blob (future: send to backend Whisper endpoint)
    const _blob = new Blob(chunksRef.current, { type: "audio/webm" });

    // If SpeechRecognition is active, give it a short window to flush final results
    if (recognitionRef.current) {
      const initialHad = hadTranscriptRef.current || !!transcript.trim();
      const waitMs = initialHad ? 500 : 1400; // give finals time
      await new Promise((r) => setTimeout(r, waitMs));
      const finalHad = hadTranscriptRef.current || !!transcript.trim();
      if (!finalHad) {
        setTranscript(
          "(No speech detected. You can edit this text or re-record.)"
        );
      }
    } else {
      // Browser doesn't support SpeechRecognition – keep previous placeholder approach
      await new Promise((r) => setTimeout(r, 800));
      if (!transcript.trim()) {
        setTranscript(
          "(Transcription unavailable in this browser. Integrate Whisper/OpenAI for full accuracy.)"
        );
      }
    }
    setPhase("review");
  };

  const generate = async () => {
    setPhase("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "API error");
      }
      type SlideLike =
        | string
        | { title?: string; name?: string; heading?: string };
      const data: { one_liner?: string; slides?: SlideLike[] } =
        await res.json();
      const normalizedSlides: string[] = Array.isArray(data.slides)
        ? data.slides
            .map((s: SlideLike) =>
              typeof s === "string"
                ? s.trim()
                : (s.title || s.name || s.heading || "").trim()
            )
            .filter(Boolean)
        : [];
      const finalSlides =
        normalizedSlides.length === 10
          ? normalizedSlides
          : normalizedSlides.length > 0
          ? [
              ...normalizedSlides,
              ...[
                "Title: Company + Tagline",
                "Problem / Opportunity",
                "Value Proposition",
                "Underlying Magic",
                "Business Model",
                "Go-To-Market",
                "Competitive Analysis",
                "Management Team",
                "Financials / Metrics",
                "Current Status & Ask",
              ].slice(normalizedSlides.length),
            ].slice(0, 10)
          : [
              "Title: Company + Tagline",
              "Problem / Opportunity",
              "Value Proposition",
              "Underlying Magic",
              "Business Model",
              "Go-To-Market",
              "Competitive Analysis",
              "Management Team",
              "Financials / Metrics",
              "Current Status & Ask",
            ];
      setOneLiner((data.one_liner || "").trim());
      setStructure(finalSlides);
      setGenerationSource("gemini");
    } catch (err) {
      console.error(
        "Generation API failed, falling back to local heuristic",
        err
      );
      // Fallback heuristic (previous logic condensed)
      const cleaned = transcript.trim().replace(/\s+/g, " ");
      const lower = cleaned.toLowerCase();
      const contains = (kw: string | string[]) =>
        (Array.isArray(kw) ? kw : [kw]).some((k) => lower.includes(k));
      const targetMatch = lower.match(
        /(?:for|help|helping) ([a-z0-9 ,-]+?)(?: to | build | create | solve | with | using | by |\.|,)/
      );
      const targetRaw = targetMatch ? targetMatch[1].trim() : "founders";
      const target = targetRaw.split(/[, ]+/).slice(0, 4).join(" ");
      const valueMatch = lower.match(
        /to ([a-z ]{6,80}?)(?:\.|,| using | with | by )/
      );
      const value = valueMatch
        ? valueMatch[1].trim()
        : "turn spoken ideas into investor-ready pitch material";
      const techPieces: string[] = [];
      if (contains(["ai", "artificial intelligence"])) techPieces.push("AI");
      if (contains(["ml", "machine learning"])) techPieces.push("ML models");
      if (contains("speech") || contains("voice"))
        techPieces.push("speech processing");
      if (contains("transcrib")) techPieces.push("transcription");
      const tech = techPieces.length ? techPieces.join(" + ") : "automation";
      const generatedOneLiner = `We help ${target} ${value} using ${tech}.`;
      setOneLiner(generatedOneLiner);
      setStructure([
        "Title: Company + Tagline",
        "Problem",
        "Solution",
        "Business Model",
        "Underlying Magic",
        "Go-To-Market",
        "Competition",
        "Team",
        "Financials / Metrics",
        "Ask & Vision",
      ]);
      setGenerationSource("fallback");
      toast.error("Used local fallback pitch generation");
    }
    setPhase("result");
    setDialogOpen(false);
  };

  const savePitch = () => {
    const saved = addPitch({ oneLiner, structure, transcript });
    toast.success("Pitch saved to library");
    // Optionally redirect or keep context; keep result view.
  };

  // UI helpers
  const renderControls = () => {
    switch (phase) {
      case "idle":
        return (
          <Button
            size="lg"
            variant="hero"
            onClick={startRecording}
            className="relative w-56 h-56 rounded-full text-lg font-semibold shadow-glow flex flex-col gap-3 justify-center"
          >
            <Mic className="w-10 h-10" />
            Start Recording
          </Button>
        );
      case "recording":
        return (
          <Button
            size="lg"
            variant="destructive"
            onClick={stopRecording}
            className="relative w-56 h-56 rounded-full text-lg font-semibold flex flex-col gap-3 justify-center"
          >
            <StopCircle className="w-10 h-10" />
            Stop ({seconds}s)
            <span
              className="absolute inset-0 rounded-full animate-ping bg-destructive/25"
              aria-hidden="true"
            />
          </Button>
        );
      case "recorded":
        return null; // dialog handles UI
      case "transcribing":
        return <LoaderState label="Transcribing audio" />;
      case "review":
        return null; // handled in dialog
      case "generating":
        return <LoaderState label="Generating pitch" />;
      case "result":
        return (
          <div className="space-y-8 w-full">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  One-liner{" "}
                  {generationSource && (
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full border ${
                        generationSource === "gemini"
                          ? "border-primary/40 text-primary"
                          : "border-yellow-400/40 text-yellow-400"
                      }`}
                    >
                      {generationSource === "gemini" ? "Gemini" : "Fallback"}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base font-medium leading-relaxed">
                  {oneLiner}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Pitch Structure{" "}
                  {generationSource && (
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full border ${
                        generationSource === "gemini"
                          ? "border-primary/40 text-primary"
                          : "border-yellow-400/40 text-yellow-400"
                      }`}
                    >
                      {generationSource === "gemini" ? "Gemini" : "Fallback"}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-1 text-sm marker:text-primary">
                  {structure.map((s, i) => (
                    <li key={i} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={savePitch} variant="hero" className="gap-2">
                <Save className="w-4 h-4" /> Save
              </Button>
              <Button onClick={rerecord} variant="ghost" className="gap-2">
                <RotateCcw className="w-4 h-4" /> Re-record
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-destructive/40">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard this pitch?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear the generated content and transcript from
                      the current editor.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={rerecord}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Create a New Pitch
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Press record and describe your startup idea naturally. We'll
          transcribe it and generate an optimized one-liner plus complete pitch
          deck structure.
        </p>
      </div>
      <div className="flex flex-col items-center gap-12 w-full">
        {["idle", "recording"].includes(phase) && renderControls()}
        {[
          "recorded",
          "transcribing",
          "review",
          "generating",
          "result",
        ].includes(phase) && <div className="w-full">{renderControls()}</div>}
        {phase === "idle" && (
          <div className="text-sm text-muted-foreground">
            First pitch will be free. Stay under 2 minutes for best results.
          </div>
        )}
      </div>
      <Dialog
        open={
          dialogOpen && ["recorded", "transcribing", "review"].includes(phase)
        }
        onOpenChange={setDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Pitch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transcript</label>
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={
                  phase === "transcribing"
                    ? "Transcribing..."
                    : "Your transcript"
                }
                className="min-h-[160px] resize-vertical"
                disabled={phase === "transcribing"}
              />
              {phase === "transcribing" && (
                <p className="text-xs text-muted-foreground">
                  Processing audio…
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={rerecord}
                disabled={phase === "transcribing"}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Re-record
              </Button>
              <Button
                variant="hero"
                onClick={generate}
                disabled={phase !== "review"}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" /> Generate Pitch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LoaderState: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center gap-6 py-20">
    <Loader2 className="w-10 h-10 animate-spin" />
    <p className="text-sm text-muted-foreground">{label}...</p>
  </div>
);

export default CreatePitch;
