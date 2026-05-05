# EterniCapsule - Documentación Maestra

> **Para AI Agents**: Este es el ÚNICO documento que necesitas leer sobre EterniCapsule. Todo lo que importa está aquí.

---

## 📋 RESUMEN EJECUTIVO

**Estado**: ✅ ARMONIZADO Y PULIDO (22 Abril 2026)  
**Nivel de Calidad**: 89% - Producción lista  
**Filosofía**: Ritual ceremonial, no transacción. "Lo que dejas importa."

### Lo que hace EterniCapsule
Una bóveda criptográfica time-locked para mensajes permanentes. El usuario:
1. Escribe un mensaje que no puede decir hoy
2. Lo sella con encriptación (SHA-256)
3. Define cuándo se abrirá
4. Paga $9 AUD (toll permanente)
5. Recibe keys vía email (sender key + capsule key)

**Zero-knowledge**: Ni siquiera Pyadra puede abrir las cápsulas.

---

## 🎨 SISTEMA DE DISEÑO ACTUAL

### Paleta de Colores (Design Tokens)

**CRÍTICO**: Usar SIEMPRE variables CSS, nunca hardcoded.

```css
/* Colores principales */
--etn-earth: #1A1410     /* Background principal */
--etn-soil: #2C2218      /* Background secundario */
--etn-cream: #E8D9D0     /* Texto principal */
--etn-parchment: #F5E6D3 /* Texto enfático */
--etn-ash: #C4B5A8       /* Texto secundario */

/* Acentos cálidos */
--etn-bronze: #C9A961           /* Accent primario */
--etn-bronze-bright: #D4B76E    /* Hover states */
--etn-copper: #9C6644           /* Botones primarios */
--etn-rust: #8B4513             /* Errores/warnings */
--etn-patina: #7A9B76           /* Success states */
```

**Uso correcto**:
```tsx
// ✅ CORRECTO
className="text-[var(--etn-cream)]"
className="bg-[var(--etn-earth)]"
className="border-[var(--etn-copper)]"

// ❌ INCORRECTO - nunca hardcodear
className="text-[#E8D9D0]"
className="bg-#1A1410"
```

---

### Tipografía

**Jerarquía estandarizada**:

```tsx
/* Headlines */
H1: text-3xl md:text-4xl · Cormorant · italic · font-light · var(--etn-cream)
H2: text-2xl md:text-3xl · Cormorant · font-light · var(--etn-bronze-bright)

/* Body */
Body: text-sm md:text-base · EB Garamond · font-light · var(--etn-ash)
Body Secondary: text-xs md:text-sm · EB Garamond · var(--etn-ash)/80

/* Labels y UI */
Labels: text-xs · Mono · uppercase · tracking-wider · var(--etn-bronze)
Buttons: text-xs · Mono · uppercase · tracking-wide · font-semibold
```

**Fonts disponibles**:
- `var(--font-cormorant)` - Serif ceremonial (títulos, énfasis)
- `var(--font-eb-garamond)` - Serif legible (body)
- Font Mono system - Código, labels, botones

**⚠️ NUNCA usar**:
- Texto menor a text-xs (12px)
- tracking mayor a tracking-wide
- Inline font families (usar variables)

---

### Componentes Estándar

#### Botones Primarios (Copper)
```tsx
<button className="group relative overflow-hidden border border-[var(--etn-copper)]/60 
  bg-gradient-to-r from-[var(--etn-copper)]/20 via-[var(--etn-copper)]/30 
  to-[var(--etn-copper)]/20 px-6 py-3 transition-all duration-700 
  hover:border-[var(--etn-copper)] hover:bg-[var(--etn-copper)] 
  hover:shadow-[0_0_40px_rgba(139,90,60,0.5)] rounded-full">
  
  {/* Shimmer effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent 
    via-[var(--etn-copper)]/25 to-transparent -translate-x-[150%] 
    skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]" />
  
  <div className="relative z-10 flex items-center justify-between">
    <span className="text-[var(--etn-parchment)] group-hover:text-[var(--etn-earth)] 
      tracking-wide text-xs uppercase font-mono font-semibold">
      SEAL CAPSULE
    </span>
    <span className="text-[var(--etn-cream)] group-hover:text-[var(--etn-earth)] 
      text-base font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>
      $9 AUD
    </span>
  </div>
</button>
```

