# 🏊 Albercas GDL — Roadmap de Migración a Next.js
## De HTML estático → ERP/CRM completo para alberqueros

> **Versión:** 1.0 | **Tecnología:** Next.js 15 + Supabase + Tailwind CSS  
> **Objetivo:** Sistema escalable tipo BINDERP adaptado al negocio de albercas

---

## 🗺️ VISIÓN GENERAL DEL SISTEMA

```
albercas-erp/
├── 🌐 Web pública       → /cotizador       (leads + cotizaciones)
├── 🏢 Panel ERP/CRM     → /admin           (gestión interna)
└── 🗄️ Base de datos     → Supabase         (PostgreSQL + Auth + Storage)
```

**Módulos actuales (Fase 1 y 2):**
- Cotizador web público con captura de leads
- Panel admin: gestión de cotizaciones y leads

**Módulos futuros (Fase 3+):**
- CRM completo (pipeline, seguimiento, historial de clientes)
- Inventario de materiales y equipamiento
- Generación de cotizaciones formales (PDF con firma)
- Módulo de proyectos y obra
- Facturación y finanzas
- Reportes y analytics

---

## 📦 STACK TECNOLÓGICO

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Next.js 15** (App Router) | SSR, rutas API, escalable, estándar industria |
| Estilos | **Tailwind CSS v4** | Utility-first, rápido, consistente |
| UI Components | **shadcn/ui** | Componentes listos, accesibles, personalizables |
| Base de datos | **Supabase** (PostgreSQL) | Auth + DB + Storage + Realtime en uno |
| ORM | **Drizzle ORM** | Type-safe, liviano, compatible con Supabase |
| Autenticación | **Supabase Auth** | SSO, magic link, roles y permisos |
| PDF | **@react-pdf/renderer** | PDFs de cotizaciones desde React |
| Email | **Resend** | Emails transaccionales profesionales |
| Estado global | **Zustand** | Simple, escalable, sin boilerplate |
| Formularios | **React Hook Form + Zod** | Validación type-safe |
| Tablas/grids | **TanStack Table** | Tablas avanzadas para el ERP |
| Gráficas | **Recharts** | Charts para dashboard |
| Deploy | **Vercel** | CI/CD automático, preview por rama |

---

## 🗄️ FASE 0 — CONFIGURACIÓN DEL PROYECTO
### Tiempo estimado: 2-3 horas
### Herramienta: Terminal en VS Code

---

### PASO 0.1 — Instalar herramientas necesarias

Antes de empezar, verifica que tienes instalado:

```bash
# Verificar Node.js (necesitas v18+)
node --version

# Verificar npm
npm --version

# Si no tienes Node, descárgalo desde nodejs.org
```

Instala Claude Code (si no lo tienes):
```bash
npm install -g @anthropic-ai/claude-code
```

---

### PASO 0.2 — Crear el proyecto Next.js

Abre la terminal en VS Code (`Ctrl + `` ` ``) y ejecuta:

```bash
# Crear proyecto con configuración recomendada
npx create-next-app@latest albercas-erp \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# Entrar al proyecto
cd albercas-erp

# Abrir en VS Code
code .
```

Cuando te pregunte, elige:
- ✅ TypeScript → **Yes**
- ✅ ESLint → **Yes**
- ✅ Tailwind CSS → **Yes**
- ✅ `src/` directory → **Yes**
- ✅ App Router → **Yes**
- ✅ Import alias → **Yes** (`@/*`)

---

### PASO 0.3 — Instalar dependencias

```bash
# UI Components (shadcn)
npx shadcn@latest init

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# ORM
npm install drizzle-orm drizzle-kit pg
npm install -D @types/pg

# Formularios y validación
npm install react-hook-form @hookform/resolvers zod

# Estado global
npm install zustand

# PDF
npm install @react-pdf/renderer

# Email
npm install resend

# Tablas avanzadas
npm install @tanstack/react-table

# Gráficas
npm install recharts

# Utilidades
npm install date-fns clsx tailwind-merge lucide-react

# Tipos
npm install -D @types/node
```

---

### PASO 0.4 — Configurar variables de entorno

Crea el archivo `.env.local` en la raíz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=523312345678

