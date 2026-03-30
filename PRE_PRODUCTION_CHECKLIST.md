# Pre-Production Checklist 🚨

**IMPORTANTE**: Revisar TODOS estos puntos antes de deploy a producción

---

## ⚠️ CRÍTICO - Configuración de Variables de Entorno

### 1. **CRON_SECRET Faltante en .env.example**

#### Problema:
```bash
# .env.example NO incluye CRON_SECRET
# Pero el código lo requiere:
# src/app/api/cron/ethernicapsule/route.ts
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

#### Solución ANTES de deploy:
```bash
# 1. Agregar a .env.example
echo "CRON_SECRET=your_secure_random_string_here" >> .env.example

# 2. En Vercel Dashboard, agregar:
# Settings > Environment Variables > CRON_SECRET
# Valor: [generar string aleatorio seguro]

# 3. Configurar Vercel Cron Job:
# vercel.json o Vercel Dashboard
# Endpoint: /api/cron/ethernicapsule
# Schedule: 0 0 * * * (diario a medianoche)
# Headers: Authorization: Bearer ${CRON_SECRET}
```

---

## 🔍 URLs Hardcodeadas (REVISADAS)

### ✅ URLs Correctas (No requieren cambio):
```typescript
// email.ts - Orbit 77 links
https://pyadra.io/archive/${supporterId}
https://pyadra.io/transmission-confirmed?session_id=...
```
**Razón**: Estas son de Orbit 77, no de EterniCapsule. ✅ OK

### ✅ URLs Dinámicas (Usan env vars):
```typescript
// Cron job usa variable de entorno
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pyadra.io";

// Stripe checkout usa origin del request
const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;
```
**Status**: ✅ Correcto

---

## 🎯 Configuración de Stripe

### Verificar en Stripe Dashboard:

#### 1. **Webhook Endpoint**
```
Stripe Dashboard > Developers > Webhooks
Endpoint: https://pyadra.io/api/stripe/webhook
Events: checkout.session.completed
Status: Enabled ✅
```

#### 2. **Webhook Secret**
```bash
# Verificar en Vercel:
STRIPE_WEBHOOK_SECRET=whsec_...

# Debe coincidir con el webhook configurado en Stripe
```

#### 3. **Test Webhook** (Opcional pre-deploy):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## 📧 Emails Antiguos

### Problema:
Emails ya enviados con URLs antiguas (`/ethernicapsule`)

### Solución:
✅ **YA IMPLEMENTADO** - Redirects automáticos en middleware
```typescript
// middleware.ts
if (request.nextUrl.pathname.startsWith('/ethernicapsule')) {
  return NextResponse.redirect('/projects/ethernicapsule');
}
```

**Status**: ✅ Los emails antiguos seguirán funcionando

---

## 🗄️ Base de Datos

### ¿Hay URLs guardadas en DB?

#### Revisar tablas:
```sql
-- Verificar si hay URLs hardcodeadas en mensajes
SELECT id, message
FROM ethernicapsule_capsules
WHERE message LIKE '%pyadra.io/ethernicapsule%'
LIMIT 10;

-- Verificar emails guardados
SELECT id, guardian_email, sender_email
FROM ethernicapsule_capsules
WHERE guardian_email IS NOT NULL
LIMIT 10;
```

#### Acción:
- [ ] Ejecutar queries en Supabase
- [ ] Si hay URLs en mensajes de usuarios: ✅ No importa (es contenido de usuario)
- [ ] Si hay URLs en metadata del sistema: Actualizar si es necesario

---

## 📊 Analytics y Tracking

### Vercel Analytics:
```typescript
// layout.tsx ya tiene:
import { Analytics } from "@vercel/analytics/react";
```
✅ **Sin cambios necesarios** - Vercel Analytics trackea automáticamente

### Google Analytics (si existe):
- [ ] Revisar si hay filtros/segmentos para `/ethernicapsule`
- [ ] Actualizar dashboards que referencien la ruta antigua
- [ ] Crear alertas para redirecciones si es necesario

---

## 🤖 Cron Jobs - Servicio Externo

**NO configurar en Vercel** - Usar servicio externo gratuito

Ver: [CRON_SETUP.md](CRON_SETUP.md) para instrucciones detalladas

### Configuración (Post-Deploy):

#### Opción Recomendada: cron-job.org (Gratis)
```
URL: https://pyadra.io/api/cron/ethernicapsule
Schedule: 0 0 * * * (diario a medianoche UTC)
Header: Authorization: Bearer [CRON_SECRET]
```

#### Tiempo de configuración: 5 minutos
#### Sin código adicional en Vercel ✅

### Verificación Post-Deploy:
```bash
# Test manual del cron
curl -X GET https://pyadra.io/api/cron/ethernicapsule \
  -H "Authorization: Bearer $CRON_SECRET"

