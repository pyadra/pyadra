# Pyadra - Auditoría de Refactorización

**Fecha**: 30 de Marzo, 2026
**Objetivo**: Limpiar código muerto, reorganizar estructura, y aplicar mejores prácticas

---

## 🔍 Problemas Detectados

### 1. **Inconsistencia Estructural - CRÍTICO**

#### EterniCapsule fuera de `/projects/`
```
❌ ACTUAL:
/ethernicapsule/           <- Al mismo nivel que /projects/
  - page.tsx
  - compose/
  - sealed/
  - letter/[id]/
  - etc.

✅ DEBERÍA SER:
/projects/
  - ethernicapsule/        <- Consistente con orbit/
  - orbit/
  - page.tsx (hub)
```

**Problema**: EterniCapsule es un proyecto como Orbit 77, pero está en una ruta inconsistente.

**Impacto**:
- Confusión en arquitectura
- URLs inconsistentes (`/ethernicapsule` vs `/projects/orbit`)
- Dificulta agregar nuevos proyectos

---

### 2. **Código Huérfano y Sin Uso**

#### `/collective/` - Página Gigante No Linkeada (1175 líneas)
```bash
src/app/collective/
  ├── page.tsx              <- 1175 líneas, NO SE USA
  └── components/           <- CARPETA VACÍA
```

**Estado**:
- ❌ No hay links desde ninguna página
- ❌ Solo referencias en metadata de layout
- ❌ Carpeta `components/` completamente vacía
- ❌ 1175 líneas de código sin función

**Opciones**:
1. **ELIMINAR** - Si no está en producción
2. **MOVER A `/projects/collective/`** - Si es un proyecto futuro
3. **CONVERTIR EN DRAFT** - Mover a carpeta `/drafts/` fuera de `/app/`

**Recomendación**: **ELIMINAR** o mover a `/drafts/` fuera del build

---

#### `/api/ethernicapsule/submit/` - Carpeta Vacía
```bash
src/app/api/ethernicapsule/submit/    <- VACÍA, nunca implementada
```

**Recomendación**: **ELIMINAR**

---

### 3. **Utilidades Sobre-Complejas**

#### `/lib/audio.ts` - AudioEngine (175 líneas)
```typescript
// Usado solo en 2 archivos:
- src/app/ethernicapsule/letter/[id]/LetterRenderClient.tsx
- src/app/ethernicapsule/compose/ComposeForm.tsx
```

**Problema**:
- 175 líneas de código complejo
- Solo usado en EterniCapsule
- Debería estar EN `/ethernicapsule/lib/audio.ts` no global

**Recomendación**: **MOVER** a `/projects/ethernicapsule/lib/audio.ts`

---

#### `/api/applications/route.ts` - API Subutilizada
```typescript
// Solo usado en:
- src/app/projects/orbit/join/page.tsx
```

**Estado**:
- Funcional pero específica de Orbit 77
- Nombrada genérica (`applications`) pero es `orbit_applications`

**Recomendación**: **RENOMBRAR** a `/api/orbit/applications/route.ts`

---

### 4. **Páginas de Soporte No Organizadas**

#### `/transmission-confirmed/` y `/archive/[id]/`
```
/transmission-confirmed/    <- Solo para Orbit 77
/archive/[id]/             <- Solo para Orbit 77
```

**Problema**: Páginas específicas de Orbit en raíz

**Recomendación**:
- **MOVER** `/transmission-confirmed/` → `/projects/orbit/confirmed/`
- **MOVER** `/archive/[id]/` → `/projects/orbit/archive/[id]/`

---

## 📊 Análisis de Archivos

### Archivos por Categoría