# Empresa
NEXT_PUBLIC_EMPRESA_NOMBRE="Albercas GDL"
NEXT_PUBLIC_EMPRESA_EMAIL=contacto@albercas.com.mx
NEXT_PUBLIC_EMPRESA_TEL=(33) 1234-5678
```

> ⚠️ Agrega `.env.local` a tu `.gitignore` (ya viene por defecto en Next.js)

---

### PASO 0.5 — Crear cuenta en Supabase

1. Ve a **supabase.com** → crear cuenta gratuita
2. Clic en **"New Project"**
3. Nombre: `albercas-erp`
4. Región: `South America (São Paulo)` ← la más cercana a GDL
5. Copia la **URL** y **anon key** del Project Settings → API
6. Pégalos en tu `.env.local`

---

## 📁 ESTRUCTURA DE ARCHIVOS DEL PROYECTO

Esta es la estructura completa que debes crear:

```
albercas-erp/
├── src/
│   ├── app/                          # App Router de Next.js
│   │   ├── (public)/                 # Grupo: rutas públicas
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── cotizador/
│   │   │   │   └── page.tsx          # Cotizador web (12 pasos)
│   │   │   └── layout.tsx            # Layout público (header/footer)
│   │   │
│   │   ├── (admin)/                  # Grupo: panel admin
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── cotizaciones/
│   │   │   │   │   ├── page.tsx      # Lista de cotizaciones
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Detalle de cotización
│   │   │   │   ├── leads/
│   │   │   │   │   └── page.tsx      # CRM de leads
│   │   │   │   ├── precios/
│   │   │   │   │   └── page.tsx      # Editor de precios
│   │   │   │   └── exportar/
│   │   │   │       └── page.tsx      # Exportar datos
│   │   │   └── layout.tsx            # Layout admin (sidebar)
│   │   │
│   │   ├── auth/                     # Autenticación
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── cotizaciones/
│   │   │   │   ├── route.ts          # GET /api/cotizaciones (lista)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET/PUT/DELETE por ID
│   │   │   ├── leads/
│   │   │   │   └── route.ts          # POST crear lead
│   │   │   ├── precios/
│   │   │   │   └── route.ts          # GET/PUT precios config
│   │   │   └── pdf/
│   │   │       └── route.ts          # POST generar PDF cotización
│   │   │
│   │   ├── globals.css               # Estilos globales + CSS vars
│   │   └── layout.tsx                # Root layout
│   │
│   ├── components/                   # Componentes reutilizables
│   │   ├── ui/                       # shadcn/ui (auto-generados)
│   │   ├── cotizador/                # Componentes del cotizador
│   │   │   ├── CotizadorWizard.tsx   # Contenedor principal
│   │   │   ├── steps/               # Cada paso del wizard
│   │   │   │   ├── Step1Tipo.tsx
│   │   │   │   ├── Step2Forma.tsx
│   │   │   │   ├── Step3Medidas.tsx
│   │   │   │   ├── Step4Profundidad.tsx
│   │   │   │   ├── Step5Recubrimiento.tsx
│   │   │   │   ├── Step6Material.tsx
│   │   │   │   ├── Step7Extras.tsx
│   │   │   │   ├── Step8Equipamiento.tsx
│   │   │   │   ├── Step9Datos.tsx
│   │   │   │   └── Step10Resultado.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── FloatEstimado.tsx
│   │   │   └── ResultadoPDF.tsx
│   │   │
│   │   ├── admin/                    # Componentes del panel
│   │   │   ├── Sidebar.tsx           # Navegación lateral
│   │   │   ├── Topbar.tsx            # Barra superior
│   │   │   ├── StatsCard.tsx         # Tarjeta de KPI
│   │   │   ├── CotizacionesTable.tsx # Tabla principal
│   │   │   ├── CotizacionDrawer.tsx  # Panel lateral de detalle
│   │   │   ├── PreciosEditor.tsx     # Editor de precios inline
│   │   │   └── charts/
│   │   │       ├── BarChart.tsx
│   │   │       └── DonutChart.tsx
│   │   │
│   │   └── shared/                   # Compartidos
│   │       ├── OptCard.tsx           # Tarjeta de opción seleccionable
│   │       ├── MaterialCard.tsx      # Card con imagen de material
│   │       ├── CheckItem.tsx         # Checkbox estilizado
│   │       └── StatusBadge.tsx       # Badge de estado
│   │
│   ├── lib/                          # Lógica y utilidades
│   │   ├── supabase/
│   │   │   ├── client.ts             # Cliente Supabase (browser)
│   │   │   ├── server.ts             # Cliente Supabase (server)
│   │   │   └── middleware.ts         # Auth middleware
│   │   ├── db/
│   │   │   ├── schema.ts             # Schema Drizzle (tablas)
│   │   │   ├── queries.ts            # Queries reutilizables
│   │   │   └── migrations/           # Migraciones SQL
│   │   ├── calculadora.ts            # Motor de cálculo (precios)
│   │   ├── pdf.ts                    # Generador de PDFs
│   │   ├── email.ts                  # Plantillas de email
│   │   └── utils.ts                  # Formateo, helpers
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useCotizador.ts           # Estado del wizard
│   │   ├── useCotizaciones.ts        # CRUD cotizaciones
│   │   ├── usePrecios.ts             # Leer/editar precios
│   │   └── useAuth.ts                # Sesión de usuario
│   │
│   ├── stores/                       # Estado global (Zustand)
│   │   ├── cotizadorStore.ts         # Estado de los 12 pasos
│   │   └── adminStore.ts             # Filtros, selecciones admin
│   │
│   └── types/                        # TypeScript types
│       ├── cotizacion.ts             # Tipo Cotizacion
│       ├── lead.ts                   # Tipo Lead
│       ├── precios.ts                # Tipo Precios
│       └── supabase.ts               # Tipos generados de DB
│
├── public/
│   └── images/
│       ├── materiales/               # Fotos de membranas, mosaico, cuarzo
│       │   ├── pvc-lisa-azul.jpg
│       │   ├── pvc-3d.jpg
│       │   ├── mosaico-cancun.jpg
│       │   └── cuarzo-arena.jpg
│       └── logo.svg
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Schema inicial de la DB
│
├── .env.local                        # Variables de entorno (NO subir a git)
├── .env.example                      # Ejemplo de variables (SÍ subir a git)
├── drizzle.config.ts                 # Configuración Drizzle ORM
├── middleware.ts                     # Middleware Next.js (proteger rutas admin)
├── next.config.ts                    # Configuración Next.js
├── tailwind.config.ts                # Configuración Tailwind
└── package.json
```

---

## 🗄️ FASE 1 — BASE DE DATOS (Supabase)
### Tiempo estimado: 1-2 horas
### Archivo clave: `supabase/migrations/001_initial_schema.sql`

---

### PASO 1.1 — Crear el schema SQL

Ve al **SQL Editor** de Supabase y ejecuta:

```sql
-- ════════════════════════════════════
-- TABLA: precios_config
-- Precios editables desde el admin
-- ════════════════════════════════════
CREATE TABLE precios_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clave TEXT UNIQUE NOT NULL,        -- ej: 'construccion_m2'
  nombre TEXT NOT NULL,              -- ej: 'Construcción por m²'
  categoria TEXT NOT NULL,           -- ej: 'Construcción'
  valor DECIMAL(12,2) NOT NULL,
  unidad TEXT DEFAULT '$',           -- ej: '$/m²'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales de precios
