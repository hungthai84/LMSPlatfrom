import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for Gemini AI assistance
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { action, prompt, context } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ 
          error: "GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm key trong bảng điều khiển Secrets của AI Studio." 
        });
      }

      let systemInstruction = "Bạn là trợ lý giảng dạy AI hữu ích, lịch sự, sử dụng tiếng Việt chuẩn xác.";
      let finalPrompt = prompt;

      if (action === "generate-syllabus") {
        systemInstruction = "Bạn là một giảng viên chuyên nghiệp. Hãy soạn thảo một đề cương môn học chi tiết và hấp dẫn bằng Tiếng Việt dưới định dạng markdown.";
        finalPrompt = `Hãy tạo đề cương khóa học cho môn học: "${context.subjectName}". Mô tả ngắn gọn môn học và liệt kê 5 bài học/chương cốt lõi kèm theo bài tập đề xuất cho mỗi chương.`;
      } else if (action === "generate-assignment") {
        systemInstruction = "Bạn là giáo viên muốn giao bài tập chất lượng cho học sinh. Hãy viết đề bài chi tiết bằng Tiếng Việt dưới dạng markdown.";
        finalPrompt = `Tạo một bài tập chi tiết cho chủ đề: "${context.topic}". Hãy đưa ra mục tiêu, các bước thực hiện, tiêu chí đánh giá và một số câu hỏi gợi ý để học sinh tư duy.`;
      } else if (action === "generate-quiz") {
        systemInstruction = "Bạn là giáo viên biên soạn câu hỏi trắc nghiệm chất lượng cao. Hãy tạo 3 câu hỏi liên quan đến chủ đề được yêu cầu bằng Tiếng Việt dưới định dạng JSON.";
        finalPrompt = `Tạo 3 câu hỏi cho chủ đề: "${context.topic}".
Trả về một mảng JSON duy nhất chứa 3 đối tượng câu hỏi với cấu trúc chính xác như sau:
[
  {
    "type": "choice",
    "questionText": "Nội dung câu hỏi trắc nghiệm?",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correctOptionIndex": 1,
    "points": 3
  },
  {
    "type": "true-false",
    "questionText": "Nội dung câu hỏi Đúng/Sai?",
    "options": ["Đúng", "Sai"],
    "correctOptionIndex": 0,
    "points": 3
  },
  {
    "type": "essay",
    "questionText": "Nội dung câu hỏi tự luận ngắn?",
    "options": [],
    "correctOptionIndex": 0,
    "points": 4
  }
]`;
      } else if (action === "generate-announcement") {
        systemInstruction = "Bạn là giáo viên viết thông báo cho cả lớp học trên Google Classroom.";
        finalPrompt = `Viết một thông báo gửi tới lớp học về chủ đề: "${context.announcementTopic}". Giọng văn thân thiện, rõ ràng, thúc đẩy tinh thần học tập.`;
      } else if (action === "ask-ai") {
        systemInstruction = "Bạn là trợ lý học tập AI thông minh, hỗ trợ giải đáp các câu hỏi học thuật rõ ràng, chi tiết, dễ hiểu bằng Tiếng Việt.";
        finalPrompt = `Học sinh hỏi về bài tập/nội dung: "${context.assignmentTitle}". Câu hỏi của học sinh: "${prompt}". Hãy giải thích chi tiết và đưa ra hướng dẫn từng bước để làm bài. Tránh đưa đáp án trực tiếp mà hãy gợi ý tư duy.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: finalPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi kết nối với AI." });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
