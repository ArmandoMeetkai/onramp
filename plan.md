**ONRAMP**

Plan de Verificacion de Coherencia del Sistema

Fecha: 07/04/2026 \| Autor: Claude (Senior Frontend Review) \| Para:
Agente AI

# Objetivo

Este plan esta disenado para que un agente AI (Claude Code u otro) pueda
ejecutar una verificacion completa de coherencia del sistema Onramp.
Cada seccion contiene instrucciones claras, archivos a revisar,
criterios de aceptacion, y comandos sugeridos. El agente debe seguir el
plan seccion por seccion, reportando hallazgos y estado (PASS/FAIL) para
cada item.

# Contexto del Proyecto

Onramp es una app educativa de crypto construida con Next.js 15+ (App
Router), TypeScript strict, Tailwind CSS 4 con oklch, Zustand 5,
Dexie.js (IndexedDB), Anthropic Claude API, Framer Motion, y Playwright
para E2E. Es una PWA mobile-first (max-width 480px) con arquitectura
offline-first.

# FASE 1: Estructura y Arquitectura

## 1.1 Verificar estructura de carpetas

**Comando:** tree -L 2 \--dirsfirst -I node_modules

Criterio: La estructura debe seguir el patron feature-sliced:

- app/ → rutas y paginas (Next.js App Router)

- components/ → UI organizado por dominio (cards/, portfolio/, replay/,
  chat/, layout/, shared/)

- store/ → estado global Zustand (un archivo por dominio)

- lib/ → utilidades e infraestructura (db.ts, utils.ts)

- data/ → datos estaticos tipados (scenarios, lessons, replayEvents)

- hooks/ → hooks custom (useOnboarding, useHydration)

- e2e/ → tests Playwright

## 1.2 Verificar dependencias

**Archivos:** package.json, bun.lockb

Acciones:

- Ejecutar: bun install \--dry-run (verificar que todas las versiones
  existen y resuelven)

- Verificar que NO hay versiones inventadas (ej: next@16.x no existe,
  react@19.2.4 verificar)

- Verificar que no hay dependencias duplicadas o conflictivas

- Verificar que devDependencies vs dependencies estan correctamente
  separadas

**Criterio PASS:** bun install resuelve sin errores, todas las versiones
son reales y publicadas en npm.

## 1.3 Verificar configuracion de TypeScript

**Archivo:** tsconfig.json

Criterio: strict: true, sin any permitidos, paths configurados
correctamente.

**Comando:** npx tsc \--noEmit (debe compilar sin errores)

# FASE 2: Coherencia del Sistema de Diseno

## 2.1 Tokens de color centralizados

**Archivo:** app/globals.css

Verificar:

- Todos los colores usan oklch en variables CSS semanticas (\--primary,
  \--surface, \--accent, etc.)

- Existen variantes :root (light) y .dark (dark)

- grep -r \"rgb\\\|hsl\\\|#\[0-9a-fA-F\]\" components/ → debe retornar
  CERO resultados (ningun color hardcodeado)

- Los tokens semanticos cubren: primary, secondary, accent, background,
  foreground, muted, border, card, success, warning, danger, info

**Criterio PASS:** Cero colores hardcodeados en componentes. Todo pasa
por variables CSS.

## 2.2 Tipografia consistente

Verificar:

- grep -r \"text-\\\[\" components/ app/ → listar todos los font sizes
  custom

- Ningun texto funcional por debajo de 11px (text-\[10px\] prohibido)

- Las fuentes se cargan en layout.tsx con next/font (no CDN externo)

- font-heading y font-sans definidos consistentemente

## 2.3 Spacing y radios consistentes

Verificar que los componentes del mismo tipo usan los mismos radios y
paddings:

- Cards: todas deben usar el mismo rounded-\* y padding

- Botones: mismo height, padding, y radio entre variantes

- Inputs: altura y padding consistentes en WelcomeStep, ChatInput,
  TradeSheet

## 2.4 Dark mode sin FOUC

Verificar:

- Existe script beforeInteractive en layout.tsx que lee localStorage y
  aplica .dark antes del paint

- No hay flash de tema incorrecto al cargar la pagina

- El toggle en Header.tsx usa aria-checked coherente con el estado
  actual

# FASE 3: Accesibilidad (A11y)

## 3.1 Verificacion WCAG 2.1 AA