| Categoría | Archivos | Estado |
|-----------|----------|--------|
| **Páginas principales** | 5 | ✅ OK |
| **Proyectos** | 15 | ⚠️ Necesita reorganización |
| **API Routes** | 11 | ⚠️ Algunas mal ubicadas |
| **Componentes globales** | 4 | ✅ OK |
| **Utilidades** | 6 | ⚠️ Algunas mal ubicadas |
| **Legal/Docs** | 3 | ✅ OK |
| **Código huérfano** | 2 | ❌ Eliminar |

---

## 🎯 Plan de Refactorización

### Fase 1: Limpieza (Sin Breaking Changes)

#### 1.1 Eliminar Código Muerto
```bash
# Eliminar carpetas vacías
rm -rf src/app/collective/components/
rm -rf src/app/api/ethernicapsule/submit/

# Decidir sobre /collective/page.tsx:
# Opción A: Eliminar completamente
rm src/app/collective/page.tsx

# Opción B: Mover a drafts (fuera de build)
mkdir -p drafts/
mv src/app/collective/ drafts/collective/
```

#### 1.2 Documentar Archivos No Obvios
- Agregar comentarios JSDoc a `audio.ts`
- Documentar el propósito de cada API route

---

### Fase 2: Reorganización Estructural (Breaking Changes)

#### 2.1 Mover EterniCapsule a `/projects/`

```bash
# Estructura ANTES:
src/app/
  ├── ethernicapsule/
  └── projects/
      └── orbit/

# Estructura DESPUÉS:
src/app/
  └── projects/
      ├── ethernicapsule/     <- MOVIDO
      └── orbit/
```

**Cambios Necesarios**:
1. Mover carpeta completa
2. Actualizar ~20 imports
3. Actualizar rutas en APIs
4. Actualizar links en UI
5. Actualizar middleware si hay reglas específicas

**Archivos Afectados** (~30):
- Todos los componentes de EterniCapsule
- APIs: `/api/ethernicapsule/*`
- Links en homepage y projects hub
- Email templates con URLs

#### 2.2 Reorganizar Páginas de Orbit

```bash
# ANTES:
/transmission-confirmed/
/archive/[id]/

# DESPUÉS:
/projects/orbit/
  ├── confirmed/           <- ex transmission-confirmed
  └── archive/[id]/
```

#### 2.3 Reorganizar API Routes

```bash
# ANTES:
/api/applications/         <- Genérico

# DESPUÉS:
/api/orbit/applications/   <- Específico
```

#### 2.4 Mover Utilidades Específicas

```bash
# ANTES:
src/app/lib/audio.ts       <- Global pero solo para EterniCapsule

# DESPUÉS:
src/app/projects/ethernicapsule/lib/audio.ts
```

---

### Fase 3: Optimización

#### 3.1 Consolidar Componentes
- Revisar si hay componentes duplicados
- Extraer patterns repetidos

#### 3.2 Mejorar Types
- Agregar types a `database.types.ts` completos
- Eliminar casts innecesarios

#### 3.3 Performance
- Lazy load de 3D scenes
- Code splitting por proyecto

---

## 📁 Estructura Propuesta Final

```
src/app/
├── (root pages)
│   ├── page.tsx                    <- Homepage
│   ├── manifesto/
│   ├── legal/
│   └── not-found.tsx
│
├── projects/
│   ├── page.tsx                    <- Projects hub
│   │
│   ├── ethernicapsule/             <- ✨ MOVIDO AQUÍ
│   │   ├── page.tsx
│   │   ├── compose/
│   │   ├── preview/
│   │   ├── sealing/
│   │   ├── sealed/
│   │   ├── unlock/
│   │   ├── letter/[id]/
│   │   ├── layout.tsx
│   │   ├── Capsule3D.tsx
│   │   └── lib/
│   │       └── audio.ts           <- ✨ MOVIDO AQUÍ
│   │
│   └── orbit/
│       ├── page.tsx
│       ├── join/
│       ├── confirmed/             <- ✨ ex /transmission-confirmed
│       └── archive/[id]/          <- ✨ MOVIDO AQUÍ
│
├── components/                     <- Solo componentes GLOBALES
│   ├── AmbientAudio.tsx
│   ├── CustomCursor.tsx
│   ├── ErrorBoundary.tsx
│   └── Scene.tsx
│
├── lib/                            <- Solo utilidades GLOBALES
│   ├── db.ts
│   ├── validation.ts
│   ├── email.ts                   <- Orbit emails
│   ├── ethernicapsule-email.ts
│   └── database.types.ts
│
└── api/
    ├── stats/
    ├── observer/
    ├── session/
    ├── stripe/webhook/
    │
    ├── orbit/                     <- ✨ APIs de Orbit agrupadas
    │   ├── donate/
    │   └── applications/          <- ✨ MOVIDO AQUÍ
    │
    ├── ethernicapsule/            <- APIs de EterniCapsule
    │   ├── checkout/
    │   ├── verify/
    │   └── edit/
    │
    └── cron/
        └── ethernicapsule/
```

