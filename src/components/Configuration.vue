<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import AddonItem from './AddonItem.vue'
import Authentication from './Authentication.vue'
import DynamicForm from './DynamicForm.vue'
import { useI18n } from 'vue-i18n'
import { moveAddon } from '../utils/addon-order.js'

const stremioAPIBase = "https://api.strem.io/api/"
const dragging = ref(false)
const stremioAuthKey = ref('')
const addons = ref([])
const isLoading = ref(false)
const isSyncing = ref(false)
const searchQuery = ref('')
const syncSuccess = ref(false)
const reorderAnnouncement = ref('')

const { t } = useI18n()
const loadAddonsButtonText = ref(t('config.loadAddons'))

const isEditModalVisible = ref(false)
const currentManifest = ref({})
const currentEditIdx = ref(null)

// Stats Computed
const protectedCount = computed(() => {
  return addons.value.filter(a => getNestedObjectProperty(a, 'flags.protected', false)).length
})

const configurableCount = computed(() => {
  return addons.value.filter(a => getNestedObjectProperty(a, 'manifest.behaviorHints.configurable', false)).length
})

// Filtered Addons for display when searching
const filteredAddons = computed(() => {
  if (!searchQuery.value.trim()) return addons.value
  const q = searchQuery.value.toLowerCase().trim()
  return addons.value.filter(a => {
    const name = (a.manifest.name || '').toLowerCase()
    const desc = (a.manifest.description || '').toLowerCase()
    return name.includes(q) || desc.includes(q)
  })
})

// Stepper Status computed
const currentStep = computed(() => {
  if (!stremioAuthKey.value) return 0
  if (addons.value.length === 0) return 1
  return 2
})

async function loadUserAddons() {
  const key = stremioAuthKey.value
  if (!key) {
    console.error('No auth key provided')
    return
  }

  isLoading.value = true
  loadAddonsButtonText.value = t('config.loading')
  searchQuery.value = ''

  try {
    const resp = await fetch(`${stremioAPIBase}addonCollectionGet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'AddonCollectionGet',
        authKey: key,
        update: true,
      })
    })
    const data = await resp.json()
    if (!('result' in data) || data.result == null) {
      console.error('Failed to fetch user addons: ', data)
      alert('فشل جلب الإضافات - تأكد من صحة مفتاح AuthKey أو بيانات الحساب.')
      return
    }
    addons.value = data.result.addons || []
  } catch (error) {
    console.error('Error fetching user addons', error)
    alert('حدث خطأ أثناء جلب الإضافات: ' + error.message)
  } finally {
    isLoading.value = false
    loadAddonsButtonText.value = t('config.loadAddons')
  }
}

async function syncUserAddons() {
  const key = stremioAuthKey.value
  if (!key || addons.value.length === 0) return

  isSyncing.value = true
  syncSuccess.value = false

  try {
    const resp = await fetch(`${stremioAPIBase}addonCollectionSet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'AddonCollectionSet',
        authKey: key,
        addons: addons.value,
      })
    })
    const data = await resp.json()
    if (!('result' in data) || data.result == null) {
      console.error('Sync failed: ', data)
      alert('فشلت المزامنة بسبب خطأ غير معروف.')
    } else if (!data.result.success) {
      alert('فشلت مزامنة الإضافات: ' + data.result.error)
    } else {
      syncSuccess.value = true
      setTimeout(() => { syncSuccess.value = false }, 5000)
    }
  } catch (error) {
    alert('حدث خطأ أثناء المزامنة: ' + error.message)
    console.error('Error syncing user addons', error)
  } finally {
    isSyncing.value = false
  }
}

function removeAddon(idx) {
  addons.value.splice(idx, 1)
}

function reorderAddon({ index, offset }) {
  if (!moveAddon(addons.value, index, offset)) return
  syncSuccess.value = false
  reorderAnnouncement.value = t('config.movedTo', { name: addons.value[index + offset].manifest.name, position: index + offset + 1 })
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
  if (!stremioAuthKey.value) {
    addons.value = []
  }
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
    alert('فشل تحديث بيانات الإضافة')
  }
}
</script>

