<script setup>
import { ref, onMounted } from 'vue'

let darkEnabled = ref(getDarkModePreference())

function getDarkModePreference() {
  const userSet = localStorage.getItem('darkMode')
  if (userSet !== null) {
    return userSet === 'true'
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return true // default to dark mode for sleek modern feel if no preference
}

function toggleMode() {
  darkEnabled.value = !darkEnabled.value
  localStorage.setItem('darkMode', darkEnabled.value)
  document.body.classList.toggle('dark', darkEnabled.value)
}

onMounted(() => {
  document.body.classList.toggle('dark', darkEnabled.value)
})
</script>

<template>
  <button class="theme-btn" @click="toggleMode" :title="darkEnabled ? 'تبديل للوضع النهاري Light Mode' : 'تبديل للوضع الليلي Dark Mode'">
    <svg v-if="darkEnabled" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>

<style scoped>
.theme-btn {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-bounce);
  color: var(--text-primary);
  flex-shrink: 0;
}

.theme-btn:hover {
  transform: scale(1.08) rotate(12deg);
  background: var(--card-bg-hover);
  border-color: var(--accent-2);
  color: var(--accent-2);
  box-shadow: 0 0 18px rgba(99, 102, 241, 0.25);
}

.sun-icon {
  animation: rotateSun 12s linear infinite;
}

.moon-icon {
  animation: tiltMoon 4s ease-in-out infinite;
}

@keyframes rotateSun {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes tiltMoon {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-15deg); }
}
</style>