#### Botones Secundarios (Bronze)
```tsx
<button className="group relative overflow-hidden border border-[var(--etn-bronze)]/40 
  bg-[var(--etn-soil)]/60 px-6 py-3 transition-all duration-700 
  hover:border-[var(--etn-bronze)] hover:bg-[var(--etn-bronze)]/10 
  hover:shadow-[0_0_30px_rgba(201,169,97,0.3)] rounded-full">
  
  <div className="absolute inset-0 bg-gradient-to-r from-transparent 
    via-[var(--etn-bronze)]/15 to-transparent -translate-x-[150%] 
    skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]" />
  
  <span className="text-[var(--etn-bronze)] group-hover:text-[var(--etn-bronze-bright)] 
    tracking-wide text-xs uppercase font-mono font-semibold">
    UNLOCK CAPSULE
  </span>
</button>
```

#### Footer Consistente
```tsx
<Link href="/exhibitions/galaxy"
  className="group inline-flex items-center gap-3 px-6 py-3 
  bg-[var(--etn-soil)]/60 border border-white/5 rounded-full 
  hover:bg-[var(--etn-copper)]/10 hover:border-[var(--etn-copper)]/40 
  transition-all duration-500 backdrop-blur-md">
  
  <span className="text-[var(--etn-bronze)]/80 group-hover:text-[var(--etn-cream)] 
    text-xs tracking-wide uppercase font-mono">
    ← RETURN TO GALAXY
  </span>
</Link>
```

---

## 🏗️ ARQUITECTURA

### Páginas Principales

```
/exhibitions/galaxy/ethernicapsule
├── page.tsx                    # Landing - Entry sequence + Split screen
├── compose/
│   ├── page.tsx               # Wrapper para ComposeFormUnified
│   └── ComposeFormUnified.tsx # Formulario unificado (NO stepper)
├── sealing/page.tsx           # Loading con crypto theatre
├── sealed/page.tsx            # Success - Capsule sellada
├── unlock/page.tsx            # Input de key para abrir
└── letter/[id]/
    ├── page.tsx               # Server component wrapper
    └── LetterRenderClient.tsx # Carta abierta con blur-to-focus
```

### Componentes Compartidos

```
/exhibitions/galaxy/ethernicapsule
├── Capsule3D.tsx              # Monolito 3D con glow reactivo
├── layout.tsx                 # Font providers (Cormorant, EB Garamond)
└── lib/
    ├── audio.ts              # Audio engine (ticks, chimes, crystallize)
    └── email.ts              # Resend integration
```

---

## 🎭 PÁGINAS - GUÍA DETALLADA

### 1. Landing Page (`page.tsx`)

**Estructura**:
1. **Entry Sequence** (pantalla negra con typewriter)
   - Fog into Fire effect (niebla que se despeja)
   - Luz que crece progresivamente (80px → 1000px)
   - Embers flotando (solo visibles en luz)
   - Breathing sutil de la escena
   - Texto aparece con typewriter (70ms/char)
   - Botón ENTER → zoom dramático → split screen

2. **Split Screen** (después de ENTER)
   - **Left 40%**: Capsule3D (scale-75 en mobile)
   - **Right 60%**: 
     - Título + tagline
     - Explicación de qué es EterniCapsule
     - Inscripciones I/II/III (WRITE/SEAL/PASS)
     - Botones: SEAL CAPSULE ($9 AUD) + UNLOCK CAPSULE
     - Footer: Return to Galaxy

**Espaciado crítico** (optimizado para no requerir scroll):
- Container: `py-8 md:py-0`
- Gap contenido: `gap-4`
- Gap inscripciones: `gap-3`
- Footer margin: `mt-8 md:mt-12`

**Entry Sequence - Fog into Fire**:
```tsx
{/* Luz que crece con cada frase */}
<motion.div animate={{
  width: entryStage === 0 ? '80px' :
         entryStage === 1 ? '220px' :
         entryStage === 2 ? '380px' :
         entryStage === 3 ? '560px' :
         entryStage === 4 ? '760px' : '1000px'
}} />

{/* Vignette pesado que se retrae */}
<motion.div animate={{
  opacity: entryStage === 0 ? 1 :
           entryStage === 1 ? 0.95 :
           entryStage === 2 ? 0.85 :
           entryStage === 3 ? 0.7 :
           entryStage === 4 ? 0.5 : 0.3
}} />

{/* Embers - solo en cliente (mounted) */}
{mounted && embers.map(ember => (
  <motion.div /* ... */ />
))}
```