<template>
  <section id="configure" class="configure-section">
    <span class="sr-only" role="status">{{ reorderAnnouncement }}</span>
    <!-- Stepper Progress Bar -->
    <div class="stepper-bar">
      <div class="step-item" :class="{ 'completed': stremioAuthKey, 'active': !stremioAuthKey }">
        <div class="step-circle">
          <svg v-if="stremioAuthKey" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else>1</span>
        </div>
        <span class="step-label">{{ $i18n.locale === 'ar' ? 'الدخول' : 'Connect' }}</span>
      </div>

      <div class="step-line" :class="{ 'completed': stremioAuthKey }"></div>

      <div class="step-item" :class="{ 'completed': addons.length > 0, 'active': stremioAuthKey && addons.length === 0 }">
        <div class="step-circle">
          <svg v-if="addons.length > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else>2</span>
        </div>
        <span class="step-label">{{ $i18n.locale === 'ar' ? 'الإضافات' : 'Load' }}</span>
      </div>

      <div class="step-line" :class="{ 'completed': addons.length > 0 }"></div>

      <div class="step-item" :class="{ 'active': addons.length > 0 }">
        <div class="step-circle">
          <span>3</span>
        </div>
        <span class="step-label">{{ $i18n.locale === 'ar' ? 'ترتيب وحفظ' : 'Arrange & sync' }}</span>
      </div>
    </div>

    <!-- STEP 0: AUTHENTICATE -->
    <div class="card accent-top">
      <div class="step-card-header">
        <div class="header-icon step-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div>
          <h3>{{ $t('config.step0') }}</h3>
          <p class="step-desc">{{ $i18n.locale === 'ar' ? 'استخدم حساب Stremio لعرض إضافاتك.' : 'Connect your Stremio account to view your addons.' }}</p>
        </div>
      </div>
      <Authentication :stremioAPIBase="stremioAPIBase" @auth-key="setAuthKey" />
    </div>

    <!-- STEP 1: LOAD ADDONS -->
    <div v-if="stremioAuthKey" class="card">
      <div class="step-card-header">
        <div class="header-icon step-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div>
          <h3>{{ $t('config.step1') }}</h3>
          <p class="step-desc">{{ $t('summary.step2') }}</p>
        </div>
      </div>

      <!-- Locked State Notice -->
      <div v-if="!stremioAuthKey" class="locked-state">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>سجّل الدخول أولًا لعرض إضافاتك.</span>
      </div>

      <!-- Action Area -->
      <div v-else class="step-action-row">
        <button class="button primary" @click="loadUserAddons" :disabled="isLoading || !stremioAuthKey">
          <span v-if="isLoading" class="spinner"></span>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          <span>{{ loadAddonsButtonText }}</span>
        </button>

        <span v-if="addons.length > 0" class="badge success">
          تم تحميل {{ addons.length }} إضافة بنجاح
        </span>
      </div>
    </div>

    <!-- STEP 2: REORDER & FILTER -->
    <div v-if="stremioAuthKey" class="card" :class="{ 'locked-card': addons.length === 0 }">
      <div class="step-card-header justify-between">
        <div class="header-left-group">
          <div class="header-icon step-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </div>
          <div>
            <h3>{{ $t('config.step2') }}</h3>
            <p class="step-desc">{{ $i18n.locale === 'ar' ? 'اسحب الإضافات أو استخدم الأسهم لتغيير ترتيبها.' : 'Drag addons or use the arrows to change their order.' }}</p>
          </div>
        </div>
      </div>

      <!-- Locked State Notice -->
      <div v-if="addons.length === 0" class="empty-state">
        <div class="empty-icon-box">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <h5>القائمة فارغة حالياً</h5>
        <p>{{ $i18n.locale === 'ar' ? 'ستظهر إضافاتك هنا بعد جلبها.' : 'Your addons will appear here after loading.' }}</p>
      </div>

      <!-- Addons List with Toolbar -->
      <div v-else class="addons-manager-area">
        <!-- Stats & Filter Bar -->
        <div class="manager-toolbar">
          <div class="stats-pills">
            <span class="badge primary">الإجمالي: {{ addons.length }}</span>
            <span class="badge warning" title="إضافات أساسية لا يمكن حذفها">محمي: {{ protectedCount }}</span>
            <span class="badge success" title="إضافات تدعم صفحة التكوين">قابل للتكوين: {{ configurableCount }}</span>
          </div>

          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" v-model="searchQuery" placeholder="ابحث عن إضافة في القائمة..." />
            <button v-if="searchQuery" type="button" class="clear-btn" @click="searchQuery = ''">✕</button>
          </div>
        </div>

        <!-- Filter Notice if searching -->
        <div v-if="searchQuery && filteredAddons.length !== addons.length" class="filter-notice">
          <span>يتم عرض {{ filteredAddons.length }} من أصل {{ addons.length }} إضافة متطابقة مع البحث. مسح البحث لتمكين السحب الكامل.</span>
        </div>

        <!-- Sortable List -->
        <draggable 
          v-if="!searchQuery"
          :list="addons" 
          item-key="transportUrl" 
          handle=".drag-handle"
          :delay="150"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="sortable-list" 
          ghost-class="ghost" 
          @start="dragging = true" 
          @end="dragging = false"
        >
          <template #item="{ element, index }">
            <AddonItem
              :name="element.manifest.name"
              :idx="index"
              :canMoveUp="index > 0"
              :canMoveDown="index < addons.length - 1"
              @move-addon="reorderAddon"
              :manifestURL="element.transportUrl"
              :logoURL="element.manifest.logo"
              :isDeletable="!getNestedObjectProperty(element, 'flags.protected', false)"
              :isConfigurable="getNestedObjectProperty(element, 'manifest.behaviorHints.configurable', false)"
              @delete-addon="removeAddon"
              @edit-manifest="openEditModal"
            />
          </template>
        </draggable>

        <!-- Static Filtered List when search query is active -->
        <div v-else class="sortable-list">
          <AddonItem
            v-for="element in filteredAddons"
            :key="element.transportUrl"
            :name="element.manifest.name"
            :idx="addons.indexOf(element)"
            :canMoveUp="addons.indexOf(element) > 0"
            :canMoveDown="addons.indexOf(element) < addons.length - 1"
            @move-addon="reorderAddon"
            :manifestURL="element.transportUrl"
            :logoURL="element.manifest.logo"
            :isDeletable="!getNestedObjectProperty(element, 'flags.protected', false)"
            :isConfigurable="getNestedObjectProperty(element, 'manifest.behaviorHints.configurable', false)"
            @delete-addon="removeAddon"
            @edit-manifest="openEditModal"
          />
        </div>
      </div>
    </div>

    <!-- STEP 3: SYNC TO STREMIO -->
    <div v-if="addons.length > 0" class="card sync-card">
      <div class="step-card-header">
        <div class="header-icon step-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </div>
        <div>
          <h3>{{ $t('config.step3') }}</h3>
          <p class="step-desc">{{ $i18n.locale === 'ar' ? 'لن تتغير إضافات حسابك حتى تضغط زر المزامنة.' : 'Your account stays unchanged until you sync.' }}</p>
        </div>
      </div>

      <div class="sync-action-area">
        <button class="button primary sync-btn" @click="syncUserAddons" :disabled="isSyncing || addons.length === 0">
          <span v-if="isSyncing" class="spinner"></span>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
          </svg>
          <span>{{ $t('config.syncToStremio') }}</span>
        </button>

        <Transition name="fade">
          <div v-if="syncSuccess" class="sync-success-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>تمت المزامنة وحفظ الترتيب بنجاح! قم بإعادة تشغيل تطبيق Stremio لرؤية التغييرات.</span>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Edit Manifest Modal -->
    <Transition name="fade">
      <div v-if="isEditModalVisible" class="modal" @click.self="closeEditModal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title-group">
              <div class="header-icon step-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <h3>{{ $t('config.editManifest') }}</h3>
                <span class="modal-subtitle">{{ addons[currentEditIdx]?.manifest?.name }}</span>
              </div>
            </div>
            <button class="icon-only modal-close" @click="closeEditModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <DynamicForm :manifest="currentManifest" @update-manifest="saveManifestEdit" />
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.configure-section {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Stepper Progress Bar */
.stepper-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(16px);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  opacity: 0.55;
  transition: var(--transition);
}