Para cada item, verificar el archivo indicado:

  -------------------------------------------------------------------------------------
  **Item**          **Archivo**            **Que verificar**          **Criterio**
  ----------------- ---------------------- -------------------------- -----------------
  Zoom              layout.tsx             No existe maximumScale: 1  WCAG 1.4.4
                                           en viewport                

  aria-live chat    chat/page.tsx          Contenedor mensajes:       WCAG 4.1.3
                                           role=\"log\"               
                                           aria-live=\"polite\"       

  Form semantics    ChatInput.tsx          \<form onSubmit\>,         WCAG 1.3.1
                                           \<label\> sr-only asociado 
                                           al input                   

  Labels            WelcomeStep.tsx        \<label htmlFor\> asociado WCAG 1.3.1
                                           al input con sr-only       

  Radio roles       ExperienceStep.tsx     role=\"radiogroup\" +      WCAG 4.1.2
                                           role=\"radio\" +           
                                           aria-checked               

  Radio roles       RiskStep.tsx           Mismo patron que           WCAG 4.1.2
                                           ExperienceStep             

  Progress          OnboardingStep.tsx     role=\"progressbar\" +     WCAG 4.1.2
                                           aria-valuenow/min/max      

  Accordion         ExplanationPanel.tsx   aria-expanded +            WCAG 4.1.2
                                           aria-controls + id en      
                                           contenido                  

  SVG alt           ConfidenceScore.tsx    SVG: role=\"img\" +        WCAG 1.1.1
                                           aria-label dinamico        

  Nav links         BottomNav.tsx          NO tiene aria-label        WCAG 4.1.2
                                           redundante. Solo           
                                           aria-current               

  Theme toggle      Header.tsx             aria-checked coherente con WCAG 4.1.2
                                           aria-label                 

  Focus mgmt        InfoTip.tsx            Foco al X al abrir,        WCAG 2.4.3
                                           regresa al trigger al      
                                           cerrar                     

  Reduced motion    globals.css            \@media                    WCAG 2.3.3
                                           (prefers-reduced-motion:   
                                           reduce) presente           
  -------------------------------------------------------------------------------------

## 3.2 Navegacion por teclado

- Backspace en ExperienceStep.tsx y RiskStep.tsx tiene
  e.preventDefault() antes de onBack()

- Tab order logico en todas las paginas (verificar manualmente o con
  Playwright)

- Todos los elementos interactivos son accesibles por teclado (no solo
  click)

- Focus visible en todos los elementos interactivos (outline o ring)

# FASE 4: UX y Flujos de Usuario

## 4.1 Navegacion segura

Verificar en estos 3 archivos que router.back() tiene fallback:

- app/scenario/\[id\]/page.tsx → fallback a /explore

- app/learn/\[id\]/page.tsx → fallback a /learn

- app/replay/\[eventId\]/page.tsx → fallback a /replay

