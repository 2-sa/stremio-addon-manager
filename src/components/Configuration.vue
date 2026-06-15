<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import AddonItem from './AddonItem.vue'
import Authentication from './Authentication.vue'
import { useI18n } from 'vue-i18n'
import DynamicForm from './DynamicForm.vue'

const stremioAPIBase = "https://api.strem.io/api/"
const dragging = false
let stremioAuthKey = ref('');
let addons = ref([])

const { t } = useI18n()
let loadAddonsButtonText = ref(t('config.loadAddons'))

let isEditModalVisible = ref(false);
let currentManifest = ref({});
let currentEditIdx = ref(null);

function loadUserAddons() {
    const key = stremioAuthKey.value
    if (!key) {
        console.error('No auth key provided')
        return
    }

    loadAddonsButtonText.value = t('config.loading')
    console.log('Loading addons...')

    const url = `${stremioAPIBase}addonCollectionGet`
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            type: 'AddonCollectionGet',
            authKey: key,
            update: true,
        })
    }).then((resp) => {
        resp.json().then((data) => {
            console.log(data)
            if (!("result" in data) || data.result == null) {
                console.error("Failed to fetch user addons: ", data)
                alert('Failed to fetch user addons - are you sure you pasted the correct Stremio AuthKey?')
                return
            }
            addons.value = data.result.addons
        })
    }).catch((error) => {
        console.error('Error fetching user addons', error)
    }).finally(() => {
        loadAddonsButtonText.value = t('config.loadAddons')
    })
}

function syncUserAddons() {
    const key = stremioAuthKey.value
    if (!key) {
        console.error('No auth key provided')
        return
    }
    console.log('Syncing addons...')

    const url = `${stremioAPIBase}addonCollectionSet`
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            type: 'AddonCollectionSet',
            authKey: key,
            addons: addons.value,
        })
    }).then((resp) => {
        resp.json().then((data) => {
            if (!("result" in data) || data.result == null) {
                console.error("Sync failed: ", data)
                alert('Sync failed if unknown error')
                return
            } else if (!data.result.success) {
                alert("Failed to sync addons: " + data.result.error)
            } else {
                console.log("Sync complete: + ", data)
                alert('Sync complete!')
            }
        })
    }).catch((error) => {
        alert("Error syncing addons: " + error)
        console.error('Error fetching user addons', error)
    })
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
    stremioAuthKey.value = authKey
    console.log('AuthKey set to: ', stremioAuthKey.value)
}

function openEditModal(idx) {
    isEditModalVisible.value = true;
    currentEditIdx.value = idx;
    currentManifest.value = { ...addons.value[idx].manifest };
    document.body.classList.add('modal-open');
}

function closeEditModal() {
    isEditModalVisible.value = false;
    currentManifest.value = {};
    currentEditIdx.value = null;
    document.body.classList.remove('modal-open');
}

function saveManifestEdit(updatedManifest) {
    try {
        addons.value[currentEditIdx.value].manifest = updatedManifest;
        closeEditModal();
    } catch (e) {
        alert('Failed to update manifest');
    }
}
</script>

<template>
    <section id="configure">
        <form onsubmit="return false;" class="flex-col gap-4">
            <div class="card">
                <h3>{{ $t('config.step0') }}</h3>
                <Authentication :stremioAPIBase="stremioAPIBase" @auth-key="setAuthKey" />
            </div>
            <div class="card" id="form_step1">
                <h3>{{ $t('config.step1') }}</h3>
                <button class="button" @click="loadUserAddons">
                    {{ loadAddonsButtonText }}
                </button>
            </div>
            <div class="card" id="form_step2">
                <h3>{{ $t('config.step2') }}</h3>
                <draggable :list="addons" item-key="transportUrl" class="sortable-list" ghost-class="ghost"
                    @start="dragging = true" @end="dragging = false">
                    <template #item="{ element, index }">
                        <AddonItem :name="element.manifest.name" :idx="index" :manifestURL="element.transportUrl"
                            :logoURL="element.manifest.logo"
                            :isDeletable="!getNestedObjectProperty(element, 'flags.protected', false)"
                            :isConfigurable="getNestedObjectProperty(element, 'manifest.behaviorHints.configurable', false)"
                            @delete-addon="removeAddon"
                            @edit-manifest="openEditModal" />
                    </template>
                </draggable>
            </div>
            <div class="card" id="form_step3">
                <h3>{{ $t('config.step3') }}</h3>
                <button type="button" class="button" @click="syncUserAddons">
                    {{ $t('config.syncToStremio') }}
                </button>
            </div>
        </form>
    </section>

    <div v-if="isEditModalVisible" class="modal" @click.self="closeEditModal">
        <div class="modal-content">
            <h3 style="margin-bottom: 1.5rem">{{ $t('config.editManifest') }}</h3>
            <DynamicForm :manifest="currentManifest" @update-manifest="saveManifestEdit" />
        </div>
    </div>
</template>

<style scoped>
.sortable-list {
    border-radius: var(--radius-lg);
    min-height: 100px;
}

.ghost {
    opacity: 0.5;
    background: var(--card-bg-hover);
}

.item.dragging {
    opacity: 0.6;
}

.item.dragging :where(.details, i) {
    opacity: 0;
}
</style>
