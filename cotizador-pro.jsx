import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
//  CONFIG — Edita aquí todos los valores sin tocar el código
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  // Colores — edita libremente
  colors: {
    primary:       "#1D6FA4",   // Azul principal
    primaryLight:  "#EBF5FF",   // Azul muy claro (fondos)
    primaryMid:    "#C8E4F8",   // Azul medio (bordes, líneas)
    accent:        "#0A90D4",   // Azul acento (hover, activo)
    text:          "#1A2B3C",   // Texto principal
    textMid:       "#4A6278",   // Texto secundario
    textLight:     "#8AA5BA",   // Texto terciario
    bg:            "#F7FBFF",   // Fondo general
    white:         "#FFFFFF",
    border:        "#D4E8F5",
    success:       "#0E9060",
  },

  // Empresa
  empresa: {
    nombre:   "AQUA CONSTRUCCIONES",
    slogan:   "Albercas y Espacios Acuáticos",
    ciudad:   "Guadalajara, Jalisco",
    tel:      "33 0000 0000",
    email:    "contacto@aquaconstrucciones.mx",
    // URL de WhatsApp para asesoría (sección 5)
    whatsapp: "https://wa.me/5213300000000?text=Hola%2C%20me%20interesa%20asesor%C3%ADa%20sobre%20recubrimientos%20para%20alberca",
  },

  // Términos y condiciones (sección 1)
  terminos: {
    aviso: "Los datos que ingreses serán utilizados únicamente para elaborar tu cotización personalizada y poderte contactar via email o whatsapp.",
    textoCheck: "Acepto los términos y condiciones del servicio y autorizo el uso de mis datos para fines de cotización.",
    linkTerminos: "#", // URL a tu página de T&C
  },

  // SECCIÓN 2 — Tipos de proyecto (puedes cambiar imagen/icono URL)
  tiposProyecto: [
    {
      id:    "construction",
      emoji: "🏗️",
      img:   "", // URL de imagen o icono personalizado (deja vacío para usar emoji)
      title: "Alberca nueva",
      sub:   "Construir desde cero",
      next:  "c_shape",
    },
    {
      id:    "renovation",
      emoji: "🔧",
      img:   "",
      title: "Renovación",
      sub:   "Mejorar la existente",
      next:  "r_type",
    },
  ],

  // SECCIÓN 4 — Formas con medidas aproximadas
  formas: [
    { id:"rectangular", label:"Rectangular", medidas:"Líneas rectas y simétricas, ideal para nadar en línea recta", img:"" },
    { id:"oval",        label:"Ovalada",      medidas:"Bordes curvos suaves, aspecto elegante y fluido",            img:"" },
    { id:"kidney",      label:"Riñón",        medidas:"Forma orgánica irregular, se integra naturalmente al jardín",img:"" },
    { id:"freeform",    label:"Forma libre",  medidas:"Diseño totalmente personalizado según tu espacio",           img:"" },
  ],

  // SECCIÓN 5 — Recubrimientos (2 imágenes: material + alberca terminada)
  recubrimientos: [
    {
      id:       "venetian",
      label:    "Veneciano",
      sub:      "Acabado premium, duradero y elegante",
      imgMaterial: "", // URL imagen del material (mosaico veneciano)
      imgAlberca:  "", // URL imagen de alberca terminada con este recubrimiento
    },
    {
      id:       "membrane",
      label:    "Membrana",
      sub:      "Económica, flexible y fácil de instalar",
      imgMaterial: "",
      imgAlberca:  "",
    },
    {
      id:       "plaster",
      label:    "Cemento / Aplanado",
      sub:      "Acabado tradicional, robusto y económico",
      imgMaterial: "",
      imgAlberca:  "",
    },
  ],

  // SECCIÓN 6 — Equipamiento (imagen pequeña por opción)
  equipamiento: [
    { id:"filtration",   emoji:"🔵", img:"", label:"Sistema de filtración" },
    { id:"heat_pump",    emoji:"♨️",  img:"", label:"Bomba de calor" },
    { id:"solar",        emoji:"☀️",  img:"", label:"Paneles solares" },
    { id:"lighting",     emoji:"💡",  img:"", label:"Iluminación LED" },
    { id:"kiddie_pool",  emoji:"👶",  img:"", label:"Chapoteadero" },
    { id:"sundeck",      emoji:"🪑",  img:"", label:"Asoleadero" },
    { id:"chlorinator",  emoji:"🧪",  img:"", label:"Clorador salino" },
    { id:"automation",   emoji:"🤖",  img:"", label:"Automatización" },
    { id:"app",          emoji:"📱",  img:"", label:"App control alberca" },
    { id:"waterfall",    emoji:"💦",  img:"", label:"Cascada / Fuente" },
    { id:"cover",        emoji:"🛡️",  img:"", label:"Cubierta automática" },
    { id:"none",         emoji:"✓",   img:"", label:"Sin extras por ahora" },
  ],

  // Precios base (MXN)
  precios: {
    excavacion:       18000,
    concreto_m2:      3200,
    veneciano_m2:     1800,
    membrana_m2:      950,
    plaster_m2:       700,
    filtracion:       22000,
    bomba_calor:      38000,
    solar:            32000,
    led:              9800,
    chapoteadero:     25000,
    asoleadero:       18000,
    clorador:         14500,
    automatizacion:   19000,
    app:              8500,
    cascada:          18000,
    cubierta:         28000,
    escaleras:        9000,
    renov_completa_m2:4200,
    renov_recub_m2:   1800,
    renov_equipo:     22000,
    renov_estructura_m2: 2800,
  },
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
const SIZE_M2 = { jacuzzi:6, small:15, medium:28, large:72, xlarge:1250, unknown:30 };
const mxn = v => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(v);
const today = () => new Date().toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"});
const getFolio = () => `COT-2025-${Math.floor(Math.random()*900)+100}`;