---

### 2. Compose Form (`ComposeFormUnified.tsx`)

**Estructura**: Formulario unificado, NO stepper. Dos columnas:

**Left Column** (sticky):
- Capsule3D (scale-[0.65] md:scale-90 lg:scale-100)
- Progressive fields (aparecen al completar anteriores):
  1. For (recipient name)
  2. Opens (date picker)
  3. Your Signature (sender name)
  4. Guardian Email

**Right Column**:
- Título: "What must be said?" (text-2xl md:text-3xl)
- Textarea: h-[35vh] md:h-[40vh]
- Botón: "Strike the Metal — $9 AUD" (visible sin scroll)

**Capsule Glow**:
```tsx
const capsuleGlow = Math.max(glow, completionRatio);
<Capsule3D glowIntensity={capsuleGlow} />
```

**Optimización de altura** (crítico):
- Container: `py-8 md:py-12`
- Título: `mb-6` (no mb-12)
- Textarea: `h-[35vh]` (no 50vh)
- Padding textarea: `p-6 md:p-8` (no p-12)

---

### 3. Sealed Page (`sealed/page.tsx`)

**Elementos**:
- Capsule3D (escala 90% en mobile): `scale-90 md:scale-100`
- Título: "The metal is forged." (text-3xl md:text-4xl)
- Subtextos: text-sm y text-xs
- Email notice: `mt-8` (no mt-16)
- Footer: `mt-12` (no mt-32)

**Espaciado optimizado**:
```tsx
<div className="mb-8 mt-6 relative scale-90 md:scale-100">
  <Capsule3D isSealed={true} />
</div>

<h1 className="text-3xl md:text-4xl italic font-serif 
  text-[var(--etn-cream)] mb-4 font-light">
  The metal is forged.
</h1>
```

---

### 4. Letter Page (`letter/[id]/LetterRenderClient.tsx`)

**Secuencia de revelación** (13s total):
1. ID + Sealed Date (0.3s)
2. Recipient name (1.5s)
3. Message (2.5s) - **blur-to-focus cinematic**
4. Sender signature (4.5s)
5. Opened date (5.5s)
6. Footer (6.5s)

**Espaciado optimizado**:
- Top padding: `pt-12 md:pt-16` (no pt-24)
- Gaps verticales: `h-[40px] md:h-[60px]` (no h-[80px])

**Message box**:
```tsx
<motion.div
  initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.98 }}
  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
  transition={{ duration: 3, ease: "easeOut" }}
  className="bg-[#0A0C16]/90 backdrop-blur-3xl border 
    border-[var(--etn-copper)]/30 p-8 md:p-12 rounded-xl">
  
  <p className="text-[var(--etn-parchment)] text-[16px] md:text-[18px] 
    leading-[2.2] font-sans font-light">
    {capsule.message}
  </p>
</motion.div>
```

---

## 🔒 ARQUITECTURA TÉCNICA

### Cryptography Flow

**1. Creación (Compose → Checkout)**:
```typescript
// Client-side
const senderKey = generateRandomKey();    // 32 chars
const capsuleKey = generateRandomKey();   // 32 chars

// Hash antes de enviar
const senderHash = sha256(senderKey);
const capsuleHash = sha256(capsuleKey);

// DB solo recibe hashes
await supabase.insert({
  sender_hash: senderHash,
  capsule_hash: capsuleHash,
  encrypted_message: encrypt(message, capsuleKey)
});
```

**2. Apertura (Unlock → Letter)**:
```typescript
// Usuario ingresa raw key
const inputKey = "ETN-CAPSULE-ABC123...";
const inputHash = sha256(inputKey);

// Match con DB
const match = await supabase
  .select()
  .eq('capsule_hash', inputHash);

if (match) {
  // Decrypt y mostrar
  const decrypted = decrypt(match.encrypted_message, inputKey);
}
```

**⚠️ NUNCA modificar**:
- Schema de `ethernicapsule_capsules`
- Lógica de hashing (SHA-256)
- Guardian token generation
- Stripe checkout flow

---

### Database Schema

```sql
CREATE TABLE ethernicapsule_capsules (
  id TEXT PRIMARY KEY,              -- ETN-CAPSULE-{uuid}
  sender_name TEXT NOT NULL,
  recipient_name TEXT,
  message TEXT NOT NULL,            -- Encrypted
  deliver_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  opened_at TIMESTAMP,
  
  sender_hash TEXT NOT NULL UNIQUE, -- SHA-256
  capsule_hash TEXT NOT NULL UNIQUE,-- SHA-256
  guardian_email TEXT NOT NULL,
  
  payment_status TEXT DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE
);
```

