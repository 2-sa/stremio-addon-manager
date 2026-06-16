<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import AddonItem from './AddonItem.vue'
import Authentication from './Authentication.vue'
import DynamicForm from './DynamicForm.vue'
import { useI18n } from 'vue-i18n'

const stremioAPIBase = "https://api.strem.io/api/"
const dragging = ref(false)
const stremioAuthKey = ref('')
const addons = ref([])
const isLoading = ref(false)
const isSyncing = ref(false)

const { t } = useI18n()
const loadAddonsButtonText = ref(t('config.loadAddons'))

const isEditModalVisible = ref(false)
const currentManifest = ref({})
const currentEditIdx = ref(null)

async function loadUserAddons() {
  const key = stremioAuthKey.value
  if (!key) {
    console.error('No auth key provided')
    return
  }

  isLoading.value = true
  loadAddonsButtonText.value = t('config.loading')

  try {
    const resp = await fetch(`${stremioAPIBase}addonCollectionGet`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'AddonCollectionGet',
        authKey: key,
        update: true,
      })
    })
    const data = await resp.json()
    if (!('result' in data) || data.result == null) {
      console.error('Failed to fetch user addons: ', data)
      alert('Failed to fetch user addons - are you sure you pasted the correct Stremio AuthKey?')
      return
    }
    addons.value = data.result.addons
  } catch (error) {
    console.error('Error fetching user addons', error)
    alert('Error fetching addons: ' + error.message)
  } finally {
    isLoading.value = false
    loadAddonsButtonText.value = t('config.loadAddons')
  }
}

async function syncUserAddons() {
  const key = stremioAuthKey.value
  if (!key) {
    console.error('No auth key provided')
    return
  }

  isSyncing.value = true

  try {
    const resp = await fetch(`${stremioAPIBase}addonCollectionSet`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'AddonCollectionSet',
        authKey: key,
        addons: addons.value,
      })
    })
    const data = await resp.json()
    if (!('result' in data) || data.result == null) {
      console.error('Sync failed: ', data)
      alert('Sync failed due to unknown error')
    } else if (!data.result.success) {
      alert('Failed to sync addons: ' + data.result.error)
    } else {
      alert('Sync complete!')
    }
  } catch (error) {
    alert('Error syncing addons: ' + error.message)
    console.error('Error fetching user addons', error)
  } finally {
    isSyncing.value = false
  }
}

function removeAddon(idx) {
  addons.value.splice(idx, 1)
}

function getNestedObjectProperty(obj, path, defaultValue = null) {
  try {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  } catch (e) {
    return defaultValue
  }
}

function setAuthKey(authKey) {
  stremioAuthKey.value = authKey.trim()
}

function openEditModal(idx) {
  isEditModalVisible.value = true
  currentEditIdx.value = idx
  currentManifest.value = { ...addons.value[idx].manifest }
  document.body.classList.add('modal-open')
}

function closeEditModal() {
  isEditModalVisible.value = false
  currentManifest.value = {}
  currentEditIdx.value = null
  document.body.classList.remove('modal-open')
}

function saveManifestEdit(updatedManifest) {
  try {
    addons.value[currentEditIdx.value].manifest = updatedManifest
    closeEditModal()
  } catch (e) {
    alert('Failed to update manifest')
  }
}
</script>

<template>
  <section id="configure">
    <div class="card">
      <h3>{{ $t('config.step0') }}</h3>
      <Authentication :stremioAPIBase="stremioAPIBase" @auth-key="setAuthKey" />
    </div>

    <div class="card">
      <h3>{{ $t('config.step1') }}</h3>
      <p>{{ $t('summary.step2') }}</p>
      <button class="button primary" @click="loadUserAddons" :disabled="isLoading || !stremioAuthKey">
        <span v-if="isLoading" class="spinner"></span>
        {{ loadAddonsButtonText }}
      </button>
    </div>

    <div class="card">
      <h3>{{ $t('config.step2') }}</h3>
      <p v-if="addons.length === 0" class="empty-state">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
        <span>Load addons first to see them here</span>
      </p>
      <draggable v-if="addons.length > 0" :list="addons" item-key="transportUrl" class="sortable-list" ghost-class="ghost" @start="dragging = true" @end="dragging = false">
        <template #item="{ element, index }">
          <AddonItem
            :name="element.manifest.name"
            :idx="index"
            :manifestURL="element.transportUrl"
            :logoURL="element.manifest.logo"
            :isDeletable="!getNestedObjectProperty(element, 'flags.protected', false)"
            :isConfigurable="getNestedObjectProperty(element, 'manifest.behaviorHints.configurable', false)"
            @delete-addon="removeAddon"
            @edit-manifest="openEditModal"
          />
        </template>
      </draggable>
    </div>

    <div class="card">
      <h3>{{ $t('config.step3') }}</h3>
      <button class="button primary" @click="syncUserAddons" :disabled="isSyncing || addons.length === 0">
        <span v-if="isSyncing" class="spinner"></span>
        {{ $t('config.syncToStremio') }}
      </button>
    </div>

    <div v-if="isEditModalVisible" class="modal" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('config.editManifest') }}</h3>
          <button class="icon-only modal-close" @click="closeEditModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <DynamicForm :manifest="currentManifest" @update-manifest="saveManifestEdit" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.sortable-list {
  border-radius: var(--radius-lg);
  min-height: 60px;
  padding: 0.25rem 0;
}

.ghost {
  opacity: 0.35;
  background: var(--accent-gradient) !important;
  border-radius: var(--radius-lg) !important;
  transform: scale(1.02);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.empty-state svg {
  opacity: 0.4;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin-bottom: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
}
</style>