.step-item.active {
  opacity: 1;
  font-weight: 700;
}

.step-item.completed {
  opacity: 1;
  color: var(--success);
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  font-weight: 700;
  transition: var(--transition);
}

.step-item.active .step-circle {
  border-color: var(--accent-1);
  background: var(--info-bg);
  color: var(--accent-1);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.3);
}

.step-item.completed .step-circle {
  background: var(--success);
  border-color: var(--success);
  color: #ffffff;
}

.step-label {
  font-size: 0.88rem;
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--border-color);
  margin: 0 1rem;
  transition: var(--transition);
}

.step-line.completed {
  background: var(--success);
}

/* Step Headers */
.step-card-header {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon.step-0 { background: rgba(139, 92, 246, 0.15); color: var(--accent-1); }
.header-icon.step-1 { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.header-icon.step-2 { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
.header-icon.step-3 { background: rgba(16, 185, 129, 0.15); color: var(--success); }

.step-desc {
  margin: 0.2rem 0 0;
  font-size: 0.92rem;
  color: var(--text-secondary);
}

/* Locked States */
.locked-card {
  opacity: 0.75;
  border-style: dashed;
}

.locked-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.92rem;
}

.step-action-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-color);
  gap: 0.75rem;
}

.empty-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.empty-state h5 {
  margin: 0;
  font-size: 1.15rem;
}