INSERT INTO precios_config (clave, nombre, categoria, valor, unidad) VALUES
  ('construccion_m2',   'Construcción por m²',      'Construcción',   3500,   '$/m²'),
  ('membrana_lisa',     'PVC Lisa Premium',          'Membrana',       1200,   '$/m²'),
  ('membrana_3d',       'PVC 3D Touch',              'Membrana',       1450,   '$/m²'),
  ('membrana_dis',      'PVC Diseños',               'Membrana',       1200,   '$/m²'),
  ('mosaico_m2',        'Mosaico veneciano',         'Mosaico',        980,    '$/m²'),
  ('cuarzo_m2',         'Cuarzo natural',            'Cuarzo',         1800,   '$/m²'),
  ('hidro_base',        'Red hidráulica (base)',     'Hidráulica',     50000,  '$'),
  ('hidro_m',           'Red hidráulica (por metro)','Hidráulica',     900,    '$/m'),
  ('extra_jacuzzi',     'Jacuzzi integrado',         'Extras',         35000,  '$'),
  ('extra_chapot',      'Chapoteadero',              'Extras',         22000,  '$'),
  ('extra_asol_m2',     'Asoleadero húmedo',         'Extras',         2800,   '$/m²'),
  ('extra_banca',       'Banco interior',            'Extras',         8000,   '$'),
  ('extra_escal',       'Escalones integrados',      'Extras',         12000,  '$'),
  ('equip_filtracion',  'Sistema de filtración',     'Equipamiento',   18000,  '$'),
  ('equip_sanitiz',     'Sistema sanitización',      'Equipamiento',   12000,  '$'),
  ('equip_autom',       'Automatización',            'Equipamiento',   25000,  '$'),
  ('equip_clorosal',    'Cloro por sal',             'Equipamiento',   22000,  '$'),
  ('equip_ilum',        'Iluminación LED',           'Equipamiento',   13275,  '$'),
  ('equip_calef',       'Calefacción',               'Equipamiento',   28000,  '$'),
  ('equip_jacuzzi',     'Equipo de jacuzzi',         'Equipamiento',   18000,  '$');


