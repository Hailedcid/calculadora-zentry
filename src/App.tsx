import { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Usamos Google Sans (y Roboto como respaldo en caso de que Google Sans no esté instalada localmente en el dispositivo)
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap');`;

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .calc-root {
    font-family: 'Google Sans', 'Roboto', sans-serif;
    background: #050B14; /* Azul oscuro más corporativo */
    min-height: 100vh;
    color: #E8EDF5;
    position: relative;
    overflow: hidden;
  }
  .bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(rgba(255,183,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,183,0,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .bg-glow {
    position: fixed; pointer-events: none; z-index: 0;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,183,0,0.05) 0%, transparent 70%);
    top: -200px; right: -150px;
  }
  .container {
    position: relative; z-index: 1;
    max-width: 780px; margin: 0 auto;
    padding: 40px 24px 80px;
  }
  .header { text-align: center; margin-bottom: 48px; }
  .logo-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,183,0,0.1); border: 1px solid rgba(255,183,0,0.25);
    border-radius: 40px; padding: 6px 16px; margin-bottom: 24px;
    font-size: 12px; font-weight: 700; color: #FFB700; letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .shield-icon { width: 14px; height: 14px; fill: #FFB700; }
  h1 { font-size: clamp(28px, 4vw, 38px); font-weight: 900; line-height: 1.15; margin-bottom: 14px; }
  h1 span { color: #FFB700; }
  .subtitle { font-size: 16px; color: #8A9BB3; line-height: 1.6; max-width: 550px; margin: 0 auto; font-weight: 400; }
  .progress-bar-wrap { margin-bottom: 40px; }
  .progress-steps { display: flex; align-items: center; justify-content: center; gap: 0; }
  .step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; transition: all 0.3s;
    border: 1.5px solid #1A2E48; background: #0A1420; color: #3A5070; position: relative; z-index: 1;
  }
  .step-dot.active { background: #FFB700; color: #050B14; border-color: #FFB700; }
  .step-dot.done { background: #143324; color: #2ECC71; border-color: #2ECC71; }
  .step-line { flex: 1; height: 1.5px; background: #1A2E48; max-width: 80px; }
  .step-line.done { background: #2ECC71; }
  .card {
    background: rgba(10,20,32,0.9); border: 1px solid #1A2E48;
    border-radius: 16px; padding: 36px; margin-bottom: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
  .card-title { font-size: 14px; font-weight: 700; color: #FFB700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 24px; }
  
  /* Selector B2B / B2C */
  .type-selector { display: flex; gap: 12px; margin-bottom: 28px; }
  .type-btn {
    flex: 1; padding: 14px; border-radius: 10px; border: 1.5px solid #1A2E48;
    background: #050B14; color: #8A9BB3; font-weight: 600; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .type-btn.active { border-color: #FFB700; background: rgba(255,183,0,0.08); color: #FFB700; }
  
  .field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .field { display: flex; flex-direction: column; gap: 8px; }
  label { font-size: 13px; color: #8A9BB3; font-weight: 600; }
  .input-wrap { position: relative; }
  .prefix {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-family: 'Space Mono', monospace; font-size: 14px; color: #5A708C;
    pointer-events: none;
  }
  input[type=text], input[type=number], input[type=email] {
    width: 100%; padding: 14px 16px; background: #050B14;
    border: 1px solid #1A2E48; border-radius: 10px;
    color: #E8EDF5; font-size: 15px; font-family: 'Space Mono', monospace;
    outline: none; transition: border-color 0.2s;
  }
  input.with-prefix { padding-left: 42px; }
  input:focus { border-color: #FFB700; }
  
  .risk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .risk-card {
    border: 1.5px solid #1A2E48; border-radius: 10px; padding: 16px 12px;
    text-align: center; cursor: pointer; transition: all 0.2s; background: #050B14;
  }
  .risk-card:hover { border-color: #2A4060; }
  .risk-card.selected { border-color: #FFB700; background: rgba(255,183,0,0.06); }
  .risk-card .risk-icon { font-size: 22px; margin-bottom: 8px; }
  .risk-card .risk-label { font-size: 13px; font-weight: 700; color: #E8EDF5; margin-bottom: 4px; }
  
  .check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .check-item {
    display: flex; align-items: center; gap: 10px;
    background: #050B14; border: 1px solid #1A2E48;
    border-radius: 10px; padding: 12px 14px; cursor: pointer; transition: all 0.2s;
  }
  .check-item.checked { border-color: #2ECC71; background: rgba(46,204,113,0.05); }
  .check-box {
    width: 20px; height: 20px; border-radius: 4px;
    border: 1.5px solid #1A2E48; background: #050B14;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .check-item.checked .check-box { background: #2ECC71; border-color: #2ECC71; }
  .check-label { font-size: 13px; font-weight: 500; color: #B0BCC9; }
  
  .btn-primary {
    width: 100%; padding: 16px; background: #FFB700; color: #050B14;
    border: none; border-radius: 10px; font-size: 16px; font-weight: 700;
    font-family: 'Google Sans', sans-serif; cursor: pointer; transition: all 0.2s;
  }
  .btn-primary:hover { background: #FFC933; }
  .btn-wa {
    background: #25D366; color: #FFF;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-wa:hover { background: #20BD5A; }
  .btn-ghost {
    background: transparent; border: 1px solid #1A2E48; color: #8A9BB3;
    border-radius: 10px; padding: 14px 24px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: #2A4060; color: #E8EDF5; }
  .btn-row { display: flex; gap: 12px; align-items: center; margin-top: 28px; }
  
  .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .result-stat { background: #050B14; border: 1px solid #1A2E48; border-radius: 12px; padding: 20px; }
  .stat-label { font-size: 12px; color: #8A9BB3; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; font-weight: 600; }
  .stat-value { font-family: 'Space Mono', monospace; font-size: 24px; font-weight: 700; color: #E8EDF5; }
  .stat-value.danger { color: #FF5252; }
  .stat-value.success { color: #2ECC71; }
  .stat-value.amber { color: #FFB700; }
  
  .chart-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-card { background: #050B14; border: 1px solid #1A2E48; border-radius: 12px; padding: 20px; }
  .chart-title { font-size: 12px; color: #8A9BB3; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; font-weight: 700; }
  .risk-meter { text-align: center; position: relative; }
  .risk-score-text { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; }
  
  .insight-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .insight-item { display: flex; align-items: flex-start; gap: 12px; background: #050B14; border: 1px solid #1A2E48; border-radius: 10px; padding: 16px; }
  .insight-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .insight-text { font-size: 14px; color: #B0BCC9; line-height: 1.5; }
  .insight-text strong { color: #E8EDF5; font-weight: 700; }
  
  @media (max-width: 600px) {
    .field-group, .risk-grid, .check-grid, .result-grid, .chart-section { grid-template-columns: 1fr; }
    .card { padding: 24px 20px; }
  }
`;

const ZONES = [
  { id: "high", label: "Alta vulnerabilidad", icon: "🔴", rate: 0.055 },
  { id: "mid", label: "Vulnerabilidad media", icon: "🟡", rate: 0.035 },
  { id: "low", label: "Baja vulnerabilidad", icon: "🟢", rate: 0.015 },
];

const MEASURES = [
  { id: "cctv_gen", label: "CCTV genérico y básico", reduction: 0.15 },
  { id: "alarma_gen", label: "Alarma sonora básica", reduction: 0.2 },
  { id: "guard", label: "Vigilancia física", reduction: 0.3 },
  { id: "access", label: "Control de acceso básico", reduction: 0.1 },
];

function fmt(n) {
  return "$ " + Math.round(n).toLocaleString("es-MX");
}

export default function ZentryCalculator() {
  const [step, setStep] = useState(1);
  const [clientType, setClientType] = useState("empresa"); // 'hogar' o 'empresa'
  const [form, setForm] = useState({
    name: "",
    assetValue: "500000",
    zone: "mid",
    measures: [],
    system_cost: "35000",
  });
  const [results, setResults] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTypeChange = (type) => {
    setClientType(type);
    if (type === "hogar") {
      set("assetValue", "150000");
      set("system_cost", "15000");
    } else {
      set("assetValue", "500000");
      set("system_cost", "35000");
    }
  };

  const toggleMeasure = (id) => {
    set(
      "measures",
      form.measures.includes(id)
        ? form.measures.filter((m) => m !== id)
        : [...form.measures, id]
    );
  };

  const calcResults = () => {
    const assets = parseFloat(form.assetValue) || 150000;
    const sysCost = parseFloat(form.system_cost) || 15000;
    const zone = ZONES.find((z) => z.id === form.zone);

    const currentReduction = form.measures.reduce((acc, id) => {
      const m = MEASURES.find((m) => m.id === id);
      return acc + (m ? m.reduction : 0);
    }, 0);

    // Un sistema Zentry (IA + AX PRO + Instalación Limpia) reduce el riesgo hasta un 85%
    const zentryReduction = 0.85;

    const currentRate = zone.rate * (1 - Math.min(currentReduction, 0.6));
    const newRate = zone.rate * (1 - zentryReduction);

    const avgLoss = assets * 0.6; // Pérdida promedio en un incidente

    const annualRiskNow = currentRate * avgLoss;
    const annualRiskWith = newRate * avgLoss;
    const annualSaving = annualRiskNow - annualRiskWith;

    const payback = sysCost / annualSaving;
    const roi5yr = ((annualSaving * 5 - sysCost) / sysCost) * 100;
    const riskScore = Math.round(currentRate * 1000);

    return {
      assets,
      sysCost,
      currentRate,
      annualRiskNow,
      annualRiskWith,
      annualSaving,
      payback,
      roi5yr,
      riskScore,
    };
  };

  const goToResults = () => {
    setResults(calcResults());
    setStep(3);
  };

  const riskColor = results
    ? results.riskScore > 20
      ? "#FF5252"
      : results.riskScore > 10
      ? "#FFB700"
      : "#2ECC71"
    : "#FFB700";

  // Link de WhatsApp personalizado Zentry
  const getWhatsAppLink = () => {
    if (!results) return "";
    const msg = `Hola Zentry, acabo de usar su evaluador de riesgo. Mi riesgo de pérdida actual está valorado en ${fmt(
      results.annualRiskNow
    )} MXN anuales y me interesa una solución de Ingeniería de Precisión para mi ${clientType}.`;
    return `https://wa.me/527202971956?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      <style>
        {FONTS}
        {styles}
      </style>
      <div className="calc-root">
        <div className="bg-grid" />
        <div className="bg-glow" />
        <div className="container">
          <div className="header">
            <div className="logo-badge">
              <svg className="shield-icon" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Ingeniería de Precisión Zentry
            </div>
            <h1>
              ¿Cuánto te cuesta <span>no invertir</span> en tu seguridad?
            </h1>
            <p className="subtitle">
              Calcula tu riesgo real y el Retorno de Inversión (ROI) de integrar
              un sistema de seguridad profesional en menos de 2 minutos.
            </p>
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-steps">
              {[1, 2, 3].map((s, i) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: i === 2 ? 0 : 1,
                  }}
                >
                  <div
                    className={`step-dot ${
                      step > s ? "done" : step === s ? "active" : ""
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  {i < 2 && (
                    <div
                      className={`step-line ${step > s ? "done" : ""}`}
                      style={{ width: "100%" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PASO 1 */}
          {step === 1 && (
            <div className="card">
              <div className="card-title">01 — Tu Inmueble</div>

              <div className="type-selector">
                <div
                  className={`type-btn ${
                    clientType === "hogar" ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange("hogar")}
                >
                  🏠 Hogar / Residencial
                </div>
                <div
                  className={`type-btn ${
                    clientType === "empresa" ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange("empresa")}
                >
                  🏢 Empresa / Retail
                </div>
              </div>

              <div className="field-group">
                <div className="field">
                  <label>Tu nombre</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Mendoza"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>
                    {clientType === "empresa"
                      ? "Valor estimado de inventario/equipos"
                      : "Valor estimado de pertenencias"}
                  </label>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input
                      type="number"
                      className="with-prefix"
                      value={form.assetValue}
                      onChange={(e) => set("assetValue", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 24 }}>
                <label>¿Cómo calificarías la zona de tu inmueble?</label>
                <div className="risk-grid">
                  {ZONES.map((z) => (
                    <div
                      key={z.id}
                      className={`risk-card ${
                        form.zone === z.id ? "selected" : ""
                      }`}
                      onClick={() => set("zone", z.id)}
                    >
                      <div className="risk-icon">{z.icon}</div>
                      <div className="risk-label">{z.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="btn-row">
                <button className="btn-primary" onClick={() => setStep(2)}>
                  Siguiente: Análisis Técnico →
                </button>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="card">
              <div className="card-title">02 — Infraestructura Actual</div>
              <div className="field" style={{ marginBottom: 24 }}>
                <label>
                  ¿Con qué medidas de seguridad cuentas actualmente?
                </label>
                <div style={{ height: 12 }} />
                <div className="check-grid">
                  {MEASURES.map((m) => (
                    <div
                      key={m.id}
                      className={`check-item ${
                        form.measures.includes(m.id) ? "checked" : ""
                      }`}
                      onClick={() => toggleMeasure(m.id)}
                    >
                      <div className="check-box">
                        {form.measures.includes(m.id) && (
                          <span
                            style={{
                              color: "#050B14",
                              fontSize: 14,
                              fontWeight: 900,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="check-label">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="field" style={{ marginBottom: 8 }}>
                <label>
                  Que presupuesto tienes pensado invertir en tu patrimonio (MXN)
                </label>
                <div className="input-wrap">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    className="with-prefix"
                    value={form.system_cost}
                    onChange={(e) => set("system_cost", e.target.value)}
                  />
                </div>
                <p style={{ fontSize: 12, color: "#5A708C", marginTop: 4 }}>
                  *Sistemas a medida, cableado en tubería y configuración de red
                  incluidos.
                </p>
              </div>
              <div className="btn-row">
                <button className="btn-ghost" onClick={() => setStep(1)}>
                  ← Atrás
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={goToResults}
                >
                  Calcular ROI y Riesgo →
                </button>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && results && (
            <>
              <div className="card">
                <div className="card-title">03 — Tu Diagnóstico Zentry</div>
                <div className="result-grid">
                  <div className="result-stat">
                    <div className="stat-label">
                      Riesgo de pérdida anual actual
                    </div>
                    <div className="stat-value danger">
                      {fmt(results.annualRiskNow)}
                    </div>
                  </div>
                  <div className="result-stat">
                    <div className="stat-label">
                      Perdida estimada al instalar sistemas integrados
                    </div>
                    <div className="stat-value success">
                      {fmt(results.annualRiskWith)}
                    </div>
                  </div>
                  <div className="result-stat">
                    <div className="stat-label">
                      Ahorro anual despues de tu inversión en seguridad
                    </div>
                    <div className="stat-value amber">
                      {fmt(results.annualSaving)}
                    </div>
                  </div>
                  <div className="result-stat">
                    <div className="stat-label">
                      En 5 años habras recueparado el (ROI 5 años)
                    </div>
                    <div className="stat-value">
                      {Math.round(results.roi5yr)}%
                    </div>
                  </div>
                </div>

                <div className="chart-section">
                  <div className="chart-card">
                    <div className="chart-title">Nivel de Vulnerabilidad</div>
                    <div className="risk-meter">
                      <ResponsiveContainer width="100%" height={140}>
                        <RadialBarChart
                          cx="50%"
                          cy="80%"
                          innerRadius="70%"
                          outerRadius="100%"
                          startAngle={180}
                          endAngle={0}
                          data={[
                            {
                              value: Math.min(
                                (results.riskScore / 35) * 100,
                                100
                              ),
                              fill: riskColor,
                            },
                          ]}
                        >
                          <RadialBar
                            dataKey="value"
                            cornerRadius={8}
                            background={{ fill: "#0A1420" }}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div
                        className="risk-score-text"
                        style={{ color: riskColor }}
                      >
                        {results.riskScore > 20
                          ? "ALTO"
                          : results.riskScore > 10
                          ? "MEDIO"
                          : "BAJO"}
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-title">
                      Mitigación de Riesgo Zentry
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Riesgo mitigado",
                              value: results.annualSaving,
                            },
                            {
                              name: "Riesgo residual",
                              value: results.annualRiskWith,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#2ECC71" />
                          <Cell fill="#FF5252" />
                        </Pie>
                        <Tooltip
                          formatter={(v) => fmt(v)}
                          contentStyle={{
                            background: "#050B14",
                            border: "1px solid #1A2E48",
                            borderRadius: 8,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                        marginTop: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            background: "#2ECC71",
                          }}
                        />
                        <span style={{ fontSize: 11, color: "#8A9BB3" }}>
                          Mitigado
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            background: "#FF5252",
                          }}
                        />
                        <span style={{ fontSize: 11, color: "#8A9BB3" }}>
                          Residual
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-list">
                  <div className="insight-item">
                    <div
                      className="insight-dot"
                      style={{ background: "#FFB700" }}
                    />
                    <div className="insight-text">
                      Los sistemas genéricos tienen un alto índice de falla. Una
                      infraestructura de{" "}
                      <strong>CCTV Inteligente o Alarmas AX PRO</strong> reduce
                      las falsas alarmas casi a cero.
                    </div>
                  </div>
                  <div className="insight-item">
                    <div
                      className="insight-dot"
                      style={{ background: "#2ECC71" }}
                    />
                    <div className="insight-text">
                      Con Zentry, tu inversión se recupera en{" "}
                      <strong>
                        {results.payback < 1
                          ? "meses"
                          : results.payback.toFixed(1) + " años"}
                      </strong>
                      , garantizando una instalación limpia y equipos de alta
                      calidad.
                    </div>
                  </div>
                </div>

                {/* Cierre Directo a WhatsApp */}
                <div style={{ marginTop: 32, textAlign: "center" }}>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <button className="btn-primary btn-wa">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                      Quiero mi sistema a medida por WhatsApp
                    </button>
                  </a>
                  <p style={{ fontSize: 12, color: "#5A708C", marginTop: 12 }}>
                    Serás redirigido para recibir atención personalizada de
                    nuestros ingenieros.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
