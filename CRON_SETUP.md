# Configuración de Cron Job (Sin Vercel Cron)

## ✅ Solución Simple - Servicio Externo

**NO necesitas configurar nada en Vercel excepto la variable de entorno.**

---

## 1️⃣ Configurar Variable en Vercel (ÚNICO paso en Vercel)

### Generar CRON_SECRET:
```bash
# En tu terminal:
openssl rand -base64 32

# Output ejemplo:
# 8jK2mN9pQ3rS5tU7vW9xYzA1bC3dE5fG7hI9jK1lM3n
```

### Agregar a Vercel:
1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables
2. Click "Add New"
3. Name: `CRON_SECRET`
4. Value: [pegar el output del comando anterior]
5. Environment: Production (y Preview si quieres)
6. Save

**Listo con Vercel** ✅

---

## 2️⃣ Configurar Servicio Externo de Cron

### Opción A: cron-job.org (Recomendado - Gratis)

1. Ir a: https://cron-job.org
2. Registrarse (gratis)
3. Create New Cronjob:
   - **Title**: `EterniCapsule Daily Delivery`
   - **URL**: `https://pyadra.io/api/cron/ethernicapsule`
   - **Schedule**: `0 0 * * *` (diario a medianoche UTC)
   - **Request Method**: `GET`
   - **Headers**: Click "Add Header"
     - Key: `Authorization`
     - Value: `Bearer [tu_CRON_SECRET_aqui]`
   - **Timeout**: 60 seconds
   - **Save**

### Opción B: EasyCron (Alternativa)

1. Ir a: https://www.easycron.com
2. Registrarse (plan gratis)
3. Add Cron Job:
   - **URL**: `https://pyadra.io/api/cron/ethernicapsule`
   - **When**: `Daily at 00:00`
   - **HTTP Headers**: `Authorization: Bearer [tu_CRON_SECRET]`
   - **Create**

### Opción C: GitHub Actions (Si tu repo es privado/público)

Crear `.github/workflows/daily-cron.yml`:
```yaml
name: Daily EterniCapsule Delivery

on:
  schedule:
    - cron: '0 0 * * *'  # Diario a medianoche UTC
  workflow_dispatch:  # Manual trigger

jobs:
  trigger-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cron Endpoint
        run: |
          curl -X GET https://pyadra.io/api/cron/ethernicapsule \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Luego agregar `CRON_SECRET` en GitHub:
- Settings > Secrets and variables > Actions > New repository secret
- Name: `CRON_SECRET`
- Value: [mismo valor que en Vercel]

---

## 🧪 Testing

### Test Manual:
```bash
# Reemplazar YOUR_SECRET con tu CRON_SECRET real
curl -X GET https://pyadra.io/api/cron/ethernicapsule \
  -H "Authorization: Bearer YOUR_SECRET"

# Response esperado si NO hay capsules por entregar:
{"message":"No keys due for delivery"}

# Response si entregó capsules:
{"success":true,"delivered":2}

# Response si falta auth:
{"error":"Unauthorized"}
```

### Verificar en Producción (después de deploy):
```bash
# Ver logs en Vercel Dashboard
# Debería mostrar ejecuciones exitosas
```

---

## 📋 Resumen

### En Vercel (1 paso):
✅ Agregar variable `CRON_SECRET`

### En Servicio Externo (3 min):
✅ Configurar llamada diaria a endpoint con header Authorization

**NO necesitas código adicional en Vercel** ✅

---

## ⚙️ Configuración Recomendada

**Servicio**: cron-job.org (gratis, confiable)
**Schedule**: `0 0 * * *` (medianoche UTC)
**Endpoint**: `https://pyadra.io/api/cron/ethernicapsule`
**Header**: `Authorization: Bearer [CRON_SECRET]`

---

## 🔍 Monitoreo

### Verificar que funciona:
1. En cron-job.org → Ver "Execution History"
2. En Vercel Dashboard → Functions → Ver logs del endpoint
3. Crear capsule de prueba con `deliver_at` = mañana
4. Revisar al día siguiente si se entregó

---

**¿Listo para deploy?** ✅
1. ✅ Generar CRON_SECRET
2. ✅ Agregar a Vercel env vars
3. ✅ Deploy
4. ✅ Configurar cron-job.org (5 minutos post-deploy)