function calcPartidas(answers) {
  const P = CONFIG.precios;
  const m2 = SIZE_M2[answers.size] || 30;
  const parts = [];
  if (answers.projectType === "construction") {
    parts.push({ desc:"Excavación y nivelación", unidad:"Global", cant:1, precio:P.excavacion, importe:P.excavacion });
    parts.push({ desc:"Construcción en concreto armado (muros, piso, estructura)", unidad:"m²", cant:m2, precio:P.concreto_m2, importe:m2*P.concreto_m2 });
    const coatMap = { venetian:[P.veneciano_m2,"Acabado veneciano"], membrane:[P.membrana_m2,"Membrana de vinilo"], plaster:[P.plaster_m2,"Cemento / aplanado"] };
    const [cp,cl] = coatMap[answers.coating] || [P.veneciano_m2,"Recubrimiento"];
    parts.push({ desc:`Impermeabilización y ${cl}`, unidad:"m²", cant:m2, precio:cp, importe:m2*cp });
    parts.push({ desc:"Escaleras de acero inoxidable", unidad:"Pieza", cant:2, precio:P.escaleras/2, importe:P.escaleras });
    const eq = answers.equipment || [];
    const eqMap = {
      filtration:  [P.filtracion,  "Sistema de filtración y bomba"],
      heat_pump:   [P.bomba_calor, "Bomba de calor"],
      solar:       [P.solar,       "Paneles solares"],
      lighting:    [P.led,         "Iluminación LED subacuática"],
      kiddie_pool: [P.chapoteadero,"Chapoteadero integrado"],
      sundeck:     [P.asoleadero,  "Área de asoleadero"],
      chlorinator: [P.clorador,    "Clorador salino"],
      automation:  [P.automatizacion,"Sistema de automatización"],
      app:         [P.app,         "App de control de alberca"],
      waterfall:   [P.cascada,     "Cascada / fuente decorativa"],
      cover:       [P.cubierta,    "Cubierta automática de seguridad"],
    };
    eq.forEach(k => { if(eqMap[k]) parts.push({ desc:eqMap[k][1], unidad:"Global", cant:1, precio:eqMap[k][0], importe:eqMap[k][0] }); });
  } else {
    const rtMap = { full:[P.renov_completa_m2,"Renovación completa"], coating:[P.renov_recub_m2,"Cambio de recubrimiento"], structure:[P.renov_estructura_m2,"Reparación estructural"] };
    const rt = answers.renovationType || "full";
    if (rt === "equipment") {
      parts.push({ desc:"Reemplazo de sistema de filtración, bomba e iluminación", unidad:"Global", cant:1, precio:P.renov_equipo, importe:P.renov_equipo });
    } else {
      const [rp,rl] = rtMap[rt] || rtMap.full;
      parts.push({ desc:rl, unidad:"m²", cant:m2, precio:rp, importe:m2*rp });
    }
    parts.push({ desc:"Limpieza, preparación de superficie y acabados finales", unidad:"Global", cant:1, precio:8500, importe:8500 });
  }
  return parts;
}

// ═══════════════════════════════════════════════════════════════
//  CSS VARS (generadas desde CONFIG.colors)
// ═══════════════════════════════════════════════════════════════
function cssVars() {
  const c = CONFIG.colors;
  return {
    "--c-primary":      c.primary,
    "--c-primary-lt":   c.primaryLight,
    "--c-primary-mid":  c.primaryMid,
    "--c-accent":       c.accent,
    "--c-text":         c.text,
    "--c-text-mid":     c.textMid,
    "--c-text-lt":      c.textLight,
    "--c-bg":           c.bg,
    "--c-white":        c.white,
    "--c-border":       c.border,
  };
}

// ═══════════════════════════════════════════════════════════════
//  SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════════
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M4 10H16M12 6L16 10L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function PoolSVG({ shape }) {
  const shapes = {
    rectangular: <rect x="4" y="6" width="40" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>,
    oval:        <ellipse cx="24" cy="18" rx="20" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/>,
    kidney:      <path d="M8 18C8 10 14 4 22 4C30 4 34 9 34 14C34 18 38 22 38 26C38 31 33 34 26 34C14 34 8 26 8 18Z" fill="none" stroke="currentColor" strokeWidth="2"/>,
    freeform:    <path d="M10 20C8 14 12 6 18 5C24 4 28 8 32 7C38 6 44 12 42 20C40 28 34 33 26 32C18 31 12 26 10 20Z" fill="none" stroke="currentColor" strokeWidth="2"/>,
    rectangular_large: <><rect x="2" y="9" width="44" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><text x="24" y="22" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="sans-serif">25m</text></>,
    jacuzzi:     <><circle cx="24" cy="18" r="13" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/></>,
  };
  return <svg width="48" height="36" viewBox="0 0 48 36">{shapes[shape]||shapes.rectangular}</svg>;
}

function ImgOrEmoji({ img, emoji, size=36, alt="" }) {
  if (img) return <img src={img} alt={alt} style={{ width:size, height:size, objectFit:"cover", borderRadius:6 }} />;
  return <span style={{ fontSize: size * 0.7 }}>{emoji}</span>;
}

