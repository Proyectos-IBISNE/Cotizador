# PROMPT MAESTRO — ALBERCAS GDL ERP/CRM
## Copia y pega esto en Claude Code al iniciar cada sesión de trabajo

---

## INSTRUCCIÓN PRINCIPAL

Eres el arquitecto de software y par programmer del proyecto **Albercas GDL ERP/CRM**.

Tu trabajo es guiarme paso a paso para construir este sistema desde cero usando **Next.js 15 + Supabase + Tailwind CSS + shadcn/ui**.

Antes de hacer cualquier cosa, lee y memoriza todo el contexto del proyecto que te proporciono abajo. Luego ejecuta exactamente lo que te pido en la sección "TAREA ACTUAL".

---

## CONTEXTO DEL PROYECTO

### ¿Qué estamos construyendo?
Un sistema ERP/CRM para una empresa de construcción de albercas en Guadalajara, Jalisco. El sistema tiene dos partes:

1. **Web pública** (`/cotizador`) — Wizard de 12 pasos para que clientes finales generen cotizaciones aproximadas y dejen sus datos (captura de leads).

2. **Panel admin** (`/admin`) — ERP interno donde el equipo gestiona los leads y cotizaciones recibidas. En el futuro crecerá con módulos de inventario, proyectos, CRM completo y facturación (estilo BINDERP pero para alberqueros).

3. **Base de datos** — Supabase (PostgreSQL) con Auth, Storage y API.

---

### Stack tecnológico
- **Framework:** Next.js 15 con App Router y TypeScript
- **Estilos:** Tailwind CSS v4 + shadcn/ui
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Estado global:** Zustand (para el wizard del cotizador)
- **Formularios:** React Hook Form + Zod
- **Tablas:** TanStack Table (para el ERP)
- **Gráficas:** Recharts (dashboard)
- **PDF:** @react-pdf/renderer
- **Email:** Resend
- **Deploy:** Vercel + dominio en Hostinger

---

### Paleta de colores (mantener siempre)
```
Naranja principal:  #FF5C1A   (--orange)
Naranja oscuro:     #CC4810   (--orange-dark)
Naranja claro:      #FF7A42   (--orange-light)
Naranja pale:       #FFF0E8   (--orange-pale)
Azul agua profundo: #0A3D5C   (--water)
Azul agua medio:    #1A6B8A   (--water-mid)
Azul agua claro:    #E8F4F8   (--water-light)
Fondo crema:        #FDFAF6   (--bg)
```
Tipografía: **Fraunces** (serif, para títulos) + **DM Sans** (para cuerpo)

---

### Estructura de carpetas del proyecto
```
albercas-erp/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx              ← Landing page
│   │   │   ├── cotizador/page.tsx    ← Cotizador 12 pasos
│   │   │   └── layout.tsx            ← Header + Footer público
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          ← Dashboard
│   │   │   │   ├── cotizaciones/page.tsx
│   │   │   │   ├── precios/page.tsx
│   │   │   │   └── exportar/page.tsx
│   │   │   └── layout.tsx            ← Sidebar + Topbar admin
│   │   ├── auth/login/page.tsx
│   │   └── api/
│   │       ├── cotizaciones/route.ts
│   │       ├── precios/route.ts
│   │       └── pdf/route.ts
│   ├── components/
│   │   ├── cotizador/steps/          ← Step1 al Step10
│   │   ├── admin/                    ← Sidebar, Topbar, Tables, Charts
│   │   └── shared/                   ← OptCard, CheckItem, StatusBadge
│   ├── lib/
│   │   ├── supabase/client.ts
│   │   ├── supabase/server.ts
│   │   ├── calculadora.ts            ← Motor de cálculo (fórmulas reales)
│   │   ├── email.ts
│   │   └── utils.ts
│   ├── stores/cotizadorStore.ts      ← Zustand (12 pasos)
│   ├── hooks/
│   └── types/
├── middleware.ts                     ← Protege /admin/*
├── .env.local
└── supabase/migrations/001_schema.sql
```

---

### Motor de cálculo (fórmulas reales del negocio)
Estas fórmulas vienen de la hoja de cálculo del cliente. Son la fuente de verdad:

```
Área espejo      = Largo × Ancho
Perímetro        = 2 × (Largo + Ancho)
Área muros       = Perímetro × Profundidad
Área total       = Área espejo + Área muros
Área membrana    = Área total × 1.05  (5% de traslape)
Litros           = Área espejo × Profundidad × 1000

Construcción     = Área total × $3,500/m² × multiplicador_tipo
Red hidráulica   = $50,000 + Perímetro × $900/m

Multiplicadores por tipo:
  Residencial = ×1.00
  Comercial   = ×1.25
  Infinity    = ×1.35
  Carril nado = ×1.40
```

