import { Router } from "express";
import { createGemini } from "./geminiClient.ts";

interface ModelResponse {
  one_liner?: string;
  company?: string;
  slides?: string[];
}

const router = Router();

// Helper to aggressively extract a JSON object from a possibly wrapped LLM answer
function extractJson(raw: string): ModelResponse | null {
  const cleaned = raw
    .replace(/```(?:json)?/gi, "```") // unify fenced code tokens
    .replace(/```/g, "")
    .trim();
  // Quick win: direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    /* ignore */
  }
  // Fallback: first {...} block
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      /* ignore */
    }
  }
  return null;
}

router.post("/generate", async (req, res) => {
  const provider = "gemini";
  try {
    const { transcript } = req.body as { transcript?: string };
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: "Transcript required" });
    }

    const prompt = `You are a precise startup pitch assistant. Use Guy Kawasaki's classic 10-slide pitch deck ordering.\n\nReturn STRICT JSON ONLY (no markdown, backticks, comments) with shape:\n{\n  "one_liner":"<Company Name> is a <product description> for <ideal customer> to <desired outcome> with <special sauce>.",\n  "company":"<Company Name>",\n  "slides":["Title: <Company Name + Tagline concise positioning>","Problem / Opportunity: <pain + consequence (8-16 words)>","Value Proposition: <clear differentiated benefit (8-16 words)>","Underlying Magic: <core tech / insight (8-16 words)>","Business Model: <how money is made (8-14 words)>","Go-To-Market: <primary channel + tactic (8-14 words)>","Competitive Analysis: <key differentiator vs status quo (8-14 words)>","Management Team: <credibility / domain edge (8-14 words)>","Financials / Metrics: <traction or realistic proxy (8-14 words)>","Current Status & Ask: <milestone + funding/use (8-16 words)>"]\n}\n\nONE-LINER RULES:\n- Must follow pattern exactly: <Company Name> is a <product description> for <ideal customer> to <desired outcome> with <special sauce>.\n- Max 30 words. Engaging, concrete, no filler like "platform that" or "solution that".\n- Use vivid verb ("accelerates", "unlocks", "turns", "predicts", "eliminates").\n\nSLIDE DETAIL RULES:\n- Each slide line is a single string: label, colon, space, then succinct descriptive phrase (no bullets).\n- Keep each description informative yet tight; avoid jargon fluff.\n- Never exceed 120 characters per slide string.\n\nGENERAL RULES:\n- Do NOT fabricate traction metrics unless clearly implied; if none, use a neutral phrasing (e.g., "Early pilot validation").\n- Always return exactly 10 slides.\n\nTranscript:\n"""${transcript.trim()}"""`;

    const model = createGemini();
    const start = Date.now();
    const result = await model.generateContent([{ text: prompt }]);
    const latency = Date.now() - start;
    const raw = (result.response?.text?.() ?? "").trim();
    console.log("[gemini] latency", latency, "ms");
    if (!raw) {
      return res.status(500).json({ error: "Empty model response", provider });
    }

    const parsed = extractJson(raw);
    if (!parsed) {
      return res
        .status(500)
        .json({ error: "Failed to parse model output", raw, provider });
    }

    let { one_liner, slides } = parsed as ModelResponse;
    // Accept company field but not required in response body (one_liner contains name)
    if (!one_liner || !slides) {
      return res
        .status(500)
        .json({ error: "Model output missing fields", raw: parsed, provider });
    }

    // Normalize slides: ensure array of strings length 10
    if (!Array.isArray(slides)) {
      if (typeof slides === "string") {
        // split on newlines or numbered list
        slides = slides
          .split(/\n+/)
          .map((s) => s.replace(/^\s*\d+[.)-]?\s*/, "").trim())
          .filter(Boolean);
      } else {
        return res
          .status(500)
          .json({ error: "Slides not an array", raw: parsed, provider });
      }
    }
    slides = (slides as string[]).map((s) => s.trim()).filter(Boolean);
    if (slides.length !== 10) {
      // If we got more, slice; if fewer, pad with canonical names
      const canonical = [
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
      slides = [
        ...slides.slice(0, 10),
        ...canonical.slice(slides.length),
      ].slice(0, 10);
    }

    // Trim one-liner whitespace
    one_liner = one_liner.replace(/\s+/g, " ").trim();
    if (one_liner.split(" ").length > 28) {
      // Basic length enforcement: truncate from the end
      one_liner = one_liner.split(" ").slice(0, 28).join(" ");
    }

    // Light refinement: remove trailing period from slide titles & enforce length
    slides = (slides as string[]).map((title) => {
      let t = title.replace(/\s+/g, " ").trim();
      if (t.endsWith(".")) t = t.slice(0, -1);
      if (t.length > 90) t = t.slice(0, 90).replace(/[,:;\-\s]+$/, "");
      return t;
    });

    // One-liner cleanup
    if (one_liner.endsWith(".")) one_liner = one_liner.trim();
    // Remove weak boilerplate patterns
    one_liner = one_liner
      .replace(/\b(a|the) (platform|solution) that /gi, "")
      .replace(/\bplatform that /gi, "")
      .replace(/\bsolution that /gi, "")
      .replace(/\ballows users? to /gi, "helps ")
      .replace(/\s+/g, " ") // normalize
      .trim();
    if (one_liner.length && !/[.!?]$/.test(one_liner)) one_liner += ".";

    return res.json({ one_liner, slides, provider });
  } catch (e) {
    console.error("[generate.error]", e);
    const msg = e instanceof Error ? e.message : "Server error";
    return res.status(500).json({ error: msg, provider: "gemini" });
  }
});

export default router;
