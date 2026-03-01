import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { prompt, currentConfig } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: `You are a 3D Simulation Engineer. Build interactive Three.js labs.
      MANDATORY: Use /lib/simlab-core.js (SimLab object) and /lib/simlab-core.css.
      SDK API: SimLab.initScene({cameraPos}), SimLab.handleMessages(onUpdate, onInit), SimLab.sendTelemetry(data).
      NO UI HTML. Everything must be in the 3D canvas.
      Return ONLY JSON: { htmlCode: string, controls: [{id, name, min, max, defaultValue, step, unit}] }.`
        });

        const body = currentConfig
            ? `MODIFICATION: ${prompt}\nCONTEXT: ${JSON.stringify(currentConfig)}`
            : prompt;

        const result = await model.generateContent(body);
        const responseText = result.response.text().replace(/```json|```/g, "").trim();

        return NextResponse.json({ config: JSON.parse(responseText) });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