-- ════════════════════════════════════
-- TABLA: leads
-- Datos del cliente potencial
-- ════════════════════════════════════
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  ciudad TEXT,
  fuente TEXT DEFAULT 'cotizador_web', -- de dónde vino el lead
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ════════════════════════════════════
-- TABLA: cotizaciones
-- Cotización completa generada por el wizard
-- ════════════════════════════════════
CREATE TABLE cotizaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folio TEXT UNIQUE NOT NULL,        -- ej: 'COT-28531'

  -- Lead asociado
  lead_id UUID REFERENCES leads(id),

  -- Especificaciones técnicas
  tipo TEXT NOT NULL,                -- residencial | comercial | infinity | carril
  forma TEXT NOT NULL,               -- rectangular | cuadrada | ovalada
  largo DECIMAL(8,2) NOT NULL,
  ancho DECIMAL(8,2) NOT NULL,
  prof_min DECIMAL(6,2),
  prof_max DECIMAL(6,2),
  prof_prom DECIMAL(6,2),
  recubrimiento TEXT,                -- membrana | mosaico | cuarzo
  material_sub TEXT,                 -- pvc-lisa | pvc-3d | cancun | arena...

  -- Extras y equipamiento (arrays de strings)
  extras TEXT[] DEFAULT '{}',        -- ['jacuzzi','chapoteadero',...]
  equipamiento TEXT[] DEFAULT '{}',  -- ['filtracion','iluminacion',...]

  -- Desglose de costos (JSON)
  desglose JSONB,                    -- [{label, valor}, ...]

  -- Totales
  total DECIMAL(12,2) NOT NULL,
  multiplicador DECIMAL(4,2) DEFAULT 1.0,

  -- Estado en el CRM
  estado TEXT DEFAULT 'pendiente',   -- pendiente | seguimiento | ganado | perdido
  nota_interna TEXT,
  asignado_a UUID,                   -- usuario del admin asignado

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizaciones_lead ON cotizaciones(lead_id);
CREATE INDEX idx_cotizaciones_created ON cotizaciones(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);


-- ════════════════════════════════════
-- TABLA: actividades (CRM futuro)
-- Historial de interacciones con el lead
-- ════════════════════════════════════
CREATE TABLE actividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id),
  tipo TEXT NOT NULL,                -- nota | llamada | email | visita | estado_cambio
  descripcion TEXT,
  usuario_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Solo admins autenticados acceden al admin
-- El cotizador web es público (anon puede insertar)
-- ════════════════════════════════════

-- leads: anon puede insertar (cotizador), solo autenticados pueden leer
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_insert_public" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_read_admin" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "leads_update_admin" ON leads FOR UPDATE USING (auth.role() = 'authenticated');

-- cotizaciones: igual que leads
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cot_insert_public" ON cotizaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "cot_read_admin" ON cotizaciones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "cot_update_admin" ON cotizaciones FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "cot_delete_admin" ON cotizaciones FOR DELETE USING (auth.role() = 'authenticated');

