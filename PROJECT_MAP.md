# Stremio Addon Manager - Project Map

## [TECH_STACK]
- **Runtime**: Node.js (LTS), Docker (multi-stage build)
- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Build**: Vite 5 + @vitejs/plugin-vue
- **CSS**: Custom Glassmorphic CSS (`main.css`) with CSS variables (sleek dark `#080c14` / light `#f8fafc` modes, glowing gradients, micro-animations, and dynamic RTL/LTR support).
- **State**: Vue refs (reactive), `localStorage` (`darkMode` preference, `userLanguage` choice)
- **Icons**: Inline SVGs (Feather-style modern icons)
- **i18n**: vue-i18n 11 (Full AR/EN bilingual UI with automatic document `dir` orientation)
- **Drag**: vuedraggable 4 (drag-and-drop sortable list with custom drag handles)
- **Analytics**: @vercel/analytics

## [SYSTEM_FLOW]
```
User → Navbar (Language AR/EN Toggle + Theme Switch)
     → InfoGuide (Expandable Why/How Guide + Security Verification)
     → Auth (Tab 1: Email/Password OR Tab 2: AuthKey with Console Helper Snippet) → Active Session Badge
     → Workflow Stepper (4 Steps Progress Tracker)
     → Load Addons (POST addonCollectionGet) → Stats Summary + Instant Filter/Search
     → Drag & Drop Reorder (Protected vs Configurable indicators)
     → Edit Manifest Modal (Tabbed: Classic Form vs Raw JSON Editor)
     → Sync (POST addonCollectionSet) → Stremio Profile Cloud
```

### User Journey & Verifiable Goals
1. **Navigation & Theme**: User toggles language (AR ↔ EN) or dark/light theme seamlessly via `Navbar.vue` ✅
2. **Onboarding**: User expands `InfoGuide.vue` or FAQ accordion (`Faq.vue`) to understand safety and workflow ✅
3. **Authentication**: User logs in via credentials or copies AuthKey from Stremio Web console using built-in snippet helper → `Authentication.vue` emits `auth-key` and shows connected badge ✅
4. **Load & Filter**: User clicks "Load Addons" → items displayed with total/protected stats and real-time search filtering (`Configuration.vue`) ✅
5. **Reorder & Actions**: User drags custom grip handles to reorder, copies addon URLs with instant checkmark feedback, or launches configure page (`AddonItem.vue`) ✅
6. **Edit Manifest**: User opens glassmorphic modal (`DynamicForm.vue`) to edit metadata via classic inputs/catalogs or live syntax-checked JSON editor ✅
7. **Sync**: User clicks "Sync to Stremio" → new order is pushed via API (`addonCollectionSet`) with success toast confirmation ✅

## [ARCHITECTURE]
### Directory Structure
```
src/
├── assets/
│   └── main.css              # Glassmorphic tokens, glowing gradients, RTL/LTR layout & modal styles
├── components/
│   ├── Navbar.vue             # Top nav bar with live AR/EN language switch & theme toggle
│   ├── DarkModeToggle.vue     # Interactive sun/moon button component used inside Navbar
│   ├── Header.vue             # Floating animated hero logo, gradient title & tagline pill
│   ├── InfoGuide.vue          # Expandable guide banner ("Why & How") with warning notices
│   ├── Authentication.vue     # Tabbed login card (Email/Password vs AuthKey + console snippet copy)
│   ├── Configuration.vue      # Main orchestrator: 4-step progress bar, stats, filter box, list & sync
│   ├── AddonItem.vue          # Addon card (drag-handle, index, badges, copy url, configure, edit, delete)
│   ├── DynamicForm.vue        # Manifest editor modal (Classic form vs JSON mode switcher + error check)
│   ├── Faq.vue                # Interactive bilingual FAQ accordion component
│   └── Footer.vue             # Modern footer with pulsing heart & GitHub repository pill link
├── App.vue                    # Root layout integrating all components smoothly
├── i18n.js                    # AR & EN translation dictionary
└── main.js                    # App bootstrap & analytics registration
```

### Data Flow & Component Communication
- `Navbar.vue` → manages `locale.value` (`ar`/`en`) and sets `document.documentElement.setAttribute('dir', 'rtl'/'ltr')` + stores preference in `localStorage('userLanguage')`.
- `Authentication.vue` → emits `auth-key(string)` → `Configuration.vue` receives and stores `stremioAuthKey`.
- `Configuration.vue` → computes `filteredAddons` based on `searchQuery` and tracks `currentStep` (0: Auth, 1: Load, 2: Reorder, 3: Sync).
- `AddonItem.vue` → emits `delete-addon(idx)` / `edit-manifest(idx)` → `Configuration.vue` mutates `addons[]` or opens modal.
- `DynamicForm.vue` → emits `update-manifest(obj)` → `Configuration.vue` updates `addons[currentEditIdx].manifest`.
- `vuedraggable` → bound directly to `addons[]` when search query is cleared, reordering array in-place.

### Theme & Design Tokens
- `:root` = Light mode variables (`#f8fafc`, `card-bg: rgba(255, 255, 255, 0.85)`).
- `body.dark` = Rich deep dark override variables (`#080c14`, `card-bg: rgba(17, 24, 39, 0.75)`).
- Preference stored in `localStorage('darkMode')` with automatic detection via `window.matchMedia('(prefers-color-scheme: dark)')`.
- Typography: Google Fonts `Outfit` (for LTR/English) and `Noto Sans Arabic` (for RTL/Arabic).

## [ORPHANS & PENDING]
- `chota` CSS framework: listed in `package.json` (`^0.9.2`) but fully overridden by our modern custom styles (`main.css`). Safe to remove in future cleanup.
- `@vercel/analytics`: initialized in `main.js`.
- Test suite: currently no automated test runner (e.g. Vitest) configured.
