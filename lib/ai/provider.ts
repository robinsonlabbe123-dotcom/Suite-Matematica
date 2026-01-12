export type ConversationMessage = { direction: "inbound" | "outbound"; content: string };

export type AnalysisResult = {
  summary: string;
  intent: string;
  budget_estimate: string;
  urgency: string;
  objections: string[];
  next_steps: string[];
  suggested_reply?: string;
};

export interface AIProvider {
  analyzeConversation(messages: ConversationMessage[]): Promise<AnalysisResult>;
}

function extractSentiment(text: string) {
  if (text.toLowerCase().includes("urgent")) return "high";
  if (text.toLowerCase().includes("mañana")) return "high";
  return "medium";
}

function estimateBudget(text: string) {
  const match = text.match(/\$([0-9]+)/);
  return match ? `$${match[1]}` : "tbd";
}

export class DummyProvider implements AIProvider {
  async analyzeConversation(messages: ConversationMessage[]): Promise<AnalysisResult> {
    const combined = messages.map((m) => m.content).join(" ");
    return {
      summary: combined.slice(0, 180) || "Sin mensajes",
      intent: combined.toLowerCase().includes("cotizar") ? "quote" : "unknown",
      budget_estimate: estimateBudget(combined),
      urgency: extractSentiment(combined),
      objections: combined.toLowerCase().includes("caro") ? ["precio"] : [],
      next_steps: ["Responder y agendar llamada"],
      suggested_reply: "¡Gracias por tu interés! ¿Podemos agendar una llamada esta semana?",
    };
  }
}

export class OpenAIProvider implements AIProvider {
  // Scaffold para conectar OpenAI más adelante sin romper la interfaz
  constructor(private apiKey = process.env.OPENAI_API_KEY) {}

  async analyzeConversation(messages: ConversationMessage[]): Promise<AnalysisResult> {
    if (!this.apiKey) {
      const dummy = new DummyProvider();
      return dummy.analyzeConversation(messages);
    }

    const joined = messages.map((m) => m.content).join(" ");
    return {
      summary: `AI summary placeholder: ${joined.slice(0, 120)}`,
      intent: "analysis_pending",
      budget_estimate: "tbd",
      urgency: "pending",
      objections: [],
      next_steps: ["pending"],
      suggested_reply: "Gracias por tu mensaje; pronto te responderemos.",
    };
  }
}

export function getAIProvider(): AIProvider {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }
  return new DummyProvider();
}
