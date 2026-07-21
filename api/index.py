from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
import os

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

import sys

# 1. CLIENTE GLOBAL DE GROQ (Optimización de Warm Starts)
# Instanciamos el cliente fuera del endpoint para que las Serverless Functions 
# lo mantengan en memoria entre peticiones.
api_key = os.environ.get("GROQ_API_KEY")

if not api_key:
    # Manejo de error global para que no falle silenciosamente ni rompa el build de forma confusa
    print("WARNING: GROQ_API_KEY no detectada en el entorno. La IA no funcionará.", file=sys.stderr)
    client_instance = None
else:
    try:
        client_instance = Groq(api_key=api_key)
    except Exception as e:
        print(f"ERROR: Fallo al inicializar Groq: {e}", file=sys.stderr)
        client_instance = None

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

from typing import List

class MessageItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[MessageItem]

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Agent Backend Online"}

@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    # 3. VERIFICACIÓN LIGERA EN TIEMPO DE EJECUCIÓN
    if not client_instance:
        raise HTTPException(status_code=500, detail="El cliente de IA no está configurado (falta GROQ_API_KEY).")
    
    try:
        formatted_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Tomamos solo los últimos 6 mensajes para mantener el contexto rápido
        for msg in request.messages[-6:]:
            # Asegurar que el rol sea válido para la API de Groq
            role = "assistant" if msg.role == "assistant" else "user"
            formatted_messages.append({"role": role, "content": msg.content})

        chat_completion = client_instance.chat.completions.create(
            messages=formatted_messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=300,
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
