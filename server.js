import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/generate", async (req, res) => {
  const { industry, purpose, tone } = req.body;

  const prompt = `
너는 B2B 영업 전문가야.

고객사 산업: ${industry}
미팅 목적: ${purpose}
대화 분위기: ${tone}

아래 형식으로 만들어줘:
1. 오프닝 멘트
2. 스몰토크 3개
3. 본론 전환 멘트
4. 피해야 할 주제

조건:
- 자연스럽고 짧게
- 실제 말하는 느낌
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "서버 오류" });
  }
});

app.listen(PORT, () => {
  console.log("서버 실행중");
});