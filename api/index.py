from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
import os

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

# 1. INICIALIZACIÓN GLOBAL (Cold Start Optimization)
# Vercel mantendrá esta instancia viva en memoria entre peticiones (Warm Starts).
api_key = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=api_key) if api_key else None

# 2. CACHÉ DEL PROMPT DEL SISTEMA
# Esto ya lo estabas haciendo bien, lo mantenemos global.
current_dir = os.path.dirname(os.path.realpath(__file__))
rules_path = os.path.join(current_dir, "reglas_ventas.txt")
try:
    with open(rules_path, "r", encoding="utf-8") as file:
        SYSTEM_PROMPT = file.read()
except FileNotFoundError:
    SYSTEM_PROMPT = "You are a helpful assistant."
    print("WARNING: reglas_ventas.txt no encontrado.")

class ChatRequest(BaseModel):
    message: str

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Agent Backend Online"}

@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    # 3. VERIFICACIÓN LIGERA EN TIEMPO DE EJECUCIÓN
    if not groq_client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY no detectada en el entorno Serverless.")
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
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
