<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const state = ref('')
const busy = ref(false)
const ar = computed(() => locale.value === 'ar')
const feedback = computed(() => state.value === 'copied'
  ? (ar.value ? 'تم نسخ الرابط' : 'Link copied')
  : state.value === 'error' ? (ar.value ? 'تعذرت المشاركة. انسخ الرابط من شريط العنوان.' : 'Sharing failed. Copy the URL from the address bar.') : '')

async function shareSite() {
  if (busy.value) return
  busy.value = true
  state.value = ''
  // Only share the public page URL, never account values, queries or fragments.
  const url = document.querySelector('link[rel="canonical"]')?.href || location.origin + location.pathname
  const data = { title: 'Stremio Addon Manager', url }
  try {
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      await navigator.share(data)
    } else {
      await navigator.clipboard.writeText(url)
      state.value = 'copied'
    }
  } catch (error) {
    if (error.name !== 'AbortError') state.value = 'error'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="share-control">
    <button type="button" class="share-button" @click="shareSite" :disabled="busy" :aria-label="ar ? 'مشاركة الموقع' : 'Share website'">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>
      <span>{{ ar ? 'مشاركة' : 'Share' }}</span>
    </button>
    <span role="status" class="share-feedback" v-if="feedback">{{ feedback }}</span>
  </div>
</template>

<style scoped>
.share-control { position: relative; }
button.share-button { min-height: 40px; padding: .5rem .8rem; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); font-size: .875rem; border-radius: 8px; }
.share-feedback { position: absolute; inset-inline-end: 0; top: calc(100% + .5rem); width: max-content; max-width: min(260px,70vw); padding: .6rem .8rem; border: 1px solid var(--card-border); border-radius: 8px; background: var(--card-bg); color: var(--text-primary); font-size: .875rem; z-index: 10; }
</style>