// ─── Styled Option Row ────────────────────────────────────────
function OptRow({ label, sub, img, emoji, onClick, active }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{ ...btn.row, ...(hov || active ? btn.rowHov : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {(img || emoji) && (
          <div style={{ width:36, height:36, borderRadius:8, background:"var(--c-primary-lt)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <ImgOrEmoji img={img} emoji={emoji} size={28} />
          </div>
        )}
        <div>
          <div style={btn.rowTitle}>{label}</div>
          {sub && <div style={btn.rowSub}>{sub}</div>}
        </div>
      </div>
      <div style={{ color:"var(--c-primary)", flexShrink:0 }}><Arrow /></div>
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────
function Progress({ value }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:120, height:5, background:"var(--c-border)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${value}%`, background:"var(--c-primary)", borderRadius:3, transition:"width 0.4s ease" }} />
      </div>
      <span style={{ fontSize:12, color:"var(--c-text-mid)", fontFamily:"monospace" }}>{value}%</span>
    </div>
  );
}

// ─── Tag ──────────────────────────────────────────────────────
function Tag({ children }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--c-primary-lt)", border:"1px solid var(--c-primary-mid)", color:"var(--c-primary)", fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:"1.5px", textTransform:"uppercase", padding:"4px 10px", borderRadius:6, marginBottom:14 }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function CotizadorPro() {
  const [step, setStep] = useState("contact");
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ nombre:"", correo:"", telefono:"" });
  const [errors, setErrors] = useState({});
  const [termsOk, setTermsOk] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [transitioning, setTransitioning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [folio] = useState(getFolio());
  const topRef = useRef(null);

  const isReno = answers.projectType === "renovation";
  const stepOrder = isReno
    ? ["contact","projectType","r_type","r_coating","r_problem","r_size","r_location","r_timeline","summary"]
    : ["contact","projectType","c_shape","c_size","c_coating","c_equipment","c_location","c_timeline","summary"];
  const idx = stepOrder.indexOf(step);
  const progress = submitted ? 100 : Math.round((idx / (stepOrder.length-1)) * 100);

  const goTo = s => {
    setTransitioning(true);
    topRef.current?.scrollIntoView({ behavior:"smooth" });
    setTimeout(() => { setStep(s); setTransitioning(false); }, 260);
  };
  const pick = (key, val, next) => { setAnswers(a => ({ ...a, [key]:val })); goTo(next); };
  const back = () => { if (idx > 0) goTo(stepOrder[idx-1]); };

  const validateContact = () => {
    const e = {};
    if (!contact.nombre.trim()) e.nombre = "Campo requerido";
    if (!/\S+@\S+\.\S+/.test(contact.correo)) e.correo = "Correo inválido";
    if (contact.telefono.replace(/\D/g,"").length < 10) e.telefono = "Mínimo 10 dígitos";
    if (!termsOk) e.terms = "Debes aceptar los términos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── SUBMITTED VIEW ────────────────────────────────────────
  if (submitted) {
    const partidas = calcPartidas(answers);
    const subtotal = partidas.reduce((s,p) => s+p.importe, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    return (
      <div style={{ ...layout.wrap, ...cssVars() }} ref={topRef}>
        {/* Success banner */}
        <div style={layout.successBanner}>
          <div>
            <div style={{ color:CONFIG.colors.primary, fontWeight:700, fontSize:13, marginBottom:4 }}>✓ Solicitud enviada correctamente</div>
            <div style={{ color:CONFIG.colors.text, fontWeight:800, fontSize:20 }}>Tu cotización está lista, {contact.nombre.split(" ")[0]}</div>
            <div style={{ color:CONFIG.colors.textMid, fontSize:13, marginTop:4 }}>Te contactaremos en menos de 24 hrs · {contact.correo}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:CONFIG.colors.textMid, fontSize:12 }}>Total estimado</div>
            <div style={{ color:CONFIG.colors.primary, fontWeight:800, fontSize:26 }}>{mxn(total)}</div>
            <div style={{ color:CONFIG.colors.textLight, fontSize:11 }}>IVA incluido · referencial</div>
          </div>
        </div>

        {/* Quotation */}
        <div id="quot-preview" style={layout.quotWrap}>
          <QuotationView answers={answers} contact={contact} folio={folio} partidas={partidas} subtotal={subtotal} iva={iva} total={total} />
        </div>

        {/* Download */}
        <button style={btn.primary} onClick={() => {
          const w = window.open("","_blank");
          const el = document.getElementById("quot-preview");
          w.document.write(`<html><head><title>${folio}</title><style>body{font-family:sans-serif;padding:24px;color:#1A2B3C;font-size:12px} table{width:100%;border-collapse:collapse} th{background:#1D6FA4;color:white;padding:8px;font-size:11px} td{padding:7px 10px;border-bottom:1px solid #D4E8F5;font-size:11px} tr:nth-child(even) td{background:#EBF5FF}</style></head><body>${el.innerHTML}</body></html>`);
          w.document.close();
          setTimeout(() => w.print(), 400);
        }}>
          ↓ Descargar PDF
        </button>
        <button style={{ ...btn.ghost, marginTop:10 }} onClick={() => { setSubmitted(false); setStep("contact"); setAnswers({}); setContact({nombre:"",correo:"",telefono:""}); setTermsOk(false); }}>
          ← Nueva cotización
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...layout.wrap, ...cssVars() }}>
      {/* Header */}
      <div style={layout.header} ref={topRef}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="28" height="20" viewBox="0 0 32 22" fill="none">
            <path d="M2 14C5 10 9 8 12 11C15 14 19 12 22 9C25 6 29 8 30 11" stroke={CONFIG.colors.primary} strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M2 19C5 15 9 13 12 16C15 19 19 17 22 14C25 11 29 13 30 16" stroke={CONFIG.colors.primaryMid} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ color:CONFIG.colors.primary, fontFamily:"Georgia,serif", fontWeight:700, fontSize:18 }}>
            {CONFIG.empresa.nombre}
          </span>
        </div>
        {step !== "contact" && <Progress value={progress} />}
      </div>

      {/* Card */}
      <div style={{ ...layout.card, opacity:transitioning?0:1, transform:transitioning?"translateY(10px)":"translateY(0)", transition:"opacity 0.26s, transform 0.26s" }}>

        {/* ── S1: CONTACTO ─────────────────────────────── */}
        {step === "contact" && (
          <div>
            <Tag>Empecemos</Tag>
            <h1 style={ty.h1}>¿Cómo te podemos <span style={{ color:"var(--c-primary)" }}>contactar?</span></h1>

            {/* Aviso */}
            <div style={layout.notice}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink:0, marginTop:1 }}>
                <circle cx="10" cy="10" r="9" stroke={CONFIG.colors.primary} strokeWidth="1.5"/>
                <path d="M10 9v5M10 6.5v.5" stroke={CONFIG.colors.primary} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ margin:0, fontSize:13, color:"var(--c-text-mid)", lineHeight:1.6 }}>
                {CONFIG.terminos.aviso}
              </p>
            </div>

            {/* Fields */}
            <div style={{ display:"flex", flexDirection:"column", gap:14, margin:"20px 0" }}>
              {[
                ["nombre","Nombre completo","Ej. María González","text"],
                ["correo","Correo electrónico","tu@correo.com","email"],
                ["telefono","Teléfono","55 1234 5678","tel"],
              ].map(([f,lbl,ph,type]) => (
                <div key={f}>
                  <label style={ty.label}>{lbl}</label>
                  <input
                    style={{ ...form.input, ...(errors[f]?form.inputErr:{}) }}
                    type={type} placeholder={ph}
                    value={contact[f]}
                    onChange={e => setContact(c => ({ ...c, [f]:e.target.value }))}
                  />
                  {errors[f] && <div style={form.errMsg}>{errors[f]}</div>}
                </div>
              ))}
            </div>

            {/* Terms checkbox */}
            <label style={form.checkLabel}>
              <div
                style={{ ...form.checkbox, ...(termsOk ? form.checkboxOn : {}), ...(errors.terms ? { borderColor:"#DC2626" } : {}) }}
                onClick={() => setTermsOk(t => !t)}
              >
                {termsOk && <CheckIcon />}
              </div>
              <span style={{ fontSize:13, color:"var(--c-text-mid)", lineHeight:1.5 }}>
                {CONFIG.terminos.textoCheck}{" "}
                <a href={CONFIG.terminos.linkTerminos} style={{ color:"var(--c-primary)" }} target="_blank" rel="noreferrer">Ver términos</a>
              </span>
            </label>
            {errors.terms && <div style={{ ...form.errMsg, marginTop:4 }}>{errors.terms}</div>}

            <button style={{ ...btn.primary, marginTop:20 }} onClick={() => {
              if (validateContact()) { setAnswers(a => ({ ...a, contact })); goTo("projectType"); }
            }}>
              Continuar <Arrow />
            </button>
          </div>
        )}

        {/* ── S2: TIPO DE PROYECTO ─────────────────────── */}
        {step === "projectType" && (
          <div>
            <Tag>Paso 1 de 7</Tag>
            <h1 style={ty.h1}>¿Qué tipo de proyecto <span style={{ color:"var(--c-primary)" }}>tienes en mente?</span></h1>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:12 }}>
              {CONFIG.tiposProyecto.map(t => (
                <ProjectTypeCard key={t.id} item={t} onClick={() => { setAnswers(a => ({ ...a, projectType:t.id })); goTo(t.next); }} />
              ))}
            </div>
            <p style={{ fontSize:12, color:"var(--c-text-lt)", marginTop:14, textAlign:"center" }}>
              💡 Si no estás seguro/a, selecciona "Alberca nueva" y te orientamos.
            </p>
          </div>
        )}

        {/* ── S3: TIPO RENOVACIÓN ──────────────────────── */}
        {step === "r_type" && (
          <div>
            <Tag>Renovación · Paso 2</Tag>
            <h1 style={ty.h1}>¿Qué tipo de <span style={{ color:"var(--c-primary)" }}>renovación buscas?</span></h1>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:10 }}>
              {[
                { v:"full",      l:"Renovación completa",    s:"Recubrimiento, filtración y detalles" },
                { v:"coating",   l:"Solo recubrimiento",     s:"Cambio de acabado superficial" },
                { v:"equipment", l:"Equipamiento",           s:"Filtros, bombas, iluminación" },
                { v:"structure", l:"Reparación estructural", s:"Grietas, fugas, nivelación" },
              ].map(o => <OptRow key={o.v} label={o.l} sub={o.s} onClick={() => pick("renovationType",o.v,"r_coating")} />)}
            </div>
          </div>
        )}

        {step === "r_coating" && (
          <div>
            <Tag>Renovación · Paso 3</Tag>
            <h1 style={ty.h1}>¿Cuál es el <span style={{ color:"var(--c-primary)" }}>recubrimiento actual?</span></h1>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:10 }}>
              {[
                { v:"venetian", l:"Veneciano / Mosaico", s:"Acabado cerámico o de vidrio" },
                { v:"membrane", l:"Membrana de vinilo",  s:"Liner o vinilo adherido" },
                { v:"plaster",  l:"Cemento / Aplanado",  s:"Acabado de mezcla tradicional" },
                { v:"unknown",  l:"No lo sé",            s:"Un experto lo identificará" },
              ].map(o => <OptRow key={o.v} label={o.l} sub={o.s} onClick={() => pick("currentCoating",o.v,"r_problem")} />)}
            </div>
          </div>
        )}

        {step === "r_problem" && (
          <div>
            <Tag>Renovación · Paso 4</Tag>
            <h1 style={ty.h1}>¿Cuál es el <span style={{ color:"var(--c-primary)" }}>problema principal?</span></h1>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:10 }}>
              {[
                { v:"aesthetics", l:"Apariencia deteriorada",     s:"Manchas, desgaste, colores opacos" },
                { v:"leak",       l:"Fuga de agua",                s:"Pierde agua constantemente" },
                { v:"cracks",     l:"Grietas o daño estructural",  s:"Fracturas visibles" },
                { v:"equipment",  l:"Equipos defectuosos",         s:"Bomba, filtro o iluminación" },
              ].map(o => <OptRow key={o.v} label={o.l} sub={o.s} onClick={() => pick("problem",o.v,"r_size")} />)}
            </div>
          </div>
        )}

        {step === "r_size" && (
          <div>
            <Tag>Renovación · Paso 5</Tag>
            <h1 style={ty.h1}>¿Cuánto mide <span style={{ color:"var(--c-primary)" }}>aproximadamente?</span></h1>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:10 }}>
              {[
                { v:"small",   l:"Pequeña",        s:"aprox. 18 m²" },
                { v:"medium",  l:"Mediana",         s:"aprox. 30 m²" },
                { v:"large",   l:"Grande",          s:"aprox. 50 m²" },
                { v:"unknown", l:"No estoy seguro/a", s:"Lo mediremos en visita" },
              ].map(o => <OptRow key={o.v} label={o.l} sub={o.s} onClick={() => pick("size",o.v,"r_location")} />)}
            </div>
          </div>
        )}

        {step === "r_location" && <LocationStep tag="Renovación · Paso 6" onNext={v => pick("location",v,"r_timeline")} />}
        {step === "r_timeline"  && <TimelineStep tag="Renovación · Paso 7" onNext={v => pick("timeline",v,"summary")} />}

        {/* ── S4: FORMA ────────────────────────────────── */}
        {step === "c_shape" && (
          <div>
            <Tag>Construcción · Paso 2</Tag>
            <h1 style={ty.h1}>¿Qué forma prefieres <span style={{ color:"var(--c-primary)" }}>para tu alberca?</span></h1>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:12 }}>
              {CONFIG.formas.map(f => (
                <ShapeCard key={f.id} item={f} onClick={() => pick("shape", f.id, "c_size")} />
              ))}
            </div>
          </div>
        )}

        {/* ── S4b: TAMAÑO ──────────────────────────────── */}
        {step === "c_size" && (
          <div>
            <Tag>Construcción · Paso 3</Tag>
            <h1 style={ty.h1}>¿Qué <span style={{ color:"var(--c-primary)" }}>tamaño necesitas?</span></h1>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:10 }}>
              {[
                { v:"jacuzzi", l:"Jacuzzi",                s:"aprox. 2.5 m × 2.5 m" },
                { v:"small",   l:"Alberca pequeña",        s:"aprox. 3 m × 5 m" },
                { v:"medium",  l:"Alberca mediana",        s:"aprox. 4 m × 7 m" },
                { v:"large",   l:"Alberca grande",         s:"aprox. 6 m × 12 m" },
                { v:"xlarge",  l:"Olímpica / Profesional", s:"aprox. 25 m × 50 m" },
              ].map(o => <OptRow key={o.v} label={o.l} sub={o.s} onClick={() => pick("size",o.v,"c_coating")} />)}
            </div>
          </div>
        )}

        {/* ── S5: RECUBRIMIENTO ────────────────────────── */}
        {step === "c_coating" && (
          <div>
            <Tag>Construcción · Paso 4</Tag>
            <h1 style={ty.h1}>¿Tipo de <span style={{ color:"var(--c-primary)" }}>recubrimiento?</span></h1>
            <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop:12 }}>
              {CONFIG.recubrimientos.map(r => (
                <CoatingCard key={r.id} item={r} onClick={() => pick("coating", r.id, "c_equipment")} />
              ))}
            </div>
            {/* WhatsApp asesoría */}
            <a href={CONFIG.empresa.whatsapp} target="_blank" rel="noreferrer" style={btn.waLink}>
              <WaIcon />
              ¿No sabes cuál elegir? Habla con un asesor →
            </a>
          </div>
        )}

        {/* ── S6: EQUIPAMIENTO ─────────────────────────── */}
        {step === "c_equipment" && (
          <div>
            <Tag>Construcción · Paso 5</Tag>
            <h1 style={ty.h1}>¿Qué equipamiento <span style={{ color:"var(--c-primary)" }}>incluirás?</span></h1>
            <p style={{ fontSize:13, color:"var(--c-text-mid)", marginBottom:16 }}>Puedes seleccionar varios.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {CONFIG.equipamiento.map(e => {
                const active = equipment.includes(e.id);
                return (
                  <EquipChip key={e.id} item={e} active={active} onClick={() => {
                    if (e.id === "none") { setEquipment(["none"]); return; }
                    setEquipment(eq => eq.includes(e.id) ? eq.filter(x=>x!==e.id) : [...eq.filter(x=>x!=="none"), e.id]);
                  }} />
                );
              })}
            </div>
            {equipment.length > 0 && (
              <button style={btn.primary} onClick={() => { setAnswers(a => ({ ...a, equipment })); goTo("c_location"); }}>
                Continuar <Arrow />
              </button>
            )}
          </div>
        )}

        {step === "c_location" && <LocationStep tag="Construcción · Paso 6" onNext={v => pick("location",v,"c_timeline")} />}
        {step === "c_timeline"  && <TimelineStep tag="Construcción · Paso 7" onNext={v => pick("timeline",v,"summary")} />}

        {/* ── RESUMEN ──────────────────────────────────── */}
        {step === "summary" && (
          <SummaryStep answers={answers} contact={contact} onSubmit={() => setSubmitted(true)} />
        )}
      </div>

      {/* Back + step indicator */}
      {step !== "contact" && step !== "summary" && (
        <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:12, zIndex:1 }}>
          <button style={btn.ghost} onClick={back}>← Regresar</button>
          <span style={{ fontSize:12, color:"var(--c-text-lt)" }}>Paso {idx} de {stepOrder.length-2}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CARD COMPONENTS
