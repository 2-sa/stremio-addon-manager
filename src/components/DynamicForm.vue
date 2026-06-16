<template>
  <form @submit.prevent="handleSubmit">
    <div v-if="!isAdvancedMode">
      <div class="form-group">
        <label for="name">{{ $t('dynamicForm.name') }}</label>
        <input id="name" name="name" type="text" v-model="formModel.name" />
      </div>

      <div class="form-group">
        <label for="description">{{ $t('dynamicForm.description') }}</label>
        <textarea id="description" name="description" rows="4" v-model="formModel.description"></textarea>
      </div>

      <div class="form-group">
        <label for="logo">{{ $t('dynamicForm.logo') }}</label>
        <input id="logo" name="logo" type="text" v-model="formModel.logo" />
      </div>

      <div class="form-group">
        <label for="background">{{ $t('dynamicForm.background') }}</label>
        <input id="background" name="background" type="text" v-model="formModel.background" />
      </div>

      <div v-if="formModel.catalogs && formModel.catalogs.length > 0" class="form-group">
        <label>{{ $t('dynamicForm.catalogs') }}</label>
        <div v-for="(catalog, index) in formModel.catalogs" :key="catalog.type" class="catalog-item">
          <span class="catalog-type-label">{{ catalog.type }}</span>
          <div class="catalog-input-group">
            <input type="text" v-model="catalog.name" :placeholder="$t('dynamicForm.catalogName')" />
            <button type="button" class="icon-only delete" @click="removeCatalog(index)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="button primary" type="submit">{{ $t('dynamicForm.save') }}</button>
        <button class="button outline" type="button" @click="toggleEditMode">{{ $t('dynamicForm.advancedMode') }}</button>
      </div>
    </div>

    <div v-else>
      <textarea v-model="jsonModel" rows="12" class="json-editor"></textarea>
      <div class="form-actions" style="margin-top: 1rem;">
        <button class="button primary" type="button" @click="updateFromJson">{{ $t('dynamicForm.save') }}</button>
        <button class="button outline" type="button" @click="toggleEditMode">{{ $t('dynamicForm.classicMode') }}</button>
      </div>
    </div>
  </form>
</template>

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

watch(() => props.manifest, (newManifest) => {
  formModel.value = JSON.parse(JSON.stringify(newManifest))
  jsonModel.value = JSON.stringify(newManifest, null, 2)
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

function toggleEditMode() {
  isAdvancedMode.value = !isAdvancedMode.value
  if (!isAdvancedMode.value) {
    try {
      formModel.value = JSON.parse(jsonModel.value)
      calculateMaxLabelWidth()
    } catch (e) {
      alert(t('dynamicForm.invalidJson'))
    }
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
    formModel.value = JSON.parse(jsonModel.value)
    emits('update-manifest', formModel.value)
    isAdvancedMode.value = false
  } catch (e) {
    alert(t('dynamicForm.invalidJson'))
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.375rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

input, textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  transition: var(--transition);
  outline: none;
}

input:focus, textarea:focus {
  border-color: var(--accent-2);
  box-shadow: 0 0 0 4px var(--info-bg);
  background: var(--card-bg);
}

textarea {
  resize: vertical;
  line-height: 1.6;
}

.catalog-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.catalog-type-label {
  font-weight: 700;
  color: var(--accent-2);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.catalog-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.catalog-input-group input {
  flex: 1;
  min-width: 0;
}

.icon-only {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}

.icon-only:hover {
  background: var(--card-bg-hover);
  color: var(--text-primary);
  border-color: var(--accent-2);
}

.icon-only.delete:hover {
  background: var(--danger-bg);
  color: var(--danger);
  border-color: var(--danger);
}

.json-editor {
  width: 100%;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: var(--transition);
}

.json-editor:focus {
  border-color: var(--accent-2);
  box-shadow: 0 0 0 4px var(--info-bg);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .catalog-item {
    padding: 0.5rem;
  }

  .catalog-input-group {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .button {
    width: 100%;
  }
}
</style>