# Debería retornar: {"message": "No keys due for delivery"} o {"delivered": N}
```

---

## 🔐 Secrets y Variables

### Verificar en Vercel:
```bash
# Variables REQUERIDAS:
✅ STRIPE_SECRET_KEY
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ NEXT_PUBLIC_APP_URL (https://pyadra.io)
✅ NEXT_PUBLIC_SUPABASE_URL
✅ SUPABASE_SERVICE_ROLE_KEY
✅ RESEND_API_KEY
❌ CRON_SECRET  <- FALTA, AGREGAR ANTES DE DEPLOY
```

### Generar CRON_SECRET:
```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copiar output y agregar a Vercel Environment Variables
```

---

## 🌐 DNS y Dominios

### Verificar:
- [ ] pyadra.io apunta a Vercel ✅
- [ ] SSL Certificate activo ✅
- [ ] HTTPS redirect activo ✅

---

## 📱 Social Media & External Links

### Revisar Links en:
- [ ] Instagram bio
- [ ] Twitter/X bio
- [ ] LinkedIn
- [ ] Emails de marketing previos
- [ ] Anuncios pagados (Google Ads, Facebook Ads)
- [ ] Blog posts externos

**Acción**:
- Si hay links a `/ethernicapsule`: ✅ Funcionarán (redirect automático)
- Considerar actualizar gradualmente para SEO

---

## 🔍 SEO Considerations

### Redirects permanentes vs temporales:
```typescript
// Actualmente: 307 Temporary Redirect
// Considerar cambiar a: 301 Permanent Redirect después de 1-2 semanas

// middleware.ts
return NextResponse.redirect(newUrl, 301); // Después de validar todo funciona
```

### Sitemap:
- [ ] Generar sitemap.xml con nuevas URLs
- [ ] Enviar a Google Search Console
- [ ] Notificar cambio de URLs

---

## 🧪 Testing Post-Deploy

### Inmediatamente después del deploy:

#### 1. URLs Nuevas:
```bash
curl -I https://pyadra.io/projects/ethernicapsule
# Debería: 200 OK
```

#### 2. Redirects:
```bash
curl -I https://pyadra.io/ethernicapsule
# Debería: 307 Temporary Redirect
# Location: /projects/ethernicapsule
```

#### 3. Funcionalidad Completa:
- [ ] Crear capsule nueva
- [ ] Verificar email recibido
- [ ] Probar unlock con key
- [ ] Verificar payment flow completo

#### 4. Cron Job:
```bash
# Verificar logs en Vercel Dashboard
# Debería ejecutarse a medianoche UTC sin errores
```

---

## 📋 Checklist Final

### Antes de Deploy:
- [ ] **AGREGAR CRON_SECRET a .env.example**
- [ ] **CONFIGURAR CRON_SECRET en Vercel**
- [ ] **CONFIGURAR Cron Job en Vercel**
- [ ] Verificar Stripe webhook activo
- [ ] Verificar todas las variables de entorno
- [ ] Build local exitoso
- [ ] Tests 100% passing
- [ ] Commit y push a main

### Durante Deploy:
- [ ] Monitorear logs en tiempo real
- [ ] Verificar build exitoso
- [ ] Verificar deployment completado

### Después de Deploy (Primera hora):
- [ ] Test manual de redirects
- [ ] Test manual de nueva URL
- [ ] Crear capsule de prueba
- [ ] Verificar email recibido
- [ ] Revisar error logs (si hay)
- [ ] Verificar analytics tracking

### Primeras 24 horas:
- [ ] Monitorear rate de errores
- [ ] Verificar cron job ejecutó correctamente
- [ ] Revisar logs de redirects
- [ ] Responder issues de usuarios (si hay)

### Primera semana:
- [ ] Actualizar enlaces externos gradualmente
- [ ] Considerar cambiar a 301 Permanent Redirect
- [ ] Generar y enviar sitemap actualizado
- [ ] Revisar métricas de analytics

---

## 🚨 Rollback Plan

### Si algo falla:

#### Opción 1: Revert en Vercel
```bash
# Vercel Dashboard > Deployments
# Click en deployment anterior > Promote to Production
```

#### Opción 2: Git Revert
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys
```

#### Opción 3: Branch Anterior
```bash
# Vercel Dashboard > Settings > Git
# Change branch to: main-backup (crear backup branch antes)
```

---

## ✅ Sign-Off

**Antes de proceder a producción, TODOS los items marcados con ❌ deben ser ✅**

Items CRÍTICOS:
- ❌ **CRON_SECRET** - DEBE configurarse antes de deploy
- ✅ Redirects - Funcionando
- ✅ Tests - Passing
- ✅ Build - Exitoso
- ✅ Security - Auditado

---

**Última actualización**: 30 de Marzo, 2026
**Preparado por**: Claude Sonnet 4.5