// ═══════════════════════════════════════════════════════════════
function ProjectTypeCard({ item, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{ ...card.base, ...(hov ? card.hov : {}), flexDirection:"column", padding:"24px 16px", alignItems:"center", gap:10, textAlign:"center" }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ width:56, height:56, borderRadius:14, background:hov?"var(--c-primary)":"var(--c-primary-lt)", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}>
        {item.img
          ? <img src={item.img} alt={item.title} style={{ width:36, height:36, objectFit:"cover", borderRadius:8 }} />
          : <span style={{ fontSize:28, filter:hov?"grayscale(1) brightness(10)":"none", transition:"filter 0.2s" }}>{item.emoji}</span>
        }
      </div>
      <div style={{ color:"var(--c-text)", fontWeight:700, fontSize:15 }}>{item.title}</div>
      <div style={{ color:"var(--c-text-mid)", fontSize:12 }}>{item.sub}</div>
    </button>
  );
}

function ShapeCard({ item, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{ ...card.base, ...(hov ? card.hov : {}), flexDirection:"column", padding:"16px 10px", alignItems:"center", gap:8 }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {item.img
        ? <img src={item.img} alt={item.label} style={{ width:48, height:36, objectFit:"cover", borderRadius:6 }} />
        : <div style={{ color:"var(--c-primary)" }}><PoolSVG shape={item.id} /></div>
      }
      <div style={{ color:"var(--c-text)", fontWeight:700, fontSize:13 }}>{item.label}</div>
      <div style={{ color:"var(--c-primary)", fontSize:11, fontWeight:600 }}>{item.medidas}</div>
    </button>
  );
}

