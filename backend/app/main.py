from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="Proxxima Telecom API", 
    description="Sistema de Gerenciamento de Rede (OLTs e CTOs)"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite que o React (ou qualquer outro) acesse a API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. MODELOS DE DADOS (Como a informação é validada)
# ==========================================
class OLT(BaseModel):
    id: int
    nome: str
    fabricante: str
    ip: str
    status: str

class CTO(BaseModel):
    id: int
    olt_id: int
    nome: str
    porta_pon: str
    capacidade: int
    ocupacao: int

# ==========================================
# 2. BANCO DE DADOS SIMULADO (Mock)
# ==========================================
db_olts = [
    {"id": 1, "nome": "OLT-CG-CENTRO", "fabricante": "Huawei", "ip": "10.0.1.10", "status": "Online"},
    {"id": 2, "nome": "OLT-CG-BODOCONGO", "fabricante": "ZTE", "ip": "10.0.1.11", "status": "Alarme LOS"},
]

db_ctos = [
    {"id": 101, "olt_id": 1, "nome": "CTO-CENTRO-01", "porta_pon": "0/1/1", "capacidade": 16, "ocupacao": 14},
    {"id": 102, "olt_id": 1, "nome": "CTO-CENTRO-02", "porta_pon": "0/1/1", "capacidade": 16, "ocupacao": 16}, # CTO Lotada
    {"id": 103, "olt_id": 2, "nome": "CTO-BOD-01", "porta_pon": "0/2/1", "capacidade": 8, "ocupacao": 2},
]

# ==========================================
# 3. ROTAS DA API (Endpoints)
# ==========================================

@app.get("/", tags=["Geral"])
def status_sistema():
    return {"status": "ok", "mensagem": "API da Proxxima operando normalmente."}

@app.get("/api/olts", response_model=List[OLT], tags=["OLTs"])
def listar_olts():
    """Retorna a lista de todas as OLTs cadastradas na rede."""
    return db_olts

@app.get("/api/olts/{olt_id}", response_model=OLT, tags=["OLTs"])
def buscar_olt(olt_id: int):
    """Busca os detalhes de uma OLT específica pelo seu ID."""
    for olt in db_olts:
        if olt["id"] == olt_id:
            return olt
    raise HTTPException(status_code=404, detail="OLT não encontrada na base de dados.")

@app.get("/api/olts/{olt_id}/ctos", response_model=List[CTO], tags=["CTOs"])
def listar_ctos_da_olt(olt_id: int):
    """Retorna todas as CTOs conectadas a uma OLT específica."""
    ctos_filtradas = [cto for cto in db_ctos if cto["olt_id"] == olt_id]
    if not ctos_filtradas:
         raise HTTPException(status_code=404, detail="Nenhuma CTO encontrada para esta OLT.")
    return ctos_filtradas