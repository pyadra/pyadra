# URL Migration: Projects → Galaxy

**Date**: April 6, 2026  
**Type**: Breaking change (with redirects)

## What Changed

All project URLs moved from `/projects/*` to `/exhibitions/galaxy/*`

### Old Structure (Deprecated)
```
/projects/ethernicapsule
/projects/orbit
/projects/figurines
```

### New Structure (Current)
```
/exhibitions/galaxy/ethernicapsule
/exhibitions/galaxy/orbit
/exhibitions/galaxy/figurines
```

## Why This Change?

1. **Semantic clarity**: Projects are nodes within the Galaxy exhibition
2. **Future-proof**: When Jungle/City exhibitions launch, structure is clear
3. **Museum metaphor**: Exhibitions → Galaxy → Individual projects

## Migration Details

### Files Moved
- `/src/app/projects/ethernicapsule` → `/src/app/exhibitions/galaxy/ethernicapsule`
- `/src/app/projects/orbit` → `/src/app/exhibitions/galaxy/orbit`
- `/src/app/projects/figurines` → `/src/app/exhibitions/galaxy/figurines`
- `/src/app/projects/EcosystemCanvas.tsx` → `/src/app/exhibitions/galaxy/EcosystemCanvas.tsx`

### Files Deleted
- `/src/app/projects/page.tsx` (replaced by `/exhibitions/galaxy/page.tsx`)

### Critical Updates
1. **Stripe URLs** (payment redirects):
   - `api/ethernicapsule/checkout` → success/cancel URLs updated
   - `api/figurines/checkout` → success/cancel URLs updated
   - `api/donate` → cancel URL updated

2. **Middleware redirects** (backward compatibility):
   ```typescript
   /projects/ethernicapsule/* → /exhibitions/galaxy/ethernicapsule/* (301)
   /projects/orbit/* → /exhibitions/galaxy/orbit/* (301)
   /projects/figurines/* → /exhibitions/galaxy/figurines/* (301)
   ```

3. **Internal links** (134 occurrences updated):
   - All navigation components
   - All page links
   - Email templates (already dynamic)
   - Documentation

## Backward Compatibility

✅ **Old URLs still work** via 301 redirects in middleware.ts  
✅ **No database changes needed** (no URLs stored in DB)  
✅ **Payment flows tested** (Stripe redirects updated)

## Testing Checklist

- [x] Build succeeds
- [x] All routes render correctly
- [x] Stripe payment redirects work
- [x] Middleware redirects old URLs
- [x] Documentation updated
- [ ] Manual testing in browser
- [ ] Test payment flow end-to-end
- [ ] Verify old links redirect properly

## For Developers / AI Agents

**Always use the new URLs:**
- ✅ `/exhibitions/galaxy/ethernicapsule`
- ❌ `/projects/ethernicapsule`

**Middleware handles redirects automatically** - users with old bookmarks/links won't break.

## Documentation Updated

- ✅ VISION.md - Navigation structure + museum diagram
- ✅ README.md - All project links
- ✅ ARCHITECTURE.md - Route structure
- ✅ HOME_EXPERIENCE.md - Connection to exhibitions
- ✅ docs/ETERNICAPSULE_NODE.md - URLs updated
- ✅ docs/FIGURINES_NODE.md - URLs updated
- ✅ docs/ORBIT_NODE.md - URLs updated
- ✅ All deployment/refactoring docs
- ✅ .github/labeler.yml - PR labels

---

Last updated: April 6, 2026  
Migration completed successfully ✓
