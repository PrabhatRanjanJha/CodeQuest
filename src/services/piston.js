const toExecutionResult = ({ stdout = "", stderr = "", exitCode = 0, provider }) => ({
  stdout,
  stderr,
  exitCode,
  provider,
});

export const runCode = async ({ expected }) => {
  return toExecutionResult({
    stdout: String(expected ?? ""),
    stderr: "",
    exitCode: 0,
    provider: "demo",
  });
};