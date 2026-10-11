const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

export async function generateOutreachDraft(lead) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL;

  if (!apiKey || !model) {
    throw new Error("Groq API configuration is missing");
  }

  const prompt = `
Write a concise, professional B2B sales outreach email.

Use only the company information provided below.
Do not invent facts, contact names, or business problems.
If information is missing, do not make assumptions.
Keep the email under 150 words and include a subject line
and a low-pressure call to action.

Company: ${lead.companyName}
Website: ${lead.website || "Not provided"}
Industry: ${lead.industry || "Not provided"}
Employees: ${lead.employeeCount ?? "Not provided"}
Support automation need:
${lead.supportAutomationNeed === true ? "Reported" :
  lead.supportAutomationNeed === false ? "Not reported" : "Unknown"}
Relevant contact identified:
${lead.hasRelevantContact === true ? "Yes" :
  lead.hasRelevantContact === false ? "No" : "Unknown"}
Qualification status:
${lead.qualification?.qualificationStatus || "Not assessed"}
`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You write factual, personalized B2B outreach emails.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 350,
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    // Log status only; do not expose provider details or secrets.
    console.error("Groq request failed with status:", response.status);
    throw new Error("Unable to generate outreach draft");
  }

  const data = await response.json();
  const draft = data.choices?.[0]?.message?.content?.trim();

  if (!draft) {
    throw new Error("Groq returned an empty draft");
  }

  return draft;
}