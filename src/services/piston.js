const BACKEND_RUN_URL = import.meta.env.VITE_RUNNER_URL || "http://localhost:5000/run";
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const toExecutionResult = ({ stdout = "", stderr = "", exitCode = 0, provider }) => ({
  stdout,
  stderr,
  exitCode,
  provider,
});

const normalizeLanguage = (language) => {
  const value = String(language || "").toLowerCase();
  if (value === "py" || value === "python3") return "python";
  return value;
};

async function runOnBackend({ language, code }) {
  const normalizedLanguage = normalizeLanguage(language);
  const response = await fetch(BACKEND_RUN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: normalizedLanguage, code }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Local runner failed (${response.status}): ${text || "no details"}`);
  }

  const data = await response.json();
  return toExecutionResult({
    stdout: data.stdout,
    stderr: data.stderr,
    exitCode: data.exitCode,
    provider: "local",
  });
}

async function runOnPiston({ language, code }) {
  const normalizedLanguage = normalizeLanguage(language);
  const response = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: normalizedLanguage,
      version: "*",
      files: [{ content: code }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Piston failed (${response.status}): ${text || "no details"}`);
  }

  const data = await response.json();
  if (!data.run) {
    throw new Error("Piston returned no run payload.");
  }

  return toExecutionResult({
    stdout: data.run.stdout,
    stderr: data.run.stderr,
    exitCode: data.run.code,
    provider: "piston",
  });
}

export const runCode = async ({ language, code }) => {
  try {
    return await runOnBackend({ language, code });
  } catch (localError) {
    try {
      return await runOnPiston({ language, code });
    } catch (pistonError) {
      console.error("Code runner failed (local + fallback):", { localError, pistonError });
      throw localError;
    }
  }
};