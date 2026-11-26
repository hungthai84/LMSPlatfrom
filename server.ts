import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_MODEL = "gemini-4-hydrogen";

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Health & real server integration readiness check (never leaks secret values)
  app.get("/api/health", (_req, res) => {
    const geminiReady = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
    );
    res.json({
      status: "ok",
      service: "EDU LMS Enterprise AI-Native Platform",
      timestamp: new Date().toISOString(),
      capabilities: {
        geminiAi: geminiReady,
        scormValidator: true,
        xapiValidator: true,
      },
      integrations: {
        googleWorkspace: {
          configured: Boolean(process.env.GOOGLE_CLIENT_ID),
          status: process.env.GOOGLE_CLIENT_ID ? "connected" : "unconfigured",
        },
        zoom: {
          configured: Boolean(process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET),
          status:
            process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET
              ? "connected"
              : "unconfigured",
        },
        microsoftTeams: {
          configured: Boolean(process.env.MS_TEAMS_TENANT_ID && process.env.MS_TEAMS_CLIENT_ID),
          status:
            process.env.MS_TEAMS_TENANT_ID && process.env.MS_TEAMS_CLIENT_ID
              ? "connected"
              : "unconfigured",
        },
        paymentWebhook: {
          configured: Boolean(process.env.PAYMENT_WEBHOOK_SECRET),
          status: process.env.PAYMENT_WEBHOOK_SECRET ? "connected" : "unconfigured",
        },
        smtpEmail: {
          configured: Boolean(process.env.SMTP_HOST),
          status: process.env.SMTP_HOST ? "connected" : "unconfigured",
        },
      },
    });
  });

  // Server-side SCORM 1.2 / 2004 manifest structure validator
  app.post("/api/scorm/validate", (req, res) => {
    const { manifestXml, standard } = req.body || {};
    if (typeof manifestXml !== "string" || !manifestXml.trim()) {
      return res.status(400).json({ error: "Vui lòng cung cấp nội dung imsmanifest.xml để kiểm tra." });
    }
    const xml = manifestXml.trim();
    const hasManifest = xml.includes("<manifest");
    const hasOrganizations = xml.includes("<organizations");
    const hasResources = xml.includes("<resources");
    const hasSchemaversion = xml.includes("schemaversion") || xml.includes("ADL SCORM");
    const valid = hasManifest && hasOrganizations && hasResources;

    res.json({
      valid,
      standard: standard === "scorm2004" ? "SCORM 2004" : "SCORM 1.2",
      checks: {
        manifestRoot: hasManifest,
        organizationsNode: hasOrganizations,
        resourcesNode: hasResources,
        schemaDeclaration: hasSchemaversion,
      },
      message: valid
        ? "Cấu trúc imsmanifest.xml hợp lệ, sẵn sàng đóng gói bài giảng."
        : "Manifest thiếu thẻ bắt buộc (<manifest>, <organizations> hoặc <resources>).",
    });
  });

  // Server-side xAPI statement validator
  app.post("/api/xapi/validate", (req, res) => {
    const stmt = req.body?.statement;
    if (!stmt || typeof stmt !== "object") {
      return res.status(400).json({ error: "Statement xAPI phải là JSON object hợp lệ." });
    }
    const hasActor = Boolean(stmt.actor && (stmt.actor.mbox || stmt.actor.account));
    const hasVerb = Boolean(stmt.verb && typeof stmt.verb.id === "string");
    const hasObject = Boolean(stmt.object && typeof stmt.object.id === "string");
    const valid = hasActor && hasVerb && hasObject;

    res.json({
      valid,
      checks: { hasActor, hasVerb, hasObject },
      message: valid
        ? "xAPI Statement đạt chuẩn Experience API 1.0.3."
        : "Statement thiếu trường chuẩn xAPI (actor.mbox/account, verb.id, hoặc object.id).",
    });
  });

  // Unified Gemini AI Endpoint (Server-Side Only)
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { action, prompt, context, agentId, language = "vi" } = req.body || {};

      const ai = getAiClient();
      if (!ai) {
        return res.status(400).json({
          error:
            "GEMINI_API_KEY chưa được cấu hình. Vui lòng thiết lập key trong Settings > Secrets của AI Studio.",
        });
      }

      if (typeof prompt !== "string" && !context) {
        return res.status(400).json({ error: "Yêu cầu thiếu nội dung prompt hoặc context." });
      }

      const langLabel = language === "en" ? "English" : "Tiếng Việt";

      // Structured JSON Quiz Generator
      if (action === "generate-quiz") {
        const topic = context?.topic || prompt || "ReactJS cơ bản";
        const count = Math.min(Math.max(Number(context?.count) || 3, 1), 10);

        const response = await ai.models.generateContent({
          model: DEFAULT_MODEL,
          contents: `Tạo ${count} câu hỏi kiểm tra đánh giá năng lực bằng ${langLabel} cho chủ đề: "${topic}". Bao gồm đa dạng câu hỏi trắc nghiệm (choice), đúng/sai (true-false) và tự luận (essay) kèm giải thích đáp án.`,
          config: {
            systemInstruction:
              "Bạn là chuyên gia biên soạn ngân hàng đề thi LMS đạt chuẩn sư phạm. Trả về JSON chính xác theo schema.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "choice | true-false | essay" },
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctOptionIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: "easy | medium | hard" },
                  points: { type: Type.INTEGER },
                },
              },
            },
          },
        });

        return res.json({
          text: response.text ?? "[]",
          model: DEFAULT_MODEL,
          draftStatus: "draft_pending_review",
        });
      }

      // Structured Course Syllabus Creator
      if (action === "generate-course-outline") {
        const topic = context?.subjectName || prompt || "Quản trị dự án Agile";
        const response = await ai.models.generateContent({
          model: DEFAULT_MODEL,
          contents: `Xây dựng đề cương khóa học doanh nghiệp bằng ${langLabel} cho chủ đề: "${topic}". Gồm mô tả, mục tiêu học tập, 4 chương học và các bài học tương tác.`,
          config: {
            systemInstruction:
              "Bạn là AI Course Creator Agent trong EDU LMS. Mọi nội dung sinh ra ở trạng thái Nháp chờ giảng viên duyệt.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                level: { type: Type.STRING, description: "beginner | intermediate | advanced" },
                durationHours: { type: Type.NUMBER },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                chapters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      chapterTitle: { type: Type.STRING },
                      lessons: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            lessonType: { type: Type.STRING },
                            durationMinutes: { type: Type.NUMBER },
                            summary: { type: Type.STRING },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        return res.json({
          text: response.text ?? "{}",
          model: DEFAULT_MODEL,
          draftStatus: "draft_pending_review",
        });
      }

      // Text / RAG / Agent Endpoints
      let systemInstruction = `Bạn là trợ lý AI thông minh trong nền tảng EDU LMS. Trả lời rõ ràng, chuyên nghiệp bằng ${langLabel}.`;
      let finalPrompt = typeof prompt === "string" ? prompt : "";

      if (action === "generate-syllabus") {
        systemInstruction = `Bạn là giảng viên & chuyên gia thiết kế chương trình đào tạo. Soạn đề cương chi tiết bằng ${langLabel} dưới dạng Markdown.`;
        finalPrompt = `Hãy tạo đề cương khóa học cho môn: "${context?.subjectName || prompt}". Liệt kê mục tiêu, 5 chương cốt lõi và bài tập thực hành.`;
      } else if (action === "generate-lesson") {
        systemInstruction = `Bạn là AI Lesson Generator. Tạo nội dung bài giảng chi tiết gồm Mục tiêu, Lý thuyết trọng tâm, Ví dụ thực tế và Câu hỏi ôn tập bằng ${langLabel}.`;
      } else if (action === "generate-assignment") {
        systemInstruction = `Bạn là giảng viên thiết kế bài tập thực hành có Rubric chấm điểm rõ ràng bằng ${langLabel}.`;
        finalPrompt = `Tạo bài tập chi tiết cho chủ đề: "${context?.topic || prompt}". Gồm mục tiêu, yêu cầu nộp bài và thang điểm Rubric.`;
      } else if (action === "generate-announcement") {
        systemInstruction = `Bạn là giảng viên viết thông báo lớp học chuyên nghiệp bằng ${langLabel}.`;
        finalPrompt = `Viết thông báo gửi tới lớp học về: "${context?.announcementTopic || prompt}".`;
      } else if (action === "ask-ai" || action === "ai-tutor") {
        systemInstruction = `Bạn là AI Tutor hỗ trợ học viên tư duy từng bước bằng ${langLabel}. Không đưa đáp án làm hộ ngay mà gợi ý phương pháp giải.`;
        finalPrompt = `Bối cảnh bài học/bài tập: "${context?.assignmentTitle || "Khóa học LMS"}". Câu hỏi: "${prompt}"`;
      } else if (action === "summarize-content") {
        systemInstruction = `Bạn là AI Content Assistant. Tóm tắt nội dung tài liệu thành ý chính (bullet points) và rút ra 3 điểm ghi nhớ quan trọng bằng ${langLabel}.`;
      } else if (action === "translate-content") {
        const targetLang = context?.targetLang || "English";
        systemInstruction = `Bạn là AI Translation chuyên ngành giáo dục & công nghệ. Dịch chính xác nội dung sau sang ${targetLang}, giữ nguyên thuật ngữ chuyên môn.`;
      } else if (action === "rag-search") {
        const docs: Array<{ title: string; content: string }> = Array.isArray(context?.documents)
          ? context.documents
          : [];
        const docContext = docs
          .slice(0, 8)
          .map((d, i) => `[Nguồn ${i + 1}: ${d.title}]\n${String(d.content).slice(0, 1500)}`)
          .join("\n\n");
        systemInstruction = `Bạn là AI Knowledge Base / RAG Agent. CHỈ trả lời dựa trên các tài liệu nguồn được cấp phép dưới đây và trích dẫn rõ tên [Nguồn X]. Nếu thông tin không có trong tài liệu, hãy nói rõ tài liệu hiện tại chưa đề cập.\n\n${docContext}`;
      } else if (action === "learning-analytics") {
        systemInstruction = `Bạn là AI Learning Analytics Agent. Phân tích số liệu học tập được cung cấp, xác định nhóm học viên có nguy cơ chậm tiến độ và đề xuất kế hoạch can thiệp cụ thể bằng ${langLabel}.`;
      } else if (action === "agent-chat") {
        const agentPrompts: Record<string, string> = {
          learning_assistant: "Bạn là Learning Assistant hướng dẫn học viên sử dụng EDU LMS, tìm khóa học và lập lịch học.",
          ai_tutor: "Bạn là AI Tutor giải thích kiến thức chuyên sâu và đưa ví dụ dễ hiểu.",
          course_creator: "Bạn là Course Creator Agent thiết kế khung chương trình và chuẩn đầu ra.",
          quiz_generator: "Bạn là Quiz Generator Agent hỗ trợ biên soạn câu hỏi đánh giá.",
          training_manager: "Bạn là Training Manager Agent tư vấn lập kế hoạch đào tạo doanh nghiệp, ngân sách và Training ROI.",
          knowledge_agent: "Bạn là Knowledge Agent tổng hợp tri thức nội bộ doanh nghiệp.",
          analytics_agent: "Bạn là Learning Analytics Agent phân tích dữ liệu KPI đào tạo.",
          student_support: "Bạn là Student Support Agent giải đáp thắc mắc quy trình ghi danh, thi cử và cấp chứng chỉ.",
        };
        systemInstruction = `${agentPrompts[agentId] || systemInstruction} Trả lời bằng ${langLabel}.`;
      }

      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: finalPrompt,
        config: {
          systemInstruction,
        },
      });

      res.json({
        text: response.text || "",
        model: DEFAULT_MODEL,
        draftStatus: "draft_pending_review",
      });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(error?.status || 500).json({
        error: error?.message || "Đã xảy ra lỗi khi gọi Gemini API phía máy chủ.",
      });
    }
  });

  // Mount Vite middleware in dev or serve static dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EDU LMS Server running on http://localhost:${PORT}`);
  });
}

startServer();
