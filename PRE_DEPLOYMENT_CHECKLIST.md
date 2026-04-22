# ✅ Pre-Deployment Checklist - Versión Estable
**Fecha**: 22 Abril 2026  
**Versión**: EterniCapsule Armonizado + Orbit 77 Mejorado

---

## 📊 RESUMEN DE CAMBIOS

### EterniCapsule
- ✅ Armonización completa de diseño y espaciado
- ✅ Tipografía estandarizada (sin scroll innecesario)
- ✅ Entry sequence "Fog into Fire" implementado
- ✅ Pricing clarificado ($9 AUD en todo el sitio)
- ✅ Footers consistentes
- ✅ Documentación consolidada ([`ETERNICAPSULE.md`](docs/ETERNICAPSULE.md))

### Orbit 77
- ✅ Mejoras visuales y de animación
- ✅ Documentación actualizada ([`ORBIT_NODE.md`](docs/ORBIT_NODE.md))

### Archivos Modificados
- **22 archivos cambiados**: +1805 líneas, -1087 líneas
- Principalmente: EterniCapsule páginas, Orbit, globals.css, documentación

---

## 🔍 VERIFICACIONES COMPLETADAS

### ✅ Build y Compilación
- [x] **Build exitoso** - `npm run build` ✓
- [x] **TypeScript check** - Sin errores de tipo ✓
- [x] **31 rutas generadas** correctamente ✓
- [x] **Lint warnings** - 3 warnings menores (no críticos)

**Fix aplicado**:
- Orbit page.tsx: Atributo `transition` duplicado → Consolidado ✓

### ✅ Estructura de Archivos
- [x] Documentación consolidada (5 docs → 1 maestro)
- [x] README.md actualizado (root y docs/)
- [x] Migraciones de DB presentes (7 archivos)
- [x] .env.example documentado

### ✅ Configuración
- [x] package.json actualizado
- [x] tsconfig.json correcto
- [x] Variables de entorno documentadas

---

## 🚀 CHECKLIST PRE-DEPLOYMENT

### 1. Variables de Entorno (Producción)

Verificar que estén configuradas en Vercel:

```bash
# Stripe (PRODUCTION KEYS)
STRIPE_SECRET_KEY=sk_live_...                          # ⚠️ LIVE KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...        # ⚠️ LIVE KEY
STRIPE_WEBHOOK_SECRET=whsec_...                        # Webhook secret

# App URL
NEXT_PUBLIC_APP_URL=https://pyadra.io                  # Producción

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...                       # Service role

# Resend
RESEND_API_KEY=re_...                                  # API key
```

**CRÍTICO**: Verificar que las keys de Stripe sean **LIVE** (no test).

---

### 2. Base de Datos (Supabase)

- [ ] **Todas las migraciones aplicadas**
  ```bash
  # Verificar en Supabase Dashboard > SQL Editor
  # O correr localmente:
  supabase db push
  ```

- [ ] **Tablas existentes** (7 total):
  - `orbit_support_credentials`
  - `orbit_supporters`
  - `ethernicapsule_capsules`
  - `observers` y `scans`
  - `orbit_applications`
  - `figurine_orders`
  - `guardian_token_hash`

- [ ] **Índices optimizados** (verificar performance)

---

### 3. Stripe Configuration

- [ ] **Webhooks configurados** en Stripe Dashboard:
  - URL: `https://pyadra.io/api/stripe/webhook`
  - Eventos:
    - `checkout.session.completed`
    - `payment_intent.succeeded`
    - `payment_intent.payment_failed`

- [ ] **Products y Prices creados**:
  - EterniCapsule: $9 AUD (one-time)
  - Orbit 77: $15 AUD (support tier)
  - Figurines: $175 AUD (one-time)

- [ ] **Test payment** realizado en staging

---

### 4. Email (Resend)

- [ ] **Domain verificado** (pyadra.io)
- [ ] **API key activa**
- [ ] **Test email** enviado y recibido
- [ ] **Verificar templates**:
  - EterniCapsule keys email
  - Orbit 77 support confirmation
  - Guardian notifications