Precios base actuales:
```
construccion_m2:  3500    membrana_lisa: 1200   membrana_3d:   1450
mosaico_m2:        980    cuarzo_m2:    1800    hidro_base:   50000
hidro_m:           900    jacuzzi:     35000    chapoteadero: 22000
asoleadero_m2:    2800    banca:        8000    escalones:    12000
filtracion:      18000    sanitizacion:12000    automatizacion:25000
clorosal:        22000    iluminacion: 13275    calefaccion:  28000
eq_jacuzzi:      18000
```

---

### Los 12 pasos del cotizador web
```
Paso 1:  Tipo         → Residencial / Comercial / Infinity / Carril de nado
Paso 2:  Forma        → Rectangular / Cuadrada / Ovalada / (Riñón próx.) / (Libre próx.)
Paso 3:  Medidas      → Estándares (Pequeña 3×5, Mediana 4×7, Grande 6×12, Profes. 25×50)
                         + inputs personalizados Largo / Ancho
Paso 4:  Profundidad  → Recreativa (1.0-1.2m) / Estándar (1.4-1.6m) / Profunda (1.7-2.0m)
                         + inputs personalizados min / max
Paso 5:  Recubrimiento → Membrana / Mosaico Veneciano / Cuarzo
Paso 6:  Material      → Condicional:
                         Si Membrana: Colores lisos / Diseños / 3D Touch
                         Si Mosaico:  Azul Cancún / Mezcla de azules / Diseños naturales
                         Si Cuarzo:   Arena / Piedra natural
Paso 7:  Extras        → Escalones / Asoleadero húmedo / Banco interior /
                         Chapoteadero / Jacuzzi integrado (multi-select)
Paso 8:  Equipamiento  → Filtración / Sanitización / Automatización / Cloro por sal /
                         Iluminación / Calefacción / Equipo jacuzzi (multi-select)
Paso 9:  Datos cliente → Nombre* / Email* / Teléfono* / Ciudad (opcional)
Paso 10: Resultado     → Precio total, desglose, specs, WhatsApp, email, imprimir
```

---

### Archivos de referencia ya creados (prototipos HTML)
Tenemos prototipos funcionales en HTML que debes usar como referencia visual y de lógica:

- `cotizador-albercas.html` — Cotizador completo con los 12 pasos funcionando
- `admin-panel.html` — Panel admin completo con dashboard, tablas, drawer de detalle y editor de precios
- `supabase-schema.sql` — Schema SQL completo listo para ejecutar en Supabase
- `supabase.js` — Lógica de queries para Supabase (referencia)
- `ROADMAP-ALBERCAS-ERP.md` — Plan completo del proyecto con todas las fases

> **IMPORTANTE:** Los prototipos HTML son la referencia de diseño y UX. Al migrar a Next.js debes respetar exactamente la paleta de colores, la tipografía, las animaciones y el flujo de pasos. No simplificar el diseño.

---

### Variables de entorno necesarias (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=523312345678
NEXT_PUBLIC_EMPRESA_NOMBRE=Albercas GDL
NEXT_PUBLIC_EMPRESA_EMAIL=contacto@albercas.com.mx
NEXT_PUBLIC_EMPRESA_TEL=(33) 1234-5678
```

---

## TAREA ACTUAL: FASE 0 — SETUP COMPLETO DEL PROYECTO

Ejecuta cada uno de estos pasos en orden. Confirma cada uno antes de continuar al siguiente.

### PASO 0.1 — Verificar entorno
```bash
node --version   # Necesita ser v18+
npm --version
git --version
```
Si Node no está instalado o es menor a v18, indícame cómo instalarlo primero.

### PASO 0.2 — Crear proyecto Next.js 15
Ejecuta exactamente este comando:
```bash
npx create-next-app@latest albercas-erp \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```
Cuando pregunte opciones interactivas, elige siempre la opción recomendada (Yes).

### PASO 0.3 — Entrar al proyecto
```bash
cd albercas-erp
```

### PASO 0.4 — Instalar todas las dependencias del proyecto
```bash
# Supabase
npm install @supabase/supabase-js @supabase/ssr

# shadcn/ui (inicializar después del paso anterior)
npx shadcn@latest init --defaults

# Formularios y validación
npm install react-hook-form @hookform/resolvers zod

# Estado global
npm install zustand

# Tablas avanzadas para el ERP
npm install @tanstack/react-table

# Gráficas para el dashboard
npm install recharts

# PDF de cotizaciones
npm install @react-pdf/renderer

# Email transaccional
npm install resend

# Utilidades de fechas e íconos
npm install date-fns lucide-react clsx tailwind-merge

