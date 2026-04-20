import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

app.post("/run", async (req, res) => {
  const { language, code } = req.body;
  const normalizedLanguage = String(language || "").toLowerCase();
  const resolvedLanguage = normalizedLanguage === "py" || normalizedLanguage === "python3"
    ? "python"
    : normalizedLanguage;
  const requestId = Math.random().toString(36).substring(7);

  try {
    if (resolvedLanguage === "javascript") {
      const filePath = path.join(TEMP_DIR, `code_${requestId}.js`);
      fs.writeFileSync(filePath, code);

      exec(`node ${filePath}`, { timeout: 5000 }, (err, stdout, stderr) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.json({
          stdout: stdout || "",
          stderr: stderr || "",
          exitCode: err?.code ?? 0,
          timedOut: Boolean(err?.signal === "SIGTERM"),
        });
      });
    } 
    else if (resolvedLanguage === "java") {
      const folderPath = path.join(TEMP_DIR, requestId);
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
      const filePath = path.join(folderPath, "Main.java");
      fs.writeFileSync(filePath, code);

      exec(`javac ${filePath} && java -cp ${folderPath} Main`, { timeout: 5000 }, (err, stdout, stderr) => {
        fs.rmSync(folderPath, { recursive: true, force: true });
        res.json({
          stdout: stdout || "",
          stderr: stderr || "",
          exitCode: err?.code ?? 0,
          timedOut: Boolean(err?.signal === "SIGTERM"),
        });
      });
    }
    else if (resolvedLanguage === "python") {
      const filePath = path.join(TEMP_DIR, `code_${requestId}.py`);
      fs.writeFileSync(filePath, code);

      exec(`python ${filePath}`, { timeout: 5000 }, (err, stdout, stderr) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.json({
          stdout: stdout || "",
          stderr: stderr || "",
          exitCode: err?.code ?? 0,
          timedOut: Boolean(err?.signal === "SIGTERM"),
        });
      });
    } else {
      res.status(400).json({ message: `Unsupported language: ${language}. Supported: java, python` });
    }
  } catch (error) {
    console.error("Runtime execution failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚔️ Battle Engine running on port ${PORT}`));