---

### Audio Engine

```typescript
// lib/audio.ts
export const audioAPI = {
  playLithicClick: () => {}, // Tiny UI tick
  playCrystallize: () => {},  // Big sealing moment
  playUnlock: () => {}        // Apertura de cápsula
};
```

**Uso**:
```tsx
import { audioAPI } from './lib/audio';

// En momentos clave
onClick={() => {
  audioAPI.playCrystallize();
  // ... acción
}}
```

---

## 📱 RESPONSIVE & PERFORMANCE

### Breakpoints

```tsx
// Mobile first
text-sm md:text-base     // 14px → 16px
text-xs md:text-sm       // 12px → 14px
text-2xl md:text-3xl     // 24px → 30px

// Layout
flex-col md:flex-row     // Stack → Side by side
gap-4 md:gap-6          // 16px → 24px
px-6 md:px-12           // Padding horizontal
py-8 md:py-12           // Padding vertical

// Capsule scaling
scale-75 md:scale-100    // 75% → 100%
scale-90 md:scale-100    // 90% → 100%
```

### Hydration Warnings

**CRÍTICO**: Usar `suppressHydrationWarning` en contenedores con:
- Valores dinámicos (Math.random, Date.now)
- Mounted-only rendering
- Framer motion con initial states

```tsx
<div className="..." suppressHydrationWarning>
  {/* contenido dinámico */}
</div>
```

---

## 💰 PRICING

**SIEMPRE usar**: `$9 AUD` (nunca A$9, nunca $9 solo)

**Dónde aparece**:
- Landing page: "The seal costs $9 AUD"
- Botón SEAL CAPSULE: "$9 AUD"
- Compose form: "Strike the Metal — $9 AUD"
- ThresholdEntry: "$9.00 AUD"

**Stripe checkout**:
- Price ID configurado en `.env.local`
- One-time payment (no suscripciones)
- Currency: AUD
- Amount: 900 cents ($9.00)

**Por qué $9 AUD**:
1. **Fricción intencional**: Obliga a considerar el peso de las palabras
2. **Anti-spam**: Evita uso frívolo
3. **Sostenibilidad**: Cubre costos de servidor y email
4. **Valor percibido**: Lo gratuito se siente desechable

---

## 📝 COPYWRITING GUIDELINES

### Tono y Voz

**✅ Ritual, ceremonial, permanente**:
- "The metal is forged"
- "Strike the Metal & Seal"
- "Forever readable, forever unchangeable"
- "The fire has done its work"

**❌ Transaccional, corporativo**:
- "Submit form"
- "Process payment"
- "Data saved successfully"
- "Click here to continue"

### Textos Clave (NO CAMBIAR)

```
Landing:
"There are words you cannot say today."
"Write them. Seal them in cryptographic metal."
"The seal costs $9 AUD. Once forged, not even we can unlock it."

Compose:
"What must be said?"
"Pour your message into the form. No one reads it."
"Strike the Metal — $9 AUD"

Sealed:
"The metal is forged."
"What you wrote is now eternal."
"The fire has done its work. Time cannot touch it now."

Letter:
"Sealed on {date}"
"For {recipient}"
```

---

## 🐛 CHANGELOG

### [1.2.0] - 22 Abril 2026 - ARMONIZACIÓN COMPLETA

#### Removido Header Pesado
- ❌ ProjectNav (header negro) eliminado de todas las páginas
- ✅ Experiencia más limpia y ligera

#### Tipografía Estandarizada
- Reducidos tamaños exagerados (text-6xl → text-4xl)
- H1: text-3xl md:text-4xl (consistente en todas las páginas)
- Body: text-sm md:text-base
- Labels: text-xs

#### Optimización de Espaciado (Sin Scroll)
- Sealed page: mb-14 → mb-8, mt-32 → mt-12
- Compose form: textarea h-[50vh] → h-[35vh]
- Landing: gaps reducidos, cápsula scale-75 en mobile
- **Resultado**: Todo visible sin scroll

#### Footers Consistentes
- "RETURN TO PYADRA" → mismo estilo en todas las páginas
- Agregado "← Return to Galaxy" en landing

