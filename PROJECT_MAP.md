# Stremio Addon Manager - Project Map

## [TECH_STACK]
- **Runtime**: Node.js (LTS), Docker (multi-stage build)
- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Build**: Vite 5 + @vitejs/plugin-vue
- **CSS**: Custom CSS with CSS variables (dual theme: dark/light), chota (minimal)
- **State**: Vue refs (reactive), localStorage (dark mode preference)
- **Icons**: Inline SVGs (Feather-style)
- **i18n**: vue-i18n 11 (AR/EN with RTL support)
- **Drag**: vuedraggable 4
- **Analytics**: @vercel/analytics
- **Devenv**: devenv.nix (Nix shell)

## [SYSTEM_FLOW]
```
User → Auth (email/password OR AuthKey) → Stremio API Login
     → Load Addons (GET addonCollectionGet) → Display + Drag Sort
     → Edit Manifest (Classic/Advanced Mode)
     → Sync (SET addonCollectionSet) → Stremio Profile
```

### User Journey (Verifiable Goals)
1. **Auth**: User provides credentials → gets authKey → UI shows logged-in state ✅
2. **Load**: User clicks "Load" → addons fetched + rendered as draggable list ✅
3. **Reorder**: User drag-and-drop addons → list order updates in-memory ✅
4. **Edit**: User edits addon manifest via modal (classic form or raw JSON) ✅
5. **Sync**: User clicks "Sync" → order POSTed to Stremio API ✅

## [ARCHITECTURE]
### Directory Structure
```
src/
├── assets/
│   └── main.css              # Global styles, theme vars (dark/light)
├── components/
│   ├── Header.vue             # App title + tagline
│   ├── DarkModeToggle.vue     # Dark/light toggle (SVG sun/moon)
│   ├── Authentication.vue     # Email/password + AuthKey login
│   ├── Configuration.vue      # Orchestrator: load, drag-list, sync, edit-modal
│   ├── AddonItem.vue          # Single addon row (drag-handle, logo, name, actions)
│   ├── DynamicForm.vue        # Manifest editor (classic form + JSON mode)
│   └── Footer.vue             # Credits + GitHub link
├── App.vue                    # Root layout
├── i18n.js                    # EN/AR translations
└── main.js                    # App bootstrap
```

### Data Flow
- `Authentication.vue` → emits `auth-key` → `Configuration.vue` stores `stremioAuthKey`
- `AddonItem.vue` → emits `delete-addon(idx)` / `edit-manifest(idx)` → `Configuration.vue` mutates `addons[]`
- `DynamicForm.vue` → emits `update-manifest(obj)` → `Configuration.vue` patches `addons[idx].manifest`
- `vuedraggable` bound to `addons[]` → reorder mutates array in-place

### Theme System
- `:root` = light mode variables
- `body.dark` = dark mode override variables
- preference stored in `localStorage('darkMode')`
- system preference detected via `prefers-color-scheme: dark`

## [ORPHANS & PENDING]
- `chota` CSS framework: installed but barely used, candidate for removal
- `@vercel/analytics`: injected in main.js, no privacy/consent notice
- Test suite: none (no test runner configured)
- Error boundaries: none (Vue app-level error handling)
- Loading skeletons: addon list has basic loading text, could use skeleton UI
- Auth token refresh: not handled
- Responsive touch: basic RTL support present, mobile UX needs verification
