<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  idx: { type: Number, required: true },
  canMoveUp: { type: Boolean, default: false },
  canMoveDown: { type: Boolean, default: false },
  manifestURL: { type: String, required: true },
  logoURL: { type: String, required: false },
  isDeletable: { type: Boolean, required: false, default: true },
  isConfigurable: { type: Boolean, required: false, default: false }
})

const emits = defineEmits(['delete-addon', 'edit-manifest', 'move-addon'])

const defaultLogo = 'https://icongr.am/feather/box.svg?size=48&color=6366f1'
const copied = ref(false)

function copyManifestURLToClipboard() {
  navigator.clipboard.writeText(props.manifestURL).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }).catch((error) => {
    console.error('Error copying text to clipboard', error)
  })
}

function openAddonConfigurationPage() {
  const configureURL = props.manifestURL.replace("stremio://", "https://").replace("/manifest.json", "/configure")
  window.open(configureURL, '_blank', 'noopener,noreferrer')
}

function removeAddon() {
  emits('delete-addon', props.idx)
}

function openEditManifestModal() {
  emits('edit-manifest', props.idx)
}
</script>

<template>
  <div class="addon-row">
    <div class="row-left">
      <!-- Drag Grip -->
      <div class="drag-handle" title="اسحب لإعادة الترتيب Drag to reorder">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/>
          <circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/>
          <circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>
        </svg>
      </div>

      <!-- Index Badge -->
      <span class="index-number">{{ idx + 1 }}</span>

      <!-- Addon Logo -->
      <div class="logo-wrapper">
        <img :src="logoURL || defaultLogo" :alt="name" @error="e => e.target.src = defaultLogo" />
      </div>

      <!-- Name & Badges -->
      <div class="addon-meta">
        <span class="addon-name" :title="name">{{ name }}</span>
        <div class="addon-badges">
          <span v-if="!isDeletable" class="badge warning mini">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>محمي Protected</span>
          </span>
          <span v-if="isConfigurable" class="badge primary mini">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>قابل للتكوين</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="row-actions">
      <button class="icon-only" type="button" :disabled="!canMoveUp" :aria-label="($i18n.locale === 'ar' ? 'تحريك لأعلى: ' : 'Move up: ') + name" :title="$i18n.locale === 'ar' ? 'تحريك لأعلى' : 'Move up'" @click="emits('move-addon', { index: idx, offset: -1 })">↑</button>
      <button class="icon-only" type="button" :disabled="!canMoveDown" :aria-label="($i18n.locale === 'ar' ? 'تحريك لأسفل: ' : 'Move down: ') + name" :title="$i18n.locale === 'ar' ? 'تحريك لأسفل' : 'Move down'" @click="emits('move-addon', { index: idx, offset: 1 })">↓</button>
      <!-- Configure -->
      <button 
        class="icon-only" 
        :title="isConfigurable ? $t('addon.openConfig') : 'هذه الإضافة لا تدعم التكوين المباشر'" 
        :disabled="!isConfigurable" 
        @click="openAddonConfigurationPage"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      <!-- Copy Manifest URL -->
      <button class="icon-only" :class="{ 'copied': copied }" :title="copied ? 'تم النسخ بنجاح!' : $t('addon.copyUrl')" @click="copyManifestURLToClipboard">
        <svg v-if="!copied" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="success-icon">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>

      <!-- Edit Manifest -->
      <button class="icon-only" :title="$t('addon.editManifest')" @click="openEditManifestModal">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      <!-- Delete -->
      <button 
        class="icon-only delete" 
        :title="isDeletable ? $t('addon.remove') : 'هذه الإضافة محمية ولا يمكن حذفها'" 
        :disabled="!isDeletable" 
        @click="removeAddon"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.addon-row {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: 0.85rem 1.15rem;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.65rem;
  cursor: default;
  gap: 1rem;
}

.addon-row:hover {
  background: var(--card-bg-hover);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: var(--shadow-md);
}

html[dir="rtl"] .addon-row:hover {
  transform: translateX(4px);
}

html[dir="ltr"] .addon-row:hover {
  transform: translateX(-4px);
}

.row-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex: 1;
  min-width: 0;
}

.drag-handle {
  color: var(--text-muted);
  cursor: grab;
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: var(--transition);
  flex-shrink: 0;
  padding: 0.25rem;
  border-radius: var(--radius-xs);
}

.addon-row:hover .drag-handle {
  opacity: 1;
  color: var(--accent-1);
  background: var(--info-bg);
}

.drag-handle:active {
  cursor: grabbing;
}

.index-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}

.logo-wrapper {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition);
}

.addon-row:hover .logo-wrapper {
  border-color: var(--accent-2);
}

.logo-wrapper img {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.addon-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
}

.addon-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.98rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.addon-badges {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.badge.mini {
  padding: 0.15rem 0.55rem;
  font-size: 0.68rem;
  gap: 0.25rem;
}

.row-actions {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  flex-shrink: 0;
}

.icon-only.copied {
  background: var(--success-bg) !important;
  color: var(--success) !important;
  border-color: var(--success) !important;
}

.success-icon {
  animation: pulse 0.3s ease;
}

@media (max-width: 640px) {
  .addon-row {
    padding: 0.75rem 0.9rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .row-actions {
    width: 100%;
    justify-content: flex-end;
    border-top: 1px solid var(--border-color);
    padding-top: 0.65rem;
  }
}
</style>
