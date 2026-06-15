<script setup>
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    idx: {
      type: Number,
      required: true
    },
    manifestURL: {
      type: String,
      required: true
    },
    logoURL: {
      type: String,
      required: false
    },
    isDeletable: {
      type: Boolean,
      required: false,
      default: true
    },
    isConfigurable: {
      type: Boolean,
      required: false,
      default: false
    }
  })
  
  const emits = defineEmits(['delete-addon', 'edit-manifest'])
  
  const defaultLogo = 'https://icongr.am/feather/box.svg?size=48&color=ffffff'
  
  function copyManifestURLToClipboard() {
    navigator.clipboard.writeText(props.manifestURL).then(() => {
      console.log('Text copied to clipboard')
    }).catch((error) => {
      console.error('Error copying text to clipboard', error)
    })
  }
  
  function openAddonConfigurationPage() {
    const configureURL = props.manifestURL.replace("stremio://", "https://").replace("/manifest.json", "/configure");
    window.open(configureURL);
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
    <div class="col-8">
      <div class="details">
        <div class="logo_container">
          <img :src="logoURL || defaultLogo" />
        </div>
        <span>{{ name }}</span>
      </div>
    </div>
    <div class="col">
      <button class="button icon-only visit-url" :title="$t('addon.openConfig')"
        :disabled="!isConfigurable" @click="openAddonConfigurationPage">
        <img src="https://icongr.am/feather/arrow-up-right.svg?size=12">
      </button>
      <button class="button icon-only copy-url" :title="$t('addon.copyUrl')"
        @click="copyManifestURLToClipboard">
        <img src="https://icongr.am/feather/clipboard.svg?size=12">
      </button>
      <button class="button icon-only edit-manifest" :title="$t('addon.editManifest')" @click="openEditManifestModal">
        <img src="https://icongr.am/feather/edit.svg?size=12">
      </button>
      <button class="button icon-only delete" :title="$t('addon.remove')" :disabled="!isDeletable"
        @click="removeAddon">
        <img src="https://icongr.am/feather/trash-2.svg?size=12">
      </button>
    </div>
    <i class="uil uil-draggabledots"></i>
  </div>
</template>

<style scoped>
.logo_container img {
  height: 60px;
  width: 60px;
  object-fit: contain;
  object-position: center;
  border-radius: var(--radius-sm);
  background-color: var(--bg-color);
  margin-left: 12px;
}

.details {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text-primary);
}

.col {
  display: flex;
  gap: 8px;
  align-items: center;
}

.uil-draggabledots {
  cursor: grab;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.uil-draggabledots:active {
  cursor: grabbing;
}

@media (max-width: 768px) {
  .item {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }
  
  .col {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