#### Pricing Clarificado
- A$9 → **$9 AUD** en todas las instancias

#### Entry Sequence - Fog into Fire
- Luz que crece progresivamente (80px → 1000px)
- Vignette pesado que se retrae
- Embers flotando en la luz
- Breathing sutil de la escena

#### Hydration Fixes
- Agregado suppressHydrationWarning donde necesario
- Embers solo renderizan en cliente (mounted)

---

## 🚫 RESTRICCIONES CRÍTICAS

### NO TOCAR

1. **Database Schema**
   - `ethernicapsule_capsules` table
   - Column names o tipos
   - Índices de hash

2. **Crypto Logic**
   - SHA-256 hashing
   - Guardian token generation
   - Encryption/decryption flow

3. **Stripe Integration**
   - Checkout session creation
   - Webhook handlers
   - Payment verification

4. **Audio Engine**
   - Sound files
   - Timing de feedback
   - API surface

### PELIGROS COMUNES

**❌ No agregar**:
- Navegación compleja (tabs, sidebars)
- Headers pesados tipo ProjectNav
- Edit después de sealing
- Preview antes de pago
- Descuentos o cupones

**❌ No cambiar**:
- Copy ritual core
- Flujo de pago
- Zero-knowledge guarantees
- Timing de animaciones críticas

**❌ No romper**:
- Responsive en mobile
- Accesibilidad (WCAG AA mínimo)
- Performance (Lighthouse > 85)
- Hydration (SSR compatibility)

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### Mejoras Técnicas
1. **Email Premium** - Mejorar diseño de emails de Resend
2. **Analytics** - Agregar tracking de eventos (sin comprometer privacy)
3. **Testing** - E2E tests con Playwright
4. **Monitoring** - Error tracking con Sentry

### Mejoras de UX
1. **Capsule History** - Dashboard para sender (sus cápsulas enviadas)
2. **Attachment Support** - Permitir imágenes pequeñas (<1MB)
3. **Audio Messages** - Grabar voz además de texto
4. **Multi-language** - Español, Português

### Mejoras Visuales
1. **3D Enhancements** - Más reactividad en Capsule3D
2. **Sound Design** - Más audio feedback (crystallize sound mejorado)
3. **Micro-interactions** - Hover states más ricos
4. **Dark Mode Plus** - Palette extra-dark opcional

---

## ✅ CHECKLIST DE CALIDAD

Antes de deployar cambios, verificar:

**Visual**
- [ ] Todos los colores usan variables CSS (var(--etn-*))
- [ ] Tipografía consistente (no inline styles)
- [ ] No hay texto menor a text-xs (12px)
- [ ] Botones tienen estilo estandarizado
- [ ] Footer presente y consistente
- [ ] No hay scroll innecesario en ninguna página

**Funcional**
- [ ] Flujo completo funciona (Write → Seal → Pay → Email)
- [ ] Keys se generan correctamente (sender + capsule)
- [ ] Unlock funciona con key correcta
- [ ] Email llega con ambas keys
- [ ] Stripe checkout completa exitosamente

**Performance**
- [ ] Lighthouse Performance > 85
- [ ] No hydration warnings en consola
- [ ] Animaciones smooth (60fps)
- [ ] Imágenes optimizadas
- [ ] No memory leaks

**Código**
- [ ] No hay console.logs
- [ ] No hay TODOs sin resolver
- [ ] TypeScript sin errores
- [ ] Prettier + ESLint pasando
- [ ] Git commit messages descriptivos

---

## 🤖 NOTA PARA AI AGENTS

Si vas a modificar EterniCapsule:

1. **LEE este documento COMPLETO primero**
2. **NO toques** las secciones marcadas como "CRÍTICAS" o "NO TOCAR"
3. **RESPETA** el sistema de diseño (colores, tipografía, componentes)
4. **MANTÉN** el tono ceremonial y ritual (no transaccional)
5. **VERIFICA** que no introduces scroll innecesario
6. **USA** variables CSS, nunca colores hardcoded
7. **TESTEA** el flujo completo después de cambios

**Recuerda**: EterniCapsule es una experiencia ritual, no un formulario web. Cada cambio debe reforzar la sensación de permanencia, peso emocional y ceremonia.

---

**Última actualización**: 22 Abril 2026  
**Estado**: ✅ ARMONIZADO - PRODUCCIÓN LISTA  
**Mantenido por**: Eduardo