-- precios_config: solo lectura pública, escritura solo admin
ALTER TABLE precios_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "precios_read_all" ON precios_config FOR SELECT USING (true);
CREATE POLICY "precios_write_admin" ON precios_config FOR UPDATE USING (auth.role() = 'authenticated');

-- actividades: solo admin
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "act_all_admin" ON actividades USING (auth.role() = 'authenticated');


-- ════════════════════════════════════
-- FUNCIÓN: updated_at automático
-- ════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cotizaciones_updated_at
  BEFORE UPDATE ON cotizaciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER precios_updated_at
  BEFORE UPDATE ON precios_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

### PASO 1.2 — Crear usuario admin en Supabase

1. En Supabase → **Authentication** → **Users**
2. Clic en **"Add User"**
3. Email: `admin@albercas.com.mx`
4. Password: (elige uno seguro)
5. ✅ **Auto Confirm User**

---

## 🧠 FASE 2 — LÓGICA BASE (Archivos core)
### Tiempo estimado: 2-3 horas

---

### PASO 2.1 — Clientes de Supabase

**Archivo:** `src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Archivo:** `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )
}
```

---

### PASO 2.2 — Motor de cálculo

**Archivo:** `src/lib/calculadora.ts`
```typescript
// Motor de cálculo extraído de CALCULOS.xlsx
// Este archivo es la fuente de verdad de todas las fórmulas

export interface Precios {
  construccion_m2: number
  membrana_lisa: number
  membrana_3d: number
  membrana_dis: number
  mosaico_m2: number
  cuarzo_m2: number
  hidro_base: number
  hidro_m: number
  extra_jacuzzi: number
  extra_chapot: number
  extra_asol_m2: number
  extra_banca: number
  extra_escal: number
  equip_filtracion: number
  equip_sanitiz: number
  equip_autom: number
  equip_clorosal: number
  equip_ilum: number
  equip_calef: number
  equip_jacuzzi: number
}

export interface InputCotizacion {
  tipo: 'residencial' | 'comercial' | 'infinity' | 'carril'
  largo: number
  ancho: number
  profProm: number
  recubrimiento: 'membrana' | 'mosaico' | 'cuarzo'
  materialSub: string
  extras: Record<string, boolean>
  equip: Record<string, boolean>
}

export interface LineaCosto {
  icono: string
  label: string
  valor: number
}

export interface ResultadoCalculo {
  items: LineaCosto[]
  total: number
  area: number
  areaMembrana: number
  perimetro: number
  litros: number
  multiplicador: number
}

const MULTIPLICADORES: Record<string, number> = {
  residencial: 1.00,
  comercial: 1.25,
  infinity: 1.35,
  carril: 1.40,
}

