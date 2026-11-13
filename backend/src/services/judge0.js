const sleep = ms => new Promise(r => setTimeout(r, ms));
const languageIds = { javascript: 63, python: 71, cpp: 54, java: 62 };
export async function executeCode({ sourceCode, language, stdin = "" }) {
  const base = process.env.JUDGE0_URL;
  const key = process.env.JUDGE0_API_KEY;
  if (!base || !key) throw new Error("Judge0 is not configured. Add JUDGE0_URL and JUDGE0_API_KEY.");
  const headers = { "content-type": "application/json", "X-RapidAPI-Key": key, "X-RapidAPI-Host": process.env.JUDGE0_HOST };
  const lang = languageIds[language];
  if (!lang) throw new Error("Unsupported language");
  const create = await fetch(`${base}/submissions?base64_encoded=false&wait=false`, {
    method: "POST", headers, body: JSON.stringify({ source_code: sourceCode, language_id: lang, stdin })
  });
  if (!create.ok) throw new Error(`Judge0 request failed: ${create.status}`);
  const { token } = await create.json();
  for (let i = 0; i < 20; i++) {
    await sleep(900);
    const poll = await fetch(`${base}/submissions/${token}?base64_encoded=false`, { headers });
    const result = await poll.json();
    if (result.status?.id > 2) return {
      status: result.status.description, stdout: result.stdout || "", stderr: result.stderr || "",
      compileOutput: result.compile_output || "", time: result.time, memory: result.memory
    };
  }
  return { status: "Processing", stdout: "", stderr: "Execution timed out while waiting for Judge0." };
}
