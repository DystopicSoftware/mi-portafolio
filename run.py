import uvicorn
from dotenv import load_dotenv

if __name__ == "__main__":
    # Cargar variables de entorno explícitamente antes de arrancar
    load_dotenv(".env.local")
    
    # Lanzar el servidor programáticamente
    uvicorn.run(
        "api.index:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=False
    )
