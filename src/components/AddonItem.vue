<script setup>
const props = defineProps({
  name: { type: String, required: true },
  idx: { type: Number, required: true },
  manifestURL: { type: String, required: true },
  logoURL: { type: String, required: false },
  isDeletable: { type: Boolean, required: false, default: true },
  isConfigurable: { type: Boolean, required: false, default: false }
})

const emits = defineEmits(['delete-addon', 'edit-manifest'])

const defaultLogo = 'https://icongr.am/feather/box.svg?size=48&color=6366f1'

function copyManifestURLToClipboard() {
  navigator.clipboard.writeText(props.manifestURL).then(() => {
    console.log('Text copied to clipboard')
  }).catch((error) => {
    console.error('Error copying text to clipboard', error)
  })
}

function openAddonConfigurationPage() {
  const configureURL = props.manifestURL.replace("stremio://", "https://").replace("/manifest.json", "/configure")
  window.open(configureURL)
}

function removeAddon() {
  emits('delete-addon', props.idx)
}

function openEditManifestModal() {
  emits('edit-manifest', props.idx)
}
</script>

<template>
  <div class="item">
    <div class="item-left">
      <div class="drag-handle">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/>
        </svg>
      </div>
      <div class="logo-wrapper">
        <img :src="logoURL || defaultLogo" :alt="name" />
      </div>
      <span class="addon-name">{{ name }}</span>
    </div>
    <div class="item-actions">
      <button class="icon-only" :title="$t('addon.openConfig')" :disabled="!isConfigurable" @click="openAddonConfigurationPage">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
        </svg>
      </button>
      <button class="icon-only" :title="$t('addon.copyUrl')" @click="copyManifestURLToClipboard">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
      <button class="icon-only" :title="$t('addon.editManifest')" @click="openEditManifestModal">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button class="icon-only delete" :title="$t('addon.remove')" :disabled="!isDeletable" @click="removeAddon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.item {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  cursor: default;
  gap: 0.75rem;
}

.item:hover {
  background: var(--card-bg-hover);
  border-color: var(--accent-2);
  box-shadow: var(--shadow-md);
}

html[dir="rtl"] .item:hover {
  transform: translateX(4px);
}

html[dir="ltr"] .item:hover {
  transform: translateX(-4px);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
}

.item:hover .drag-handle {
  opacity: 1;
  color: var(--accent-2);
}

.drag-handle:active {
  cursor: grabbing;
}

.logo-wrapper {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.logo-wrapper img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  object-position: center;
}

.addon-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-actions {
  display: flex;
  gap: 0.375rem;
  align-items: center;
  flex-shrink: 0;
}

.icon-only {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.icon-only:hover:not(:disabled) {
  background: var(--card-bg-hover);
  color: var(--text-primary);
  border-color: var(--accent-2);
  transform: translateY(-1px);
}

.icon-only:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.icon-only.delete:hover:not(:disabled) {
  background: var(--danger-bg);
  color: var(--danger);
  border-color: var(--danger);
}

@media (max-width: 640px) {
  .item {
    padding: 0.625rem 0.75rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .item-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