- Patron esperado: window.history.length \> 1 ? router.back() :
  router.push(\"/ruta-padre\")

## 4.2 Estados de carga/error/vacio

Verificar que cada pagina maneja los 4 estados correctamente:

  -----------------------------------------------------------------------
  **Pagina**        **Loading**       **Error**         **Empty**
  ----------------- ----------------- ----------------- -----------------
  Home              Skeleton          ErrorState con    N/A
                    (AppShell)        retry             

  Practice          Skeleton          ErrorState        EmptyState
                    animate-pulse                       compartido

  Chat              N/A               Error en          Mensaje inicial
                                      streaming         

  Explore           Skeleton          ErrorState        N/A (contenido
                                                        estatico)

  Replay            Skeleton          ErrorState        N/A
  -----------------------------------------------------------------------

## 4.3 Chat UX

- Scroll smooth al recibir mensajes nuevos (scrollTo con behavior:
  \"smooth\")

- Boton de stop visible durante streaming

- Input dentro de \<form\> para comportamiento correcto en movil

- Historial NO crece sin limite (verificar si hay truncado o sliding
  window)

## 4.4 TradeSheet UX

- Input usa type=\"text\" inputMode=\"decimal\" (NO type=\"number\")

- Boton de cierre visible (showCloseButton no es false)

- Validacion de input con regex /\^\\d\*\\.?\\d\*\$/

- Presets de cantidad (\$10/\$25/\$50/\$100) funcionan correctamente

# FASE 5: Arquitectura de Componentes

## 5.1 Single Responsibility

- Ningun componente supera 300 lineas (wc -l en cada archivo de
  components/)

- PracticePage: verificar que el IIFE del chart fue extraido a
  CoinChartPanel.tsx

- CoinChartPanel.tsx existe con props tipadas (symbol, name, sparkline,
  livePrice)

## 5.2 DRY - Sin duplicacion de datos

Verificar que NO hay datos duplicados:

- ASSET_NAMES: solo en usePriceStore (getName). grep -r \"ASSET_NAMES\"
  → max 1 resultado

- Asset taglines: solo en usePriceStore (getTagline). HoldingsList usa
  getTagline del store

- Assets list (BTC, ETH, SOL): definida una sola vez y reutilizada

- EmptyState: componente compartido usado en Practice (no reimplementado
  inline)

## 5.3 Stores Zustand

Verificar coherencia de cada store:

- Cada store tiene metodo hydrate(userId) que carga desde Dexie

- Los stores no tienen logica de UI (solo estado y logica de negocio)

- Las dependencias en useMemo/useCallback incluyen funciones del store
  cuando se usan dentro

- Verificar: PracticePage useMemo de holdingBreakdown incluye getName en
  deps

# FASE 6: Performance

## 6.1 Hydration

- AppShell muestra skeleton (NO spinner) mientras Dexie hidrata

- useHydration.ts retorna { isReady, error } con try/catch/finally

- Si Dexie falla, se muestra ErrorState con boton de retry

- El skeleton refleja la estructura de la pagina (no es generico)

## 6.2 Timers y cleanup

- PracticePage: intervalos se pausan con visibilitychange cuando tab
  esta en background

- replay/\[eventId\]/page.tsx: timersRef con cleanup en useEffect
  (clearInterval + clearTimeout)

- No hay setInterval o setTimeout sin cleanup en ningun componente

- Comando: grep -rn \"setInterval\\\|setTimeout\" app/ components/ →
  verificar que cada uno tiene cleanup

## 6.3 Renders innecesarios

- No hay new Date() en el render path sin useMemo (verificar
  HomeContent)

- Los calculos pesados estan en useMemo con dependencias correctas

- Los event handlers estan en useCallback cuando se pasan como props

# FASE 7: SEO y Metadata

## 7.1 Metadata por pagina

- layout.tsx raiz tiene template \"%s --- Onramp\"

- Cada ruta tiene su propio layout.tsx con metadata unica (title +
  description)

- Rutas verificar: chat, explore, practice, learn, replay, profile,
  ready

- Rutas dinamicas tienen generateMetadata: scenario/\[id\],
  learn/\[id\], replay/\[eventId\]

- generateMetadata usa datos del contenido (titulo del escenario,
  leccion, o evento)

# FASE 8: Seguridad

## 8.1 API endpoints

- /api/chat: verificar que la API key de Anthropic NO se expone al
  cliente

- /api/chat: verificar si existe rate limiting (middleware con IP limit)

- /api/prices: verificar que el cache funciona correctamente

- System prompt del chat esta en el servidor, no en el cliente

- El chat tiene instruccion explicita de no dar consejo financiero

# FASE 9: Tests

## 9.1 E2E con Playwright

- Ejecutar: npx playwright test (o bun test:e2e)

- Todos los tests pasan sin errores

- El beforeEach borra IndexedDB (indexedDB.deleteDatabase(\"OnrampDB\"))

- El helper completeOnboarding() esta compartido y funciona

- demo-recording.spec.ts esta separado de tests funcionales (o marcado
  como skip en CI)

# FASE 10: Verificacion Final de Coherencia

## 10.1 Checklist de coherencia global

Ejecutar estos comandos y verificar resultados:

- npx tsc \--noEmit → 0 errores de TypeScript

- npx next lint → 0 warnings/errores de ESLint

- grep -rn \"any\" \--include=\"\*.ts\" \--include=\"\*.tsx\" app/
  components/ store/ → 0 usos de \"any\"

- grep -rn \"as \" \--include=\"\*.ts\" \--include=\"\*.tsx\" app/
  components/ store/ → verificar que no hay type assertions innecesarias

- grep -rn \"// TODO\\\|// FIXME\\\|// HACK\" → listar y evaluar si son
  deuda tecnica aceptable

- grep -rn \"console.log\" app/ components/ store/ → 0 en produccion
  (solo permitido en api/)

- grep -rn \"eslint-disable\" → justificar cada uno

## 10.2 Flujo de datos coherente

Verificar que el flujo de datos sigue este patron en toda la app:

IndexedDB (Dexie) \<-\> Zustand Store \<-\> React Components \<-\> API
Routes \<-\> External APIs

Criterios:

- Ningun componente accede a Dexie directamente (siempre a traves del
  store)

- Ningun componente hace fetch directo a APIs externas (siempre a traves
  de /api/)

- Los stores son la unica fuente de verdad para estado global

- Props se usan para estado local de componente, no para estado global

# Formato de Reporte Esperado

El agente debe reportar resultados en este formato para cada fase:

**FASE X: \[Nombre\]**

Estado: PASS / FAIL / PARTIAL

Items verificados: X/Y

Hallazgos: \[lista de problemas encontrados con archivo y linea\]

Recomendaciones: \[acciones sugeridas\]

Al final, un resumen ejecutivo con:

- Total de items verificados

- Total PASS / FAIL / PARTIAL

- Lista priorizada de problemas encontrados (P0 \> P1 \> P2)

- Evaluacion general de coherencia del sistema (1-10)
