# Pyadra Technical Changelog

> Registro cronológico completo de todos los avances técnicos del proyecto.

---

## Abril 2026

### 2026-04-07 | Documentation Reorganization
**[Docs Reorganization](./2026-04-07_docs-reorganization.md)**

**Type**: Organization | Cleanup  
**Status**: ✅ Completed

**Summary**: Complete reorganization of docs/ folder
- ❌ Deleted 8 obsolete/duplicate files
- ✅ Created unified DEPLOYMENT.md guide
- ✅ Simplified from 5 folders → 2 folders
- ✅ Eliminated all duplicate information

**Impact**:
- 19% fewer files (21 → 17)
- 60% fewer folders (5 → 2)
- Clear, maintainable documentation structure
- Single source of truth for deployment

---

### 2026-04-07 | Cleanup & Organization
**[Cleanup Summary](./2026-04-07_cleanup-summary.md)**

**Type**: Organization | Maintenance  
**Status**: ✅ Completed

**Summary**: Limpieza completa del proyecto post-migración
- ✅ Creadas 3 migraciones SQL faltantes
- ✅ Documentación reorganizada (activa vs. archivada)
- ✅ Assets públicos limpiados
- ✅ Estructura de carpetas coherente

**Impact**: 
- Proyecto production-ready (A grade)
- Sin schema drift en base de datos
- Documentación clara y organizada

---

### 2026-04-06 | URL Migration - Galaxy Exhibition
**[URL Migration](./2026-04-06_url-migration-galaxy.md)**

**Type**: Architecture | Breaking Change  
**Status**: ✅ Completed

**Summary**: Migración completa de URLs de `/projects/*` a `/exhibitions/galaxy/*`
- Exhibition "Archaeology" renombrada a "Galaxy"
- Todos los proyectos movidos bajo `/exhibitions/galaxy/`
- 301 redirects para backward compatibility
- 134 referencias actualizadas

**Breaking Changes**:
```
OLD: /projects/ethernicapsule → NEW: /exhibitions/galaxy/ethernicapsule
OLD: /projects/orbit          → NEW: /exhibitions/galaxy/orbit
OLD: /projects/figurines      → NEW: /exhibitions/galaxy/figurines
```

**Migration Steps**:
1. Archivos movidos en src/app/
2. URLs de Stripe actualizadas
3. Middleware redirects implementados
4. Documentación actualizada

**Impact**: 
- Estructura coherente con concepto de museo
- Escalable para futuras exhibitions (Jungle, City)
- URLs semánticas y claras

---

### 2026-04-06 | Project Audit
**[Project Audit](./2026-04-06_project-audit.md)**

**Type**: Audit | Analysis  
**Status**: ✅ Completed

**Summary**: Auditoría completa de estructura del proyecto
- Análisis de coherencia
- Identificación de gaps críticos
- Recomendaciones priorizadas

**Key Findings**:
- 🔴 2 tablas sin migraciones (orbit_applications, figurine_orders)
- 🟡 Documentación desorganizada
- 🟡 Assets sin usar
- ✅ Estructura de código excelente

**Recommendations**:
- Priority 1: Crear migraciones faltantes
- Priority 2: Reorganizar documentación
- Priority 3: Testing y DX improvements

**Impact**: Roadmap claro de mejoras necesarias

---

## Marzo 2026

### 2026-03-31 | On-Demand Delivery System
**[On-Demand Delivery](./2026-03-31_on-demand-delivery.md)**

**Type**: Feature | Architecture  
**Status**: ✅ Completed

**Summary**: Sistema de entrega on-demand para EterniCapsule guardians
- Eliminación de cron jobs
- Guardian tokens con hash
- Delivery cuando guardian accede
- Migration: `add_guardian_token.sql`

**Benefits**:
- ✅ No más cron jobs (simplificación)
- ✅ Entrega instantánea al acceso
- ✅ Mejor UX para guardians
- ✅ Menos infraestructura

**Migration**:
```sql
ALTER TABLE ethernicapsule_capsules
ADD COLUMN guardian_token_hash TEXT;
```

**Impact**: 
- Arquitectura más simple
- Costo de infraestructura reducido
- UX mejorada

---

### 2026-03-31 | Stability Review
**[Stability Review](./2026-03-31_stability-review.md)**

**Type**: Review | Audit  
**Status**: ✅ Completed

**Summary**: Revisión completa de estabilidad del proyecto
- EterniCapsule: Production-ready ✓
- Orbit 77: Production-ready ✓
- Figurines: In development
- Home: Performance optimization needed

**Findings**:
- ✅ Core projects estables
- ⚠️ Home page animations pesadas
- 🟡 Figurines en desarrollo

**Recommendations**:
- Optimizar animaciones del home
- Completar Figurines
- Mantener estabilidad de EterniCapsule/Orbit

**Impact**: Snapshot del estado del proyecto en marzo

---

## Anteriores (Pre-tracking)

Los cambios anteriores a marzo 2026 están documentados en:
- `docs/archive/refactoring/` - Logs de refactoring histórico
- Git history - Commits individuales

---

## Leyenda

**Types**:
- **Architecture**: Cambios estructurales significativos
- **Migration**: Cambios de base de datos
- **Feature**: Nuevas funcionalidades
- **Refactor**: Mejoras de código sin cambiar funcionalidad
- **Performance**: Optimizaciones
- **Security**: Patches de seguridad
- **Organization**: Limpieza y organización
- **Audit/Review**: Análisis y evaluación

**Status**:
- ✅ Completed - Implementado y funcionando
- 🚧 In Progress - En desarrollo
- 📋 Planned - Planeado para futuro

---

## Cómo Contribuir

Al hacer un cambio técnico significativo:

1. **Crear documento en `changelog/`**:
   ```
   docs/changelog/YYYY-MM-DD_nombre-descriptivo.md
   ```

2. **Usar el formato estándar** (ver README.md)

3. **Actualizar este CHANGELOG.md** agregando entrada en la sección correspondiente

4. **Commit junto con el cambio** para mantener historial coherente

---

Last updated: April 7, 2026  
Total entries: 5
