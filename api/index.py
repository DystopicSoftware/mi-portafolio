from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
import os

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

class ChatRequest(BaseModel):
    message: str

def get_groq_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("Critical Error: GROQ_API_KEY no detectada en el entorno.")
    return Groq(api_key=api_key)

# Leer el archivo de texto una sola vez al arrancar para ahorrar recursos
# Usamos os.path para que Vercel encuentre la ruta correcta en producción
current_dir = os.path.dirname(os.path.realpath(__file__))
rules_path = os.path.join(current_dir, "reglas_ventas.txt")

with open(rules_path, "r", encoding="utf-8") as file:
    SYSTEM_PROMPT = file.read()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Agent Backend Online"}

@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    try:
        client = get_groq_client()
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT # <--- Aquí inyectamos el archivo de texto
                },
                {
                    "role": "user",
                    "content": request.message,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=300,
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