export function calcular(input: InputCotizacion, precios: Precios): ResultadoCalculo {
  const { largo: L, ancho: A, profProm: Pr, tipo, recubrimiento, materialSub, extras, equip } = input

  // Geometría base
  const area = L * A
  const perimetro = 2 * (L + A)
  const muros = perimetro * Pr
  const areaTotal = area + muros
  const areaMembrana = areaTotal * 1.05  // 5% traslape
  const litros = Math.round(area * Pr * 1000)
  const multiplicador = MULTIPLICADORES[tipo] ?? 1.0

  const items: LineaCosto[] = []

  // Construcción y excavación
  items.push({
    icono: '🏗️',
    label: 'Construcción y excavación',
    valor: Math.round(areaTotal * precios.construccion_m2 * multiplicador),
  })

  // Recubrimiento
  if (recubrimiento === 'membrana') {
    const px = materialSub === 'pvc-3d' ? precios.membrana_3d
             : materialSub === 'pvc-dis' ? precios.membrana_dis
             : precios.membrana_lisa
    items.push({ icono: '🔷', label: 'Membrana PVC', valor: Math.round(areaMembrana * px) })
  } else if (recubrimiento === 'mosaico') {
    items.push({ icono: '🔲', label: 'Mosaico veneciano', valor: Math.round(areaMembrana * precios.mosaico_m2) })
  } else if (recubrimiento === 'cuarzo') {
    items.push({ icono: '🪨', label: 'Cuarzo natural', valor: Math.round(areaMembrana * precios.cuarzo_m2) })
  }

  // Red hidráulica
  items.push({
    icono: '💧',
    label: 'Red hidráulica',
    valor: Math.round(precios.hidro_base + perimetro * precios.hidro_m),
  })

  // Extras estructurales
  if (extras.jacuzzi)      items.push({ icono: '🌀', label: 'Jacuzzi integrado',    valor: precios.extra_jacuzzi })
  if (extras.chapoteadero) items.push({ icono: '👶', label: 'Chapoteadero',         valor: precios.extra_chapot })
  if (extras.asoleadero) {
    const m2 = Math.min(L * 1.8, 18)
    items.push({ icono: '☀️', label: 'Asoleadero húmedo', valor: Math.round(m2 * precios.extra_asol_m2) })
  }
  if (extras.banca)     items.push({ icono: '🛋️', label: 'Banco interior',        valor: precios.extra_banca })
  if (extras.escalones) items.push({ icono: '🪜', label: 'Escalones integrados',   valor: precios.extra_escal })

  // Equipamiento
  if (equip.filtracion)    items.push({ icono: '🔄', label: 'Sistema de filtración',   valor: precios.equip_filtracion })
  if (equip.sanitizacion)  items.push({ icono: '🧪', label: 'Sistema de sanitización', valor: precios.equip_sanitiz })
  if (equip.automatizacion)items.push({ icono: '📱', label: 'Automatización',          valor: precios.equip_autom })
  if (equip.clorosal)      items.push({ icono: '🧂', label: 'Cloro por sal',           valor: precios.equip_clorosal })
  if (equip.iluminacion)   items.push({ icono: '💡', label: 'Iluminación LED RGB',     valor: precios.equip_ilum })
  if (equip.calefaccion)   items.push({ icono: '🌡️', label: 'Equipo de calefacción',  valor: precios.equip_calef })
  if (equip.eqjacuzzi)     items.push({ icono: '💨', label: 'Equipo para jacuzzi',     valor: precios.equip_jacuzzi })

  const total = items.reduce((s, i) => s + i.valor, 0)

  return { items, total, area, areaMembrana, perimetro, litros, multiplicador }
}
```

---

### PASO 2.3 — Store del cotizador (Zustand)

**Archivo:** `src/stores/cotizadorStore.ts`
```typescript
import { create } from 'zustand'

interface CotizadorState {
  // Paso actual
  paso: number
  setPaso: (p: number) => void

  // Datos del wizard
  tipo: string | null
  forma: string | null
  largo: number | null
  ancho: number | null
  profMin: number | null
  profMax: number | null
  profProm: number | null
  recubrimiento: string | null
  materialSub: string | null
  extras: Record<string, boolean>
  equip: Record<string, boolean>
  nombre: string
  email: string
  telefono: string
  ciudad: string

  // Setters
  setTipo: (v: string) => void
  setForma: (v: string) => void
  setMedidas: (largo: number, ancho: number) => void
  setProfundidad: (min: number, max: number) => void
  setRecubrimiento: (v: string) => void
  setMaterialSub: (v: string) => void
  toggleExtra: (v: string) => void
  toggleEquip: (v: string) => void
  setDatosCliente: (datos: { nombre: string; email: string; telefono: string; ciudad?: string }) => void

  // Reset
  reset: () => void
}

const initial = {
  paso: 1, tipo: null, forma: null, largo: null, ancho: null,
  profMin: null, profMax: null, profProm: null, recubrimiento: null,
  materialSub: null, extras: {}, equip: {},
  nombre: '', email: '', telefono: '', ciudad: '',
}

