import { LanguageCode } from "../types/lms";

export type GeminiAction =
  | "generate-quiz"
  | "generate-course-outline"
  | "generate-syllabus"
  | "generate-lesson"
  | "generate-assignment"
  | "generate-announcement"
  | "ask-ai"
  | "ai-tutor"
  | "summarize-content"
  | "translate-content"
  | "rag-search"
  | "learning-analytics"
  | "agent-chat";

export interface GeminiRequest {
  action: GeminiAction;
  prompt: string;
  context?: Record<string, unknown>;
  agentId?: string;
  language?: LanguageCode;
}

export interface GeminiResponse {
  text: string;
  model: string;
  draftStatus?: string;
}

export interface HealthIntegrationInfo {
  configured: boolean;
  status: "connected" | "unconfigured";
}

export interface ServerHealthResponse {
  status: string;
  service: string;
  timestamp: string;
  capabilities: {
    geminiAi: boolean;
    scormValidator: boolean;
    xapiValidator: boolean;
  };
  integrations: {
    googleWorkspace: HealthIntegrationInfo;
    zoom: HealthIntegrationInfo;
    microsoftTeams: HealthIntegrationInfo;
    paymentWebhook: HealthIntegrationInfo;
    smtpEmail: HealthIntegrationInfo;
  };
}

export interface ScormValidationResponse {
  valid: boolean;
  standard: string;
  checks: {
    manifestRoot: boolean;
    organizationsNode: boolean;
    resourcesNode: boolean;
    schemaDeclaration: boolean;
  };
  message: string;
}

export interface XapiValidationResponse {
  valid: boolean;
  checks: {
    hasActor: boolean;
    hasVerb: boolean;
    hasObject: boolean;
  };
  message: string;
}

export async function callGeminiAi(payload: GeminiRequest): Promise<GeminiResponse> {
  const res = await fetch("/api/gemini/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Lỗi máy chủ AI (${res.status})`);
  }
  return data as GeminiResponse;
}

export async function fetchServerHealth(): Promise<ServerHealthResponse> {
  const res = await fetch("/api/health");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Không thể kết nối /api/health");
  }
  return data as ServerHealthResponse;
}

export async function validateScormManifest(
  manifestXml: string,
  standard: "scorm12" | "scorm2004" = "scorm12"
): Promise<ScormValidationResponse> {
  const res = await fetch("/api/scorm/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manifestXml, standard }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Lỗi kiểm tra SCORM manifest");
  }
  return data as ScormValidationResponse;
}

export async function validateXapiStatement(statement: Record<string, unknown>): Promise<XapiValidationResponse> {
  const res = await fetch("/api/xapi/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statement }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Lỗi kiểm tra xAPI statement");
  }
  return data as XapiValidationResponse;
}
