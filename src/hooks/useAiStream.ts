import React from "react";

export interface IAiStreamResponseCptCode {
  "code": string,
  "description": string,
  "confidence": number,
  "rationale": string,
  "category": string
}
export interface IAiStreamResponseIcd10Code {
  "code": string,
  "description": string,
  "confidence": number,
  "rationale": string,
  "category": string
}

export interface IToolCallRecord {
  tool: string,
  args: Record<string, unknown>,
  result: Record<string, unknown>,
}

export interface IAiToolResponse {
  text: string,
  prompt: string,
  elapsed_ms: number,
  tool_calls: IToolCallRecord[],
  model: string,
  device: string,
}

export interface IAiStreamResponse {
  "text": string,
  "full_text"?: string,
  "prompt": string,
  "elapsed_ms": number,
  "queue_ms": number,
  "generate_ms": number,
  "policy_ms": number,
  "enrich_ms": number,
  "model": string,
  "device": string,
}

const useAiStream = (user_id: string, session_id: string, max_tokens: number = 200) => {
  const [response, setResponse] = React.useState<string>("");
  const [fullResponse, setFullResponse] = React.useState<IAiStreamResponse | null>(null);
  const [toolResponse, setToolResponse] = React.useState<IAiToolResponse | null>(null);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const stopStream = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  };

  const startStream = async (prompt: string) => {
    // Abort any in-flight request without touching isStreaming state.
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsStreaming(true);
    setResponse("");
    setFullResponse(null);
    setToolResponse(null);

    try {
      const res = await fetch("/api/v1/ai/generate/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id, session_id, max_tokens }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Stream request failed with status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLines = event
            .split("\n")
            .filter((line) => line.startsWith("data:"));

          if (!dataLines.length) continue;

          const payload = dataLines
            .map((line) => line.replace(/^data:\s?/, ""))
            .join("\n");

          try {
            const data = JSON.parse(payload);
            if (data.error) {
              // Suppress known non-fatal server-side PromptLogger argument errors
              // which are server logging bugs and do not affect streamed content.
              const msg = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
              if (msg.includes("PromptLogger.log") && msg.includes("cpt_codes") && msg.includes("icd10_codes")) {
                console.warn("Stream event: server prompt-logger write failed (non-fatal)");
              } else {
                console.error("Stream event error:", data.error);
              }
              continue;
            }

            const isDone = data.done === true || data.done === "true";
            if (isDone) {
              // Final event includes post-processed full text; replace streamed draft.
              const finalText =
                (typeof data.text === "string" && data.text) ||
                (typeof data.full_text === "string" && data.full_text) ||
                "";
              if (finalText) {
                setResponse(finalText);
              }
              setIsStreaming(false);
              setFullResponse(data);
              break;
            }

            if (typeof data.text === "string") {
              setResponse((prev) => prev + data.text);
            }
          } catch (err) {
            console.error("Failed to parse SSE payload:", payload, err);
          }
        }
      }

      const tail = decoder.decode();
      if (tail) {
        buffer += tail;
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Stream error:", err);
    } finally {
      setIsStreaming(false);
    }
  };

  /**
   * Send the prompt to the tool-augmented endpoint.
   * The model will automatically call tools (drug lookup, ICD-10, interactions,
   * lab ranges) as needed and return a single enriched response.
   */
  const startToolCall = async (prompt: string) => {
    setIsStreaming(true);
    setResponse("");
    setFullResponse(null);
    setToolResponse(null);

    try {
      const res = await fetch("/api/v1/ai/generate/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id, session_id, max_tokens }),
      });

      if (!res.ok) {
        throw new Error(`Tool request failed with status ${res.status}`);
      }

      const data: IAiToolResponse = await res.json();
      setResponse(data.text);
      setToolResponse(data);
    } catch (err) {
      console.error("Tool call error:", err);
    } finally {
      setIsStreaming(false);
    }
  };

  return { response, isStreaming, startStream, stopStream, startToolCall, fullResponse, toolResponse };
}

export default useAiStream