function CoatingCard({ item, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{ ...card.base, ...(hov ? card.hov : {}), flexDirection:"row", padding:"16px", gap:14, alignItems:"center", textAlign:"left" }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Material image */}
      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
        <div style={card.imgBox}>
          {item.imgMaterial
            ? <img src={item.imgMaterial} alt="material" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:6 }} />
            : <span style={{ fontSize:22 }}>🪨</span>
          }
          <div style={card.imgLabel}>Material</div>
        </div>
        <div style={card.imgBox}>
          {item.imgAlberca
            ? <img src={item.imgAlberca} alt="alberca" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:6 }} />
            : <span style={{ fontSize:22 }}>🏊</span>
          }
          <div style={card.imgLabel}>Resultado</div>
        </div>
      </div>
      {/* Text */}
      <div style={{ flex:1 }}>
        <div style={{ color:"var(--c-text)", fontWeight:700, fontSize:15 }}>{item.label}</div>
        <div style={{ color:"var(--c-text-mid)", fontSize:12, marginTop:3 }}>{item.sub}</div>
      </div>
      <div style={{ color:"var(--c-primary)", flexShrink:0 }}><Arrow /></div>
    </button>
  );
}

function EquipChip({ item, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{ ...card.chip, ...(active ? card.chipOn : hov ? card.chipHov : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ width:32, height:32, borderRadius:8, background:active?"var(--c-primary)":"var(--c-primary-lt)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.2s" }}>
        {item.img
          ? <img src={item.img} alt={item.label} style={{ width:22, height:22, objectFit:"cover", borderRadius:4 }} />
          : <span style={{ fontSize:16, filter:active?"grayscale(1) brightness(10)":"none", transition:"filter 0.2s" }}>{item.emoji}</span>
        }
      </div>
      <span style={{ fontSize:12, color:active?"var(--c-primary)":"var(--c-text)", fontWeight:active?700:500, flex:1, textAlign:"left" }}>{item.label}</span>
      {active && <div style={{ color:"var(--c-primary)", flexShrink:0 }}><CheckIcon /></div>}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════
function LocationStep({ tag, onNext }) {
  const [val, setVal] = useState("");
  return (
    <div>
      <Tag>{tag}</Tag>
      <h1 style={ty.h1}>¿Dónde se realizará <span style={{ color:"var(--c-primary)" }}>el proyecto?</span></h1>
      <p style={{ fontSize:13, color:"var(--c-text-mid)", marginBottom:16 }}>Ciudad o municipio es suficiente.</p>
      <input style={form.input} placeholder="Ej. Guadalajara, Jalisco" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key==="Enter" && val.trim() && onNext(val)} />
      <button style={{ ...btn.primary, opacity:val.trim()?1:0.5, marginTop:12 }} onClick={() => val.trim() && onNext(val)} disabled={!val.trim()}>
        Continuar <Arrow />
      </button>
    </div>
  );
}

function TimelineStep({ tag, onNext }) {
  return (
    <div>
      <Tag>{tag}</Tag>
      <h1 style={ty.h1}>¿Cuándo quisieras <span style={{ color:"var(--c-primary)" }}>comenzar?</span></h1>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:10 }}>
        {[
          { v:"asap",      l:"Lo antes posible",     s:"Estoy listo para iniciar" },
          { v:"1_3",       l:"En 1–3 meses",          s:"Estoy en proceso de decisión" },
          { v:"3_6",       l:"En 3–6 meses",          s:"Planeo con anticipación" },
          { v:"exploring", l:"Solo estoy explorando", s:"Cotización para referencia" },
        ].map(o => <OptRow key={o.v} label={o.l} sub={o.s} onClick={() => onNext(o.v)} />)}
      </div>
    </div>
  );
}