---

### 5. Git & Deployment

- [ ] **Commit todos los cambios**:
  ```bash
  git add .
  git commit -m "feat: armonización completa - eternicapsule + orbit 77 mejoras"
  ```

- [ ] **Push a main**:
  ```bash
  git push origin main
  ```

- [ ] **Vercel auto-deploy** activará el build

---

### 6. Post-Deployment Verification

Una vez deployed, verificar:

#### Funcionalidad Core
- [ ] **Home page** carga correctamente
- [ ] **Galaxy page** (/exhibitions/galaxy) funciona
- [ ] **EterniCapsule landing** (/exhibitions/galaxy/ethernicapsule)
  - [ ] Entry sequence "Fog into Fire" funciona
  - [ ] Split screen sin scroll
  - [ ] Botones visibles
  - [ ] Footer "Return to Galaxy" funciona
- [ ] **EterniCapsule compose** (/compose)
  - [ ] ComposeFormUnified carga
  - [ ] Textarea h-[35vh] (sin scroll para botón)
  - [ ] Capsule glow reactivo
  - [ ] Stripe checkout funciona
- [ ] **Orbit 77** (/exhibitions/galaxy/orbit)
  - [ ] Página carga sin errores
  - [ ] Animaciones funcionan
  - [ ] Join page funciona

#### Pagos y Emails
- [ ] **Test payment** EterniCapsule ($9 AUD)
  - [ ] Checkout completa
  - [ ] Email con keys llega
  - [ ] Capsule se guarda en DB
- [ ] **Test payment** Orbit 77 ($15 AUD)
  - [ ] Support confirmation email llega
  - [ ] Credential generado correctamente

#### Performance
- [ ] **Lighthouse score** > 85 (Performance)
- [ ] **No console errors** en producción
- [ ] **No hydration warnings**
- [ ] **Mobile responsive** (test en iPhone/Android)

---

## ⚠️ ROLLBACK PLAN

Si algo falla después de deployment:

1. **Revert en Vercel**:
   - Vercel Dashboard → Deployments → Previous deployment → Promote to Production

2. **Git revert**:
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Database rollback** (solo si hubo cambios de schema):
   - Restaurar snapshot de Supabase
   - O correr migration de rollback

---

## 📝 NOTAS IMPORTANTES

### Console.logs
- **64 console.logs** detectados en código
- **No crítico** - son para debugging
- **Recomendación**: Crear issue para limpiar en próxima iteración

### Lint Warnings
- 3 warnings menores (unused vars, setState en useEffect)
- **No bloquean deployment**
- **Recomendación**: Fix en próxima iteración

### Archivos Nuevos Sin Trackear
- `.claude/` (carpeta local de Claude, no commitear)
- `docs/ETERNICAPSULE.md` ✓ (commitear)
- `docs/ORBIT_77_IMPROVEMENT_PLAN.md` (evaluar si commitear)
- `src/app/exhibitions/galaxy/ethernicapsule/compose/ComposeFormUnified.tsx` ✓ (commitear)
- `src/app/exhibitions/galaxy/ethernicapsule/compose/ThresholdEntry.tsx` ✓ (commitear)
- `src/app/exhibitions/galaxy/orbit/components/` ✓ (commitear si tiene archivos)

---

## 🎯 COMANDOS RÁPIDOS

```bash
# Verificar build
npm run build

# Verificar lint
npm run lint

# Ver cambios
git status
git diff --stat

# Commit y deploy
git add .
git commit -m "feat: armonización eternicapsule + orbit 77 mejoras"
git push origin main

# Ver logs en producción (Vercel)
vercel logs --follow
```

---

## ✅ APROBACIÓN FINAL

- [ ] Todos los checks completados
- [ ] Variables de entorno verificadas
- [ ] Test payments funcionando
- [ ] No errores críticos
- [ ] Performance aceptable (>85)
- [ ] Mobile responsive verificado

**Una vez todos los checks pasen → DEPLOY ✓**

---

**Preparado por**: Claude  
**Fecha**: 22 Abril 2026  
**Versión**: Estable - Lista para producción