export const useCotizadorStore = create<CotizadorState>((set) => ({
  ...initial,
  setPaso: (p) => set({ paso: p }),
  setTipo: (v) => set({ tipo: v }),
  setForma: (v) => set({ forma: v }),
  setMedidas: (largo, ancho) => set({ largo, ancho }),
  setProfundidad: (min, max) => set({ profMin: min, profMax: max, profProm: (min + max) / 2 }),
  setRecubrimiento: (v) => set({ recubrimiento: v }),
  setMaterialSub: (v) => set({ materialSub: v }),
  toggleExtra: (v) => set((s) => ({
    extras: { ...s.extras, [v]: !s.extras[v] }
  })),
  toggleEquip: (v) => set((s) => ({
    equip: { ...s.equip, [v]: !s.equip[v] }
  })),
  setDatosCliente: (d) => set({ ...d }),
  reset: () => set(initial),
}))
```

---

### PASO 2.4 — Middleware de autenticación

**Archivo:** `middleware.ts` (en la raíz, no en src/)
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger todas las rutas /admin/*
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## 🌐 FASE 3 — COTIZADOR WEB
### Tiempo estimado: 4-6 horas
### Archivos clave: `src/app/(public)/cotizador/` + `src/components/cotizador/`

**Orden de creación de archivos:**

```
1. src/stores/cotizadorStore.ts          ← Ya creado en Fase 2
2. src/lib/calculadora.ts               ← Ya creado en Fase 2
3. src/components/cotizador/steps/Step1Tipo.tsx
4. src/components/cotizador/steps/Step2Forma.tsx
5. src/components/cotizador/steps/Step3Medidas.tsx
6. src/components/cotizador/steps/Step4Profundidad.tsx
7. src/components/cotizador/steps/Step5Recubrimiento.tsx
8. src/components/cotizador/steps/Step6Material.tsx
9. src/components/cotizador/steps/Step7Extras.tsx
10. src/components/cotizador/steps/Step8Equipamiento.tsx
11. src/components/cotizador/steps/Step9Datos.tsx
12. src/components/cotizador/steps/Step10Resultado.tsx
13. src/components/cotizador/ProgressBar.tsx
14. src/components/cotizador/FloatEstimado.tsx
15. src/components/cotizador/CotizadorWizard.tsx   ← Contenedor que une todo
16. src/app/(public)/cotizador/page.tsx            ← Página final
```

**API Route para guardar cotización:**

**Archivo:** `src/app/api/cotizaciones/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createClient()

  // 1. Crear o encontrar lead
  const { data: lead } = await supabase
    .from('leads')
    .upsert({ nombre: body.nombre, email: body.email, telefono: body.telefono, ciudad: body.ciudad },
             { onConflict: 'email' })
    .select()
    .single()

  // 2. Crear cotización
  const folio = 'COT-' + Date.now().toString().slice(-5)
  const { data: cotizacion, error } = await supabase
    .from('cotizaciones')
    .insert({
      folio,
      lead_id: lead?.id,
      tipo: body.tipo,
      forma: body.forma,
      largo: body.largo,
      ancho: body.ancho,
      prof_min: body.profMin,
      prof_max: body.profMax,
      prof_prom: body.profProm,
      recubrimiento: body.recubrimiento,
      material_sub: body.materialSub,
      extras: body.extras,
      equipamiento: body.equip,
      desglose: body.desglose,
      total: body.total,
      multiplicador: body.multiplicador,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json({ cotizacion, folio })
}
```

---

## 🏢 FASE 4 — PANEL ADMIN (ERP)
### Tiempo estimado: 6-8 horas
### Archivos clave: `src/app/(admin)/admin/` + `src/components/admin/`

**Orden de creación:**

```
1. src/components/admin/Sidebar.tsx
2. src/components/admin/Topbar.tsx
3. src/app/(admin)/layout.tsx               ← Layout con sidebar + topbar
4. src/components/admin/StatsCard.tsx
5. src/components/admin/charts/BarChart.tsx
6. src/components/admin/charts/DonutChart.tsx
7. src/app/(admin)/admin/page.tsx           ← Dashboard
8. src/components/admin/CotizacionesTable.tsx
9. src/components/admin/CotizacionDrawer.tsx
10. src/app/(admin)/admin/cotizaciones/page.tsx
11. src/app/(admin)/admin/cotizaciones/[id]/page.tsx
12. src/components/admin/PreciosEditor.tsx
13. src/app/(admin)/admin/precios/page.tsx
14. src/app/(admin)/admin/exportar/page.tsx
```

---

## 🔐 FASE 5 — AUTENTICACIÓN
### Tiempo estimado: 1-2 horas

**Archivo:** `src/app/auth/login/page.tsx`

Login con email/password usando Supabase Auth.
El middleware ya protege `/admin/*` automáticamente.

---

## 📊 RESUMEN DE FASES Y TIEMPOS

| Fase | Descripción | Tiempo | Prioridad |
|------|-------------|--------|-----------|
| 0 | Setup inicial del proyecto | 2-3 h | 🔴 Crítico |
| 1 | Base de datos Supabase | 1-2 h | 🔴 Crítico |
| 2 | Lógica base (calculadora, store, middleware) | 2-3 h | 🔴 Crítico |
| 3 | Cotizador web (12 pasos) | 4-6 h | 🟠 Alta |
| 4 | Panel admin (ERP básico) | 6-8 h | 🟠 Alta |
| 5 | Autenticación | 1-2 h | 🟠 Alta |
| 6 | PDF de cotizaciones | 2-3 h | 🟡 Media |
| 7 | Emails automáticos | 2-3 h | 🟡 Media |
| 8 | Deploy a Vercel | 1 h | 🟡 Media |
| 9 | Dominio + Hostinger redirect | 1 h | 🟢 Baja |

**Total estimado: 22-31 horas de desarrollo**

---

## 🤖 CÓMO USAR CLAUDE CODE EN CADA FASE

Claude Code es tu par programmer en la terminal. Úsalo así:

```bash
# Dentro de la carpeta del proyecto
cd albercas-erp
claude

# Comandos útiles en Claude Code:
# "Crea el componente Step1Tipo en src/components/cotizador/steps/"
# "Migra el HTML del cotizador al componente CotizadorWizard.tsx"
# "Genera los tipos TypeScript para la tabla cotizaciones de Supabase"
# "Crea la API route para guardar cotizaciones en Supabase"
# "Agrega el sidebar de navegación al layout del admin"
```

**Flujo recomendado con Claude Code:**
1. Abre VS Code en la carpeta del proyecto
2. Abre terminal integrada (`Ctrl + `` ` ``)
3. Ejecuta `claude` para iniciar sesión interactiva
4. Dale contexto: *"Estoy construyendo un cotizador/ERP para albercas en Next.js"*
5. Pídele archivo por archivo siguiendo este roadmap

---

## 🔮 ROADMAP FUTURO (Fase 3+)

Módulos para convertirlo en ERP/CRM completo para alberqueros:

### CRM Avanzado
- [ ] Pipeline visual tipo Kanban (arrastrar leads entre etapas)
- [ ] Historial completo de interacciones por cliente
- [ ] Recordatorios y seguimiento automatizado
- [ ] Integración WhatsApp Business API

### Cotizaciones formales
- [ ] Generador de cotizaciones PDF con membrete y firma
- [ ] Envío automático por email al cliente
- [ ] Versión web de la cotización con link único
- [ ] Aprobación digital del cliente

### Inventario
- [ ] Catálogo de materiales con stock
- [ ] Alertas de stock mínimo
- [ ] Integración con proveedores
- [ ] Control de costos reales vs estimados

### Proyectos y obra
- [ ] Módulo de gestión de proyectos activos
- [ ] Control de avance por etapas
- [ ] Asignación de técnicos y cuadrillas
- [ ] Registro fotográfico de obra

### Finanzas
- [ ] Facturación (CFDI con PAC)
- [ ] Control de pagos y anticipos
- [ ] Cuentas por cobrar
- [ ] Reportes de rentabilidad por proyecto

### Analytics
- [ ] Dashboard de conversión (leads → contratos)
- [ ] Tasa de cierre por vendedor
- [ ] Análisis de precios vs competencia
- [ ] Forecast de ventas

---

## ✅ CHECKLIST PARA EMPEZAR HOY

```
□ Instalar Node.js v18+
□ Instalar VS Code
□ Instalar extensión Live Server en VS Code
□ Crear cuenta en Supabase (gratis)
□ Crear cuenta en Vercel (gratis)
□ Ejecutar: npx create-next-app@latest albercas-erp
□ Instalar dependencias (ver Fase 0.3)
□ Crear .env.local con credenciales de Supabase
□ Ejecutar SQL del schema en Supabase (Fase 1.1)
□ Crear usuario admin en Supabase Auth
□ Empezar con Fase 2: lib/calculadora.ts
```

---

*Documento generado por tu socio técnico estratégico 🏊*
*Proyecto: Albercas GDL ERP/CRM · Guadalajara, Jalisco*
MDEOF