---

## ⚠️ Riesgos y Consideraciones

### Breaking Changes
- **URLs cambiarán**: `/ethernicapsule` → `/projects/ethernicapsule`
- **Redirects necesarios**: Agregar en `middleware.ts` o `next.config.ts`
- **Links externos**: Emails enviados tienen URLs viejas

### Mitigación
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Redirect old URLs
  if (request.nextUrl.pathname.startsWith('/ethernicapsule')) {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname.replace('/ethernicapsule', '/projects/ethernicapsule'), request.url)
    );
  }
}
```

---

## 📋 Checklist de Implementación

### Pre-Refactorización
- [ ] Backup completo
- [ ] Crear branch `refactor/project-structure`
- [ ] Documentar todas las rutas actuales
- [ ] Tests pasan

### Fase 1: Limpieza (30 min)
- [ ] Eliminar carpetas vacías
- [ ] Decidir sobre `/collective/`
- [ ] Documentar archivos complejos
- [ ] Commit: `refactor: remove unused code and empty directories`

### Fase 2: Reorganización (2-3 horas)
- [ ] Mover EterniCapsule a `/projects/`
- [ ] Actualizar imports (~30 archivos)
- [ ] Agregar redirects en middleware
- [ ] Mover páginas de Orbit
- [ ] Reorganizar APIs
- [ ] Mover audio.ts
- [ ] Commit: `refactor: reorganize project structure`

### Fase 3: Verificación (1 hora)
- [ ] Build pasa sin errores
- [ ] Tests pasan
- [ ] Todas las rutas funcionan
- [ ] Redirects funcionan
- [ ] Actualizar ARCHITECTURE.md
- [ ] PR review

---

## 🎯 Resultado Esperado

### Antes
- ❌ EterniCapsule en ubicación inconsistente
- ❌ 1175 líneas de código sin uso
- ❌ Carpetas vacías confunden
- ❌ Utilidades mal ubicadas
- ❌ Estructura poco clara

### Después
- ✅ Estructura consistente (todos los proyectos en `/projects/`)
- ✅ Cero código muerto
- ✅ Utilidades en ubicaciones lógicas
- ✅ Fácil agregar nuevos proyectos
- ✅ URLs semánticas y predecibles

---

## 💡 Próximos Pasos

1. **Revisar este documento** y aprobar plan
2. **Decidir sobre `/collective/`** (eliminar o mover a drafts)
3. **Crear branch** `refactor/project-structure`
4. **Ejecutar Fase 1** (limpieza sin breaking changes)
5. **Ejecutar Fase 2** (reorganización con redirects)
6. **Testing exhaustivo**
7. **Merge a main**

---

**Estimado Total**: 4-5 horas de trabajo
**Riesgo**: Medio (con redirects y tests, manejable)
**Beneficio**: Alto (código más mantenible y escalable)

---

¿Procedemos con la refactorización? ¿Qué fase quieres que implemente primero?