.empty-state p {
  max-width: 420px;
  margin: 0;
  font-size: 0.92rem;
}

/* Manager Toolbar */
.addons-manager-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.manager-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.85rem 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.stats-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 220px;
  max-width: 320px;
}

.search-box svg {
  position: absolute;
  right: 0.85rem;
  color: var(--text-muted);
  pointer-events: none;
}

html[dir="ltr"] .search-box svg {
  right: auto;
  left: 0.85rem;
}

.search-box input {
  padding: 0.55rem 2.2rem 0.55rem 0.85rem;
  font-size: 0.88rem;
  border-radius: var(--radius-sm);
  background: var(--card-bg);
}

html[dir="ltr"] .search-box input {
  padding: 0.55rem 0.85rem 0.55rem 2.2rem;
}

.clear-btn {
  position: absolute;
  left: 0.65rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.85rem;
}

html[dir="ltr"] .clear-btn {
  left: auto;
  right: 0.65rem;
}

.filter-notice {
  padding: 0.65rem 1rem;
  background: var(--warning-bg);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-sm);
  color: var(--warning);
  font-size: 0.85rem;
}

.sortable-list {
  min-height: 80px;
}

/* Sync CTA */
.sync-action-area {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sync-btn {
  padding: 1rem 2rem;
  font-size: 1.05rem;
  align-self: flex-start;
}

.sync-success-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--success-bg);
  border: 1px solid var(--success);
  border-radius: var(--radius-md);
  color: var(--success);
  font-weight: 600;
  font-size: 0.95rem;
}

/* Modal */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.modal-title-group h3 {
  margin: 0;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: block;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 680px) {
  .stepper-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .step-line {
    width: 2px;
    height: 16px;
    margin: 0 0.9rem;
  }
  .manager-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box {
    max-width: 100%;
  }
}
</style>
