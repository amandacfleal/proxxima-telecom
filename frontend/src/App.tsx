import { useState } from 'react';
import './App.css';

function App() {
  const [exibir, setExibir] = useState(false);
  const [portaAtiva, setPortaAtiva] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Dados com os novos estados dinâmicos
  const dadosPortas = [
    { id: 1, status: 'p-good', sinal: -19.4, cliente: 'amanda_proxxima', sn: 'HWTC12345', alarme: 'Sinal Normal' },
    { id: 2, status: 'p-free', sinal: 0, cliente: '-', sn: '-', alarme: 'Livre' },
    { id: 3, status: 'p-loss', sinal: -40.0, cliente: 'fibra_rompida_res', sn: 'HWTC00000', alarme: 'LOSS (Fiber Cut)' },
    { id: 5, status: 'p-warn', sinal: -28.2, cliente: 'atenuado_cto', sn: 'HWTC99887', alarme: 'Atenuação Alta' },
    { id: 8, status: 'p-dying', sinal: -99.9, cliente: 'casa_sem_energia', sn: 'HWTC55555', alarme: 'Dying Gasp (Power)' },
  ];
// Adicione este estado para controlar a OS gerada
const [osGerada, setOsGerada] = useState<any>(null);

const gerarOS = () => {
  if (!portaAtiva) return;

  const novaOS = {
    numero: `OS-${portaAtiva.status === 'p-loss' ? 'LOS' : 'ATT'}-${Math.floor(Math.random() * 9000)}`,
    tecnico_sugerido: portaAtiva.status === 'p-loss' ? 'Equipe de Lançamento' : 'Técnico de Instalação',
    prioridade: portaAtiva.status === 'p-loss' ? 'CRÍTICA' : 'ALTA',
    resumo_tecnico: {
      cto: "CTO-CENTRO-01",
      porta: portaAtiva.id,
      sinal_dbm: portaAtiva.sinal,
      tipo_erro: portaAtiva.alarme,
      serial_onu: portaAtiva.sn,
      coordenadas: "-7.2245, -35.8831"
    }
  };

  setOsGerada(novaOS);
  registrarLog("OS GERADA", `Protocolo ${novaOS.numero} enviado para o despacho.`);
};
  const registrarLog = (acao: string, msg: string) => {
    const novo = { 
      protocolo: `PRX-${Math.floor(100000 + Math.random() * 900000)}`, 
      data: new Date().toLocaleString(), 
      acao, 
      ppoe: 'Amanda Leal', 
      msg 
    };
    setLogs(prev => [novo, ...prev]);
  };
// 1. Novo estado para o input da OS
const [numOSTecnico, setNumOSTecnico] = useState('');

// 2. Função para vincular a OS no Log de Auditoria
const vincularOSManual = () => {
  if (!numOSTecnico) return alert("Por favor, insira o número da OS de campo.");
  
  // Aqui usamos a função registrarLog que você já tem
  registrarLog("VINCULO_OS", `Briefing técnico vinculado à OS de campo: ${numOSTecnico}`);
  
  alert(`Protocolo vinculado com sucesso à OS ${numOSTecnico}`);
  setNumOSTecnico(''); // Limpa o campo após vincular
};
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{fontWeight: 800, fontSize: '1.4rem', marginBottom: '40px'}}>PROXXIMA.NOC</div>
        <nav style={{flex: 1}}>
          <div className="nav-link" style={{color: 'white', fontWeight: 600, marginBottom: '15px'}}>📍 Consulta de Rede</div>
          <div style={{color: 'rgba(255,255,255,0.4)', marginBottom: '15px'}}>🖥️ Status OLTs</div>
        </nav>
        <div style={{padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px'}}>
          <small style={{fontSize: '0.6rem', color: '#64748b'}}>OPERADOR:</small>
          <div style={{fontWeight: 700}}>Amanda Leal (NOC)</div>
        </div>
      </aside>

      <main className="main-content">
        <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '25px'}}>
          <h1>Monitoramento Dinâmico de CTO</h1>
          <button style={{background: '#0ea5e9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold'}}>+ Novo Chamado</button>
        </header>

        <section style={{display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', background: 'var(--bg-card)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '25px'}}>
          <div className="search-group">
             <label style={{fontSize: '0.7rem', fontWeight: 800, color: '#64748b'}}>BAIRRO</label>
             <select style={{width: '100%', background: '#0a0f1d', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: 'white'}}><option>Centro - Campina Grande</option></select>
          </div>
          <div className="search-group">
             <label style={{fontSize: '0.7rem', fontWeight: 800, color: '#64748b'}}>FILTRAR</label>
             <input type="text" style={{width: '100%', background: '#0a0f1d', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: 'white'}} placeholder="PPPoE ou Serial..." />
          </div>
          <button className="btn-consultar" style={{background: '#10b981', color: 'white', border: 'none', padding: '0 40px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer'}} onClick={() => {setExibir(true); registrarLog("CONSULTA", "Scan de Bairro Completo");}}>CONSULTAR</button>
        </section>

        {exibir && (
          <div className="dash-main-grid">
            {/* COLUNA 1: OLT E DIAGNÓSTICO */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <article className="card-pro">
                <div className="card-label">Hardware OLT</div>
                <h2>HUAWEI-OLT-01</h2>
                <div className="tel-grid">
                   <div className="tel-item"><small>CPU</small><strong style={{color: 'var(--success)'}}>12%</strong></div>
                   <div className="tel-item"><small>TEMP</small><strong style={{color: 'var(--warning)'}}>38°C</strong></div>
                   <div className="tel-item"><small>PWR</small><strong style={{color: 'var(--success)'}}>OK</strong></div>
                </div>
              </article>

              <article className="card-pro" style={{flex: 1}}>
                <div className="card-label">🔍 Diagnóstico Avançado</div>
                {portaAtiva ? (
                  <div>
                    <div style={{fontSize: '0.85rem', marginBottom: '15px'}}>
                      <p><strong>Cliente:</strong> {portaAtiva.cliente}</p>
                      <p><strong>Alarme:</strong> <span style={{color: portaAtiva.status === 'p-loss' ? 'var(--danger)' : portaAtiva.status === 'p-dying' ? 'var(--dying)' : 'white'}}>{portaAtiva.alarme}</span></p>
                    </div>
                    <div className="card-label" style={{marginBottom: '5px', color: '#64748b'}}>Potência: {portaAtiva.sinal} dBm</div>
                    <div className="diag-bar-bg">
                      <div className="diag-bar-fill" style={{
                        width: portaAtiva.status === 'p-loss' ? '100%' : `${Math.max(0, 100 + (portaAtiva.sinal * 3))}%`, 
                        background: portaAtiva.status === 'p-loss' ? 'var(--danger)' : portaAtiva.status === 'p-dying' ? 'var(--dying)' : 'var(--success)'
                      }}></div>
                    </div>
                  </div>
                ) : (
                  <p style={{color: '#64748b', fontSize: '0.75rem', textAlign: 'center', marginTop: '40px'}}>Selecione uma porta em alarme.</p>
                )}
              </article>
            </div>

            {/* COLUNA 2: MAPA (CENTRO) */}
            <article className="card-pro" style={{background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
               <div style={{position: 'absolute', top: '20px', left: '20px', color: 'var(--accent)', fontSize: '0.65rem', fontWeight: 800}}>MAPA DE TOPOLOGIA</div>
               <div style={{textAlign: 'center'}}>
                  <span style={{fontSize: '2rem'}}>📍</span><br/>
                  <small style={{color: '#64748b'}}>Centro - Campina Grande</small>
               </div>
            </article>

            {/* COLUNA 3: CTO COM ANIMAÇÕES */}
            <article className="card-pro">
              <div className="card-label">Portas CTO-CENTRO-01</div>
              <div className="port-grid">
                {[...Array(16)].map((_, i) => {
                  const p = dadosPortas.find(d => d.id === i+1) || { id: i+1, status: 'p-free' };
                  return (
                    <div key={i} className={`port-node ${p.status}`} onClick={() => setPortaAtiva(p)}>{i+1}</div>
                  );
                })}
              </div>
              <div style={{marginTop: '25px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.6rem', fontWeight: 800}}>
                 <span style={{color: 'var(--success)'}}>● ONLINE</span>
                 <span style={{color: 'var(--danger)'}}>● LOSS (FIBRA)</span>
                 <span style={{color: 'var(--dying)'}}>● DYING GASP</span>
                 <span style={{color: 'var(--warning)'}}>● ATENUAÇÃO</span>
              </div>
            </article>
          </div>
        )}

        {/* AUDITORIA NO RODAPÉ */}
        {exibir && (
          <section className="audit-section">
             <div style={{padding: '15px 20px', fontWeight: 800, fontSize: '0.8rem'}}>📜 Log de Auditoria & Alertas</div>
             <table className="audit-table">
                <thead>
                  <tr><th>Protocolo</th><th>Data/Hora</th><th>Evento</th><th>PPPoE</th><th>Detalhe</th></tr>
                </thead>
                <tbody>
                  {logs.map((l, i) => (
                    <tr key={i}>
                      <td style={{color: 'var(--accent)', fontWeight: 'bold'}}>{l.protocolo}</td>
                      <td>{l.data}</td>
                      <td>{l.acao}</td>
                      <td>{l.ppoe}</td>
                      <td>{l.msg}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;