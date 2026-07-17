from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
import os

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

# Inicializa el cliente. Groq buscará automáticamente la variable de entorno GROQ_API_KEY
client = Groq()

class ChatRequest(BaseModel):
    message: str

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Agent Backend Online"}

@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Eres la IA asistente de Juan Villada, Ingeniero Electrónico y Desarrollador Fullstack. Responde preguntas sobre su portafolio de forma concisa, técnica y futurista. Tus respuestas deben ser cortas."
                },
                {
                    "role": "user",
                    "content": request.message,
                }
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=300,
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
