import { useState } from 'react';
import logoProxxima from './assets/Logo_Proxxima_Telecom.svg';
import './App.css';

function App() {
  // --- 1. ESTADOS ---
  const [exibir, setExibir] = useState(false);
  const [portaAtiva, setPortaAtiva] = useState<any>(null);
 // Verifique se estes estão EXATAMENTE aqui:
const [menuAberto, setMenuAberto] = useState(true);
const [temaEscuro, setTemaEscuro] = useState(true);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [usuario, setUsuario] = useState({ nome: '', cargo: '' });
const alternarTema = () => {
  const novo = temaEscuro ? 'light' : 'dark';
  setTemaEscuro(!temaEscuro);
  document.documentElement.setAttribute('data-theme', novo);
};
  // Adicione esta linha no topo, junto com os outros states:
const [logs, setLogs] = useState<any[]>([]);
  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [portaParaVincular, setPortaParaVincular] = useState<number | null>(null);
  const [novoCliente, setNovoCliente] = useState({ nome: '', protocolo: '', serial: '' });

  // Estado das Portas
  const [listaPortas, setListaPortas] = useState([
    { id: 1, status: 'p-good', sinal: -19.4, cliente: 'amanda_proxxima', sn: 'HWTC12345', alarme: 'Sinal Normal' },
    { id: 2, status: 'p-free', sinal: 0, cliente: '-', sn: '-', alarme: 'Livre' },
    { id: 3, status: 'p-loss', sinal: -40.0, cliente: 'fibra_rompida_res', sn: 'HWTC00000', alarme: 'LOSS (Fiber Cut)' },
    { id: 4, status: 'p-free', sinal: 0, cliente: '-', sn: '-', alarme: 'Livre' },
    { id: 5, status: 'p-warn', sinal: -28.2, cliente: 'atenuado_cto', sn: 'HWTC99887', alarme: 'Atenuação Alta' },
    { id: 8, status: 'p-dying', sinal: -99.9, cliente: 'casa_sem_energia', sn: 'HWTC55555', alarme: 'Dying Gasp (Power)' },
  ]);

  // --- 2. FUNÇÕES ---

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

  const handleCliquePorta = (p: any) => {
    if (p.status === 'p-free') {  
      setPortaParaVincular(p.id); 
      setModalAberto(true);
    } else {
      setPortaAtiva(p);
    }
  };
if (!isLoggedIn) {
  return (
    <div className="login-overlay">
      <div className="login-card">
        <img src={logoProxxima} className="login-logo" alt="Logo Proxxima" />
        <h3>Acesso ao NOC / Campo</h3>
        <p>Identifique-se para gerenciar a rede.</p>
        
        <input type="text" placeholder="Usuário ou Matrícula" className="login-input" />
        <input type="password" placeholder="Senha" className="login-input" />
        
        <button className="btn-login" onClick={() => {
          setIsLoggedIn(true);
          setUsuario({ nome: 'Amanda Leal', cargo: 'NOC' });
        }}>
          ENTRAR NO SISTEMA
        </button>
        <small>© 2026 Proxxima Telecom - Segurança Interna</small>
      </div>
    </div>
  );
}
  const finalizarVinculo = () => {
    if (!novoCliente.nome || !novoCliente.protocolo) return alert("Preencha os dados básicos!");

    const novaLista = listaPortas.map(p => {
      if (p.id === portaParaVincular) {
        return {
          ...p,
          status: 'p-good',
          cliente: novoCliente.nome,
          sn: novoCliente.serial || 'SN-PENDENTE',
          sinal: -18.5,
          alarme: 'Sinal Normal'
        };
      }
      return p;
    });

    setListaPortas(novaLista);
    registrarLog("ATIVAÇÃO", `Porta ${portaParaVincular} vinculada à OS ${novoCliente.protocolo}`);
    setModalAberto(false);
    setNovoCliente({ nome: '', protocolo: '', serial: '' });
    alert("Cliente provisionado com sucesso!");
  };

  // --- 3. RENDERIZAÇÃO ---
  return (
    <div className="app-container">
      {/* SIDEBAR RETRÁTIL COM LOGO */}
<aside className={`sidebar ${menuAberto ? '' : 'collapsed'}`}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: menuAberto ? 'space-between' : 'center', marginBottom: '30px' }}>
    {menuAberto ? (
      <img src={logoProxxima} alt="Proxxima" className="logo-main" />
    ) : (
      <div style={{ background: 'var(--accent)', padding: '10px', borderRadius: '8px', fontWeight: 900, color: 'white' }}>P</div>
    )}
    <button onClick={() => setMenuAberto(!menuAberto)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
      {menuAberto ? '❮' : '❯'}
    </button>
  </div>

  <nav style={{ flex: 1 }}>
    <div className="nav-link" style={{ color: 'white', fontWeight: 600, marginBottom: '15px', display: 'flex', gap: '10px' }}>
      <span>📍</span> {menuAberto && "Consulta de Rede"}
    </div>
    
    <div className="nav-link" onClick={alternarTema} style={{ color: 'white', cursor: 'pointer', display: 'flex', gap: '10px' }}>
      <span>{temaEscuro ? '☀️' : '🌙'}</span> {menuAberto && (temaEscuro ? "Modo Claro" : "Modo Escuro")}
    </div>
  </nav>

  <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>
      {menuAberto ? "Amanda Leal (NOC)" : "AL"}
    </div>
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
                  <p style={{color: '#64748b', fontSize: '0.75rem', textAlign: 'center', marginTop: '40px'}}>Selecione uma porta ocupada ou ative uma nova.</p>
                )}
              </article>
            </div>

            <article className="card-pro" style={{background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
               <div style={{position: 'absolute', top: '20px', left: '20px', color: 'var(--accent)', fontSize: '0.65rem', fontWeight: 800}}>MAPA DE TOPOLOGIA</div>
               <div style={{textAlign: 'center'}}>
                  <span style={{fontSize: '2rem'}}>📍</span><br/>
                  <small style={{color: '#64748b'}}>Centro - Campina Grande</small>
               </div>
            </article>

            <article className="card-pro">
              <div className="card-label">Portas CTO-CENTRO-01</div>
              <div className="port-grid">
                {[...Array(16)].map((_, i) => {
                  const portaId = i + 1;
                  const p = listaPortas.find(d => d.id === portaId) || { id: portaId, status: 'p-free' };
                  return (
                    <div key={i} className={`port-node ${p.status}`} onClick={() => handleCliquePorta(p)}>{portaId}</div>
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

      {/* MODAL */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <span className="modal-title">🔧 Provisionar Porta {portaParaVincular}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                className="input-os-tecnico" 
                placeholder="Nome do Cliente"
                value={novoCliente.nome}
                onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
              />
              <input 
                className="input-os-tecnico" 
                placeholder="Protocolo OS"
                value={novoCliente.protocolo}
                onChange={(e) => setNovoCliente({...novoCliente, protocolo: e.target.value})}
              />
              <input 
                className="input-os-tecnico" 
                placeholder="Serial ONU"
                value={novoCliente.serial}
                onChange={(e) => setNovoCliente({...novoCliente, serial: e.target.value})}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-save" onClick={finalizarVinculo}>VINCULAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;