# Tipos TypeScript
npm install -D @types/node
```

### PASO 0.5 — Instalar componentes de shadcn/ui que usaremos
```bash
npx shadcn@latest add button input label card badge dialog drawer
npx shadcn@latest add table tabs select textarea separator skeleton
npx shadcn@latest add dropdown-menu toast sonner
```

### PASO 0.6 — Crear estructura de carpetas
Crea todas las carpetas del proyecto (vacías con .gitkeep si es necesario):
```
src/app/(public)/cotizador/
src/app/(admin)/admin/cotizaciones/
src/app/(admin)/admin/precios/
src/app/(admin)/admin/exportar/
src/app/auth/login/
src/app/auth/callback/
src/app/api/cotizaciones/
src/app/api/precios/
src/app/api/pdf/
src/components/cotizador/steps/
src/components/admin/charts/
src/components/shared/
src/lib/supabase/
src/stores/
src/hooks/
src/types/
public/images/materiales/
supabase/migrations/
```

### PASO 0.7 — Crear archivo .env.local
Crea el archivo `.env.local` en la raíz del proyecto con todas las variables listadas arriba (valores vacíos por ahora, los llenaremos después de crear el proyecto en Supabase).

### PASO 0.8 — Crear archivo .env.example
Igual que `.env.local` pero con valores de ejemplo, este SÍ va al repositorio.

### PASO 0.9 — Configurar globals.css con las CSS variables del proyecto
En `src/app/globals.css`, agrega las variables CSS de la paleta de colores del proyecto (naranja, azul agua, crema) e importa las fuentes Fraunces y DM Sans desde Google Fonts.

### PASO 0.10 — Verificar que el proyecto corre
```bash
npm run dev
```
Debe abrir en `http://localhost:3000` sin errores.

### PASO 0.11 — Limpiar el boilerplate de Next.js
- Limpia `src/app/page.tsx` (quita el contenido default de Next.js)
- Limpia `src/app/layout.tsx` (actualiza metadata con el nombre del proyecto)
- Borra `public/next.svg` y `public/vercel.svg`

---

## REGLAS QUE DEBES SEGUIR SIEMPRE

1. **Confirma cada paso** antes de ejecutar el siguiente. Si algo falla, corrígelo en ese momento.

2. **Nunca simplifiques el diseño.** La paleta naranja + azul agua + crema es obligatoria en todo el sistema.

3. **TypeScript estricto** en todo. Nada de `any`. Todos los tipos deben estar en `src/types/`.

4. **Componentes pequeños y reutilizables.** Prefiere crear componentes en `src/components/shared/` antes de repetir código.

5. **Los precios son dinámicos.** Nunca hardcodees precios en los componentes. Siempre vienen de Supabase (tabla `precios_config`) o del store.

6. **El cotizador es la prioridad #1.** Es la fuente de todos los leads del negocio.

7. **Cuando termines la Fase 0**, avísame y pasamos al prompt de la **Fase 1 — Base de datos Supabase**.

---

## CÓMO USAR ESTE PROMPT

### En Claude Code (terminal):
```bash
cd albercas-erp   # o donde quieras crear el proyecto
claude
```
Cuando Claude Code inicie, escribe:
```
Lee el archivo PROMPT-FASE0.md y ejecuta la Fase 0 completa paso a paso
```

### En cada nueva sesión de Claude Code:
Si la sesión se interrumpe, usa este resumen de contexto rápido:
```
Contexto: Proyecto albercas-erp, Next.js 15 + Supabase + Tailwind.
Paleta: naranja #FF5C1A + azul agua #0A3D5C + crema #FDFAF6.
Fuentes: Fraunces (títulos) + DM Sans (cuerpo).
Ya completé: [lista los pasos que ya hiciste]
Continúa desde: [paso donde quedaste]
```

---

## CHECKLIST DE VERIFICACIÓN — FASE 0 COMPLETA

Marca cada uno cuando lo termines:

- [ ] Node.js v18+ instalado y verificado
- [ ] Proyecto `albercas-erp` creado con Next.js 15
- [ ] Todas las dependencias instaladas sin errores
- [ ] Componentes shadcn/ui instalados
- [ ] Estructura de carpetas creada
- [ ] `.env.local` creado (con variables vacías)
- [ ] `.env.example` creado
- [ ] `globals.css` con variables CSS y fuentes del proyecto
- [ ] `npm run dev` corre en localhost:3000 sin errores
- [ ] Boilerplate de Next.js limpiado

**Cuando todos estén marcados → Fase 0 completada ✅**
**Siguiente paso → Crear proyecto en Supabase y ejecutar el schema SQL (Fase 1)**
