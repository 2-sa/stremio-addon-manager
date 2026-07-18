<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  manifest: { type: Object, required: true }
})

const emits = defineEmits(['update-manifest'])

const isAdvancedMode = ref(false)
const formModel = ref({ name: '', description: '', logo: '', background: '', catalogs: [] })
const jsonModel = ref('')
const jsonError = ref('')

watch(() => props.manifest, (newManifest) => {
  formModel.value = JSON.parse(JSON.stringify(newManifest || {}))
  jsonModel.value = JSON.stringify(newManifest || {}, null, 2)
  jsonError.value = ''
}, { immediate: true })

onMounted(() => {
  calculateMaxLabelWidth()
})

function calculateMaxLabelWidth() {
  const labels = document.querySelectorAll('.catalog-type-label')
  let maxWidth = 0
  labels.forEach(label => {
    maxWidth = Math.max(maxWidth, label.scrollWidth)
  })
  labels.forEach(label => {
    label.style.width = `${maxWidth}px`
  })
}

function toggleEditMode(advanced) {
  if (advanced === isAdvancedMode.value) return
  if (isAdvancedMode.value && !advanced) {
    try {
      formModel.value = JSON.parse(jsonModel.value)
      jsonError.value = ''
      isAdvancedMode.value = false
      setTimeout(() => calculateMaxLabelWidth(), 50)
    } catch (e) {
      jsonError.value = t('dynamicForm.invalidJson') + ' - ' + e.message
      return
    }
  } else {
    jsonModel.value = JSON.stringify(formModel.value, null, 2)
    isAdvancedMode.value = true
  }
}

function handleSubmit() {
  emits('update-manifest', formModel.value)
}

function removeCatalog(index) {
  if (Array.isArray(formModel.value.catalogs)) {
    formModel.value.catalogs.splice(index, 1)
  }
}

function updateFromJson() {
  try {
    const parsed = JSON.parse(jsonModel.value)
    jsonError.value = ''
    emits('update-manifest', parsed)
  } catch (e) {
    jsonError.value = t('dynamicForm.invalidJson') + ' - ' + e.message
  }
}
</script>

<template>
  <div class="dynamic-form-wrapper">
    <!-- Mode Switcher Tabs -->
    <div class="mode-switcher">
      <button 
        type="button" 
        class="switch-btn" 
        :class="{ 'active': !isAdvancedMode }" 
        @click="toggleEditMode(false)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
        <span>{{ $t('dynamicForm.classicMode') }}</span>
      </button>

      <button 
        type="button" 
        class="switch-btn" 
        :class="{ 'active': isAdvancedMode }" 
        @click="toggleEditMode(true)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
        <span>{{ $t('dynamicForm.advancedMode') }} (JSON)</span>
      </button>
    </div>

    <!-- Classic Mode Form -->
    <form v-if="!isAdvancedMode" @submit.prevent="handleSubmit" class="form-body">
      <div class="form-group">
        <label for="name">{{ $t('dynamicForm.name') }}</label>
        <input id="name" name="name" type="text" v-model="formModel.name" required />
      </div>

      <div class="form-group">
        <label for="description">{{ $t('dynamicForm.description') }}</label>
        <textarea id="description" name="description" rows="3" v-model="formModel.description"></textarea>
      </div>

      <div class="row-inputs">
        <div class="form-group flex-1">
          <label for="logo">{{ $t('dynamicForm.logo') }}</label>
          <input id="logo" name="logo" type="url" v-model="formModel.logo" placeholder="https://..." />
        </div>

        <div class="form-group flex-1">
          <label for="background">{{ $t('dynamicForm.background') }}</label>
          <input id="background" name="background" type="url" v-model="formModel.background" placeholder="https://..." />
        </div>
      </div>

      <!-- Catalogs List -->
      <div v-if="formModel.catalogs && formModel.catalogs.length > 0" class="form-group mt-2">
        <label class="catalogs-main-label">{{ $t('dynamicForm.catalogs') }} ({{ formModel.catalogs.length }})</label>
        <div class="catalogs-list">
          <div v-for="(catalog, index) in formModel.catalogs" :key="index" class="catalog-item">
            <span class="catalog-type-badge">{{ catalog.type || 'general' }}</span>
            <div class="catalog-input-group">
              <input type="text" v-model="catalog.name" :placeholder="$t('dynamicForm.catalogName')" />
              <button type="button" class="icon-only delete" title="حذف الكتالوج" @click="removeCatalog(index)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions mt-4">
        <button class="button primary" type="submit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ $t('dynamicForm.save') }}</span>
        </button>
      </div>
    </form>

    <!-- JSON Advanced Mode -->
    <div v-else class="form-body">
      <div class="json-wrapper">
        <textarea v-model="jsonModel" rows="14" class="json-editor" placeholder="{}"></textarea>
      </div>
      
      <div v-if="jsonError" class="json-error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ jsonError }}</span>
      </div>

      <div class="form-actions mt-4">
        <button class="button primary" type="button" @click="updateFromJson">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ $t('dynamicForm.save') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dynamic-form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.mode-switcher {
  display: flex;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.25rem;
  gap: 0.25rem;
}

.switch-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.6rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: var(--transition);
}

.switch-btn:hover {
  color: var(--text-primary);
}

.switch-btn.active {
  background: var(--card-bg);
  color: var(--accent-1);
  box-shadow: var(--shadow-sm);
}

.form-body {
  display: flex;
  flex-direction: column;
}

.row-inputs {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
  min-width: 0;
}

.catalogs-main-label {
  font-size: 0.92rem;
  color: var(--accent-2);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.45rem;
  margin-bottom: 0.75rem;
}

.catalogs-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

html[dir="ltr"] .catalogs-list {
  padding-right: 0;
  padding-left: 0.5rem;
}

.catalog-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.catalog-type-badge {
  font-weight: 700;
  background: var(--info-bg);
  color: var(--accent-2);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.catalog-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
}

.catalog-input-group input {
  padding: 0.55rem 0.85rem;
  font-size: 0.88rem;
}

.json-wrapper {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  transition: var(--transition);
}

.json-wrapper:focus-within {
  border-color: var(--accent-2);
  box-shadow: 0 0 0 4px var(--info-bg);
}

.json-editor {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: 'SF Mono', 'Consolas', 'Fira Code', monospace;
  font-size: 0.86rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.json-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--danger-bg);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

@media (max-width: 580px) {
  .row-inputs {
    flex-direction: column;
    gap: 0;
  }
  .catalog-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .catalog-input-group {
    width: 100%;
  }
}
</style>