function SummaryStep({ answers, contact, onSubmit }) {
  const partidas = calcPartidas(answers);
  const total = partidas.reduce((s,p) => s+p.importe, 0) * 1.16;
  const isConst = answers.projectType === "construction";
  const rows = [
    ["Tipo", isConst ? "Alberca nueva" : "Renovación"],
    isConst && ["Forma", CONFIG.formas.find(f=>f.id===answers.shape)?.label],
    ["Tamaño", { jacuzzi:"Jacuzzi (2.5×2.5 m)", small:"Pequeña (3×5 m)", medium:"Mediana (4×7 m)", large:"Grande (6×12 m)", xlarge:"Olímpica (25×50 m)", unknown:"Por determinar" }[answers.size]],
    isConst && ["Recubrimiento", CONFIG.recubrimientos.find(r=>r.id===answers.coating)?.label],
    !isConst && ["Renovación", { full:"Completa",coating:"Solo recubrimiento",equipment:"Equipamiento",structure:"Reparación estructural" }[answers.renovationType]],
    ["Ubicación", answers.location],
    ["Inicio", { asap:"Lo antes posible","1_3":"1–3 meses","3_6":"3–6 meses",exploring:"Solo explorando" }[answers.timeline]],
  ].filter(Boolean).filter(r => r[1]);

  return (
    <div>
      <Tag>¡Casi listo!</Tag>
      <h1 style={ty.h1}>Resumen de tu <span style={{ color:"var(--c-primary)" }}>solicitud</span></h1>
      <p style={{ fontSize:13, color:"var(--c-text-mid)", marginBottom:16 }}>{contact.nombre} · {contact.correo}</p>
      <div style={{ border:"1px solid var(--c-border)", borderRadius:12, overflow:"hidden", marginBottom:16 }}>
        {rows.map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 16px", borderBottom:"1px solid var(--c-border)", background:"var(--c-white)" }}>
            <span style={{ fontSize:13, color:"var(--c-text-mid)" }}>{k}</span>
            <span style={{ fontSize:13, color:"var(--c-text)", fontWeight:600, textAlign:"right", maxWidth:"60%" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background:"var(--c-primary-lt)", border:"1px solid var(--c-primary-mid)", borderRadius:10, padding:"14px 16px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:13, color:"var(--c-text-mid)" }}>Total estimado (IVA incl.)</span>
        <span style={{ color:"var(--c-primary)", fontWeight:800, fontSize:20 }}>{mxn(total)}</span>
      </div>
      <button style={btn.primary} onClick={onSubmit}>Ver cotización completa →</button>
      <p style={{ fontSize:11, color:"var(--c-text-lt)", textAlign:"center", marginTop:10 }}>Te contactaremos en menos de 24 hrs hábiles.</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  QUOTATION DOCUMENT
// ═══════════════════════════════════════════════════════════════
function QuotationView({ answers, contact, folio, partidas, subtotal, iva, total }) {
  const isConst = answers.projectType === "construction";
  const m2 = SIZE_M2[answers.size] || 30;
  return (
    <div style={{ fontFamily:"sans-serif", color:"#1A2B3C" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1D6FA4,#0A90D4)", borderRadius:10, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ color:"white", fontWeight:800, fontSize:20, fontFamily:"Georgia,serif" }}>{CONFIG.empresa.nombre}</div>
          <div style={{ color:"rgba(255,255,255,0.75)", fontSize:11, marginTop:2 }}>{CONFIG.empresa.slogan}</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:10, marginTop:6 }}>{CONFIG.empresa.ciudad} · Tel: {CONFIG.empresa.tel}</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:10 }}>{CONFIG.empresa.email}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"white", fontWeight:800, fontSize:16 }}>COTIZACIÓN</div>
          <div style={{ color:"#C8E4F8", fontWeight:700, fontSize:14 }}>{folio}</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:10, marginTop:8 }}>Fecha: {today()}</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:10 }}>Vigencia: 15 días naturales</div>
        </div>
      </div>
      {/* Two col */}
      <div style={{ display:"flex", gap:12, marginBottom:14 }}>
        <div style={{ border:"1px solid #D4E8F5", borderRadius:8, padding:"12px 14px", background:"white", minWidth:160 }}>
          <div style={{ color:"#1D6FA4", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", marginBottom:8, paddingBottom:6, borderBottom:"1px solid #EBF5FF" }}>DATOS DEL CLIENTE</div>
          <div style={{ fontSize:11, marginBottom:3 }}><span style={{ color:"#4A6278" }}>Cliente: </span>{contact.nombre}</div>
          <div style={{ fontSize:11, marginBottom:3 }}><span style={{ color:"#4A6278" }}>Tel: </span>{contact.telefono}</div>
          <div style={{ fontSize:11 }}><span style={{ color:"#4A6278" }}>Email: </span>{contact.correo}</div>
        </div>
        <div style={{ border:"1px solid #D4E8F5", borderRadius:8, padding:"12px 14px", background:"white", flex:1 }}>
          <div style={{ color:"#1D6FA4", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", marginBottom:8, paddingBottom:6, borderBottom:"1px solid #EBF5FF" }}>ESPECIFICACIONES</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 10px" }}>
            {[
              ["Tipo", isConst?"Alberca Nueva":"Renovación"],
              ["Espejo de agua", `${m2} m²`],
              ["Tamaño aprox", { small:"~18 m²",medium:"~30 m²",large:"~50 m²",xlarge:"~70 m²",unknown:"Por determinar" }[answers.size]],
              ["Ubicación", answers.location||"—"],
              isConst && ["Forma", CONFIG.formas.find(f=>f.id===answers.shape)?.label||"—"],
              isConst && ["Recubrimiento", CONFIG.recubrimientos.find(r=>r.id===answers.coating)?.label||"—"],
            ].filter(Boolean).map(([k,v]) => (
              <div key={k} style={{ fontSize:11 }}><span style={{ color:"#4A6278" }}>{k}: </span><span style={{ fontWeight:600 }}>{v}</span></div>
            ))}
          </div>
        </div>
      </div>
      {/* Table */}
      <div style={{ color:"#1D6FA4", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", margin:"14px 0 6px", paddingBottom:5, borderBottom:"1px solid #D4E8F5" }}>PARTIDAS DEL PROYECTO</div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:8 }}>
        <thead>
          <tr style={{ background:"#1D6FA4" }}>
            {["DESCRIPCIÓN","UNIDAD","CANT.","P. UNITARIO","IMPORTE"].map((h,i) => (
              <th key={h} style={{ color:"white", padding:"8px 10px", fontSize:10, textAlign:i>1?"right":"left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {partidas.map((p,i) => (
            <tr key={i} style={{ background:i%2===0?"#EBF5FF":"white" }}>
              <td style={{ padding:"7px 10px", fontSize:11, borderBottom:"1px solid #D4E8F5" }}>{p.desc}</td>
              <td style={{ padding:"7px 10px", fontSize:11, borderBottom:"1px solid #D4E8F5", textAlign:"center" }}>{p.unidad}</td>
              <td style={{ padding:"7px 10px", fontSize:11, borderBottom:"1px solid #D4E8F5", textAlign:"center" }}>{p.cant}</td>
              <td style={{ padding:"7px 10px", fontSize:11, borderBottom:"1px solid #D4E8F5", textAlign:"right" }}>{mxn(p.precio)}</td>
              <td style={{ padding:"7px 10px", fontSize:11, borderBottom:"1px solid #D4E8F5", textAlign:"right", fontWeight:600 }}>{mxn(p.importe)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Totals */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", marginBottom:14 }}>
        {[["Subtotal (sin IVA)", mxn(subtotal)],["IVA 16%", mxn(iva)]].map(([k,v]) => (
          <div key={k} style={{ display:"flex", gap:40, fontSize:13, color:"#4A6278", padding:"3px 0" }}><span>{k}</span><span>{v}</span></div>
        ))}
        <div style={{ background:"#1D6FA4", color:"white", padding:"10px 20px", borderRadius:7, display:"flex", gap:40, fontWeight:800, fontSize:15, marginTop:4 }}>
          <span>TOTAL</span><span>{mxn(total)}</span>
        </div>
      </div>
      {/* Pagos */}
      <div style={{ color:"#1D6FA4", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", margin:"14px 0 8px" }}>FORMA DE PAGO</div>
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        {[["Anticipo (40%)", total*0.4,"Al inicio"],["Segunda (30%)", total*0.3,"Al 50% avance"],["Finiquito (30%)", total*0.3,"A la entrega"]].map(([l,v,w]) => (
          <div key={l} style={{ flex:1, border:"1px solid #D4E8F5", borderRadius:8, padding:12, background:"#EBF5FF", textAlign:"center" }}>
            <div style={{ color:"#1D6FA4", fontWeight:700, fontSize:12 }}>{l}</div>
            <div style={{ color:"#1A2B3C", fontWeight:800, fontSize:15, marginTop:2 }}>{mxn(v)}</div>
            <div style={{ color:"#4A6278", fontSize:11 }}>{w}</div>
          </div>
        ))}
      </div>
      {/* Notas */}
      <ul style={{ color:"#4A6278", fontSize:11, paddingLeft:18, lineHeight:1.9, background:"#F7FBFF", border:"1px solid #D4E8F5", borderRadius:8, padding:"12px 12px 12px 24px", marginBottom:14 }}>
        {["Los precios incluyen mano de obra especializada y materiales de primera calidad.",
          "Tiempo estimado de construcción: 45–60 días hábiles.",
          "No incluye: permisos municipales, jardín o área de terraza.",
          "Garantía de 12 meses en impermeabilización y equipos instalados.",
          "Precios en Pesos Mexicanos (MXN). IVA desglosado al 16%."].map(n => <li key={n}>{n}</li>)}
      </ul>
      {/* Firmas */}
      <div style={{ display:"flex", gap:40, marginTop:40 }}>
        {[["Firma del Cliente", contact.nombre],["Autorizado por", CONFIG.empresa.nombre]].map(([l,n]) => (
          <div key={l} style={{ flex:1, textAlign:"center" }}>
            <div style={{ borderTop:"1.5px solid #D4E8F5", paddingTop:8 }}>
              <div style={{ fontWeight:600, fontSize:12 }}>{n}</div>
              <div style={{ color:"#4A6278", fontSize:11 }}>{l}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", color:"#8AA5BA", fontSize:11, marginTop:16, fontStyle:"italic" }}>
        ¡Gracias por su preferencia! Estamos a sus órdenes para cualquier consulta.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════
const layout = {
  wrap: { minHeight:"100vh", background:"var(--c-bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:"24px 16px 80px", fontFamily:"'Georgia',serif" },
  header: { width:"100%", maxWidth:560, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 },
  card: { width:"100%", maxWidth:560, background:"var(--c-white)", borderRadius:20, border:"1px solid var(--c-border)", padding:"32px 28px", boxShadow:"0 4px 24px rgba(29,111,164,0.08)" },
  notice: { background:"var(--c-primary-lt)", border:"1px solid var(--c-primary-mid)", borderRadius:10, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start" },
  successBanner: { width:"100%", maxWidth:860, background:"white", borderRadius:14, border:"1px solid var(--c-border)", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, boxShadow:"0 2px 12px rgba(29,111,164,0.07)" },
  quotWrap: { width:"100%", maxWidth:860, background:"white", borderRadius:14, border:"1px solid var(--c-border)", padding:"24px 28px", boxShadow:"0 2px 12px rgba(29,111,164,0.07)", marginBottom:16 },
};

const ty = {
  h1: { color:"var(--c-text)", fontSize:24, fontWeight:700, lineHeight:1.25, margin:"0 0 8px", fontFamily:"Georgia,serif" },
  label: { display:"block", color:"var(--c-text-mid)", fontSize:11, letterSpacing:"0.5px", textTransform:"uppercase", fontWeight:600, marginBottom:5, fontFamily:"sans-serif" },
};

const form = {
  input: { background:"var(--c-bg)", border:"1.5px solid var(--c-border)", borderRadius:10, padding:"11px 14px", color:"var(--c-text)", fontSize:15, fontFamily:"sans-serif", outline:"none", width:"100%", boxSizing:"border-box", transition:"border 0.2s" },
  inputErr: { borderColor:"#DC2626" },
  errMsg: { color:"#DC2626", fontSize:11, fontFamily:"sans-serif", marginTop:3 },
  checkLabel: { display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", userSelect:"none", marginTop:4 },
  checkbox: { width:20, height:20, minWidth:20, borderRadius:5, border:"1.5px solid var(--c-border)", background:"white", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", color:"white" },
  checkboxOn: { background:"var(--c-primary)", borderColor:"var(--c-primary)" },
};

const btn = {
  primary: { width:"100%", padding:"13px 20px", background:"var(--c-primary)", border:"none", borderRadius:12, color:"white", fontSize:15, fontWeight:700, fontFamily:"sans-serif", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 14px rgba(29,111,164,0.25)", transition:"background 0.2s" },
  ghost: { background:"none", border:"1.5px solid var(--c-border)", borderRadius:10, color:"var(--c-text-mid)", fontSize:13, cursor:"pointer", fontFamily:"sans-serif", padding:"8px 16px" },
  waLink: { display:"flex", alignItems:"center", gap:8, justifyContent:"center", marginTop:14, color:"#0E9060", fontSize:13, fontWeight:600, fontFamily:"sans-serif", textDecoration:"none", padding:"10px 16px", background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:10 },
  row: { background:"var(--c-white)", border:"1.5px solid var(--c-border)", borderRadius:12, padding:"13px 14px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", textAlign:"left", fontFamily:"sans-serif", transition:"all 0.2s", width:"100%" },
  rowHov: { background:"var(--c-primary-lt)", borderColor:"var(--c-primary-mid)" },
  rowTitle: { color:"var(--c-text)", fontSize:14, fontWeight:600, marginBottom:2 },
  rowSub: { color:"var(--c-text-mid)", fontSize:11 },
};

const card = {
  base: { background:"var(--c-white)", border:"1.5px solid var(--c-border)", borderRadius:14, cursor:"pointer", display:"flex", transition:"all 0.2s", fontFamily:"sans-serif", width:"100%" },
  hov: { background:"var(--c-primary-lt)", borderColor:"var(--c-primary)" },
  imgBox: { width:64, height:64, background:"var(--c-primary-lt)", borderRadius:8, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, flexShrink:0, position:"relative", overflow:"hidden" },
  imgLabel: { fontSize:9, color:"var(--c-text-lt)", fontFamily:"sans-serif", position:"absolute", bottom:3 },
  chip: { background:"var(--c-white)", border:"1.5px solid var(--c-border)", borderRadius:10, padding:"10px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all 0.2s", fontFamily:"sans-serif" },
  chipHov: { background:"var(--c-primary-lt)", borderColor:"var(--c-primary-mid)" },
  chipOn: { background:"var(--c-primary-lt)", borderColor:"var(--c-primary)" },
};
