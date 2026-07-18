<script setup>
import { useI18n } from 'vue-i18n'
import DarkModeToggle from './DarkModeToggle.vue'
import { onMounted } from 'vue'

const { locale, t } = useI18n()

function toggleLanguage() {
  const newLang = locale.value === 'ar' ? 'en' : 'ar'
  locale.value = newLang
  applyDirection(newLang)
  localStorage.setItem('userLanguage', newLang)
}

function applyDirection(lang) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lang)
}

onMounted(() => {
  const savedLang = localStorage.getItem('userLanguage')
  if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
    locale.value = savedLang
  }
  applyDirection(locale.value)
})
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="12" fill="url(#nav-grad)" />
          <path d="M15 24L21 30L33 18" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="nav-grad" x1="0" y1="0" x2="48" y2="48">
              <stop stop-color="#8b5cf6"/>
              <stop offset="1" stop-color="#3b82f6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="brand-title">{{ $t('app.name') }}</span>
      <span class="version-badge">v2.0 BETA</span>
    </div>

    <div class="nav-actions">
      <button class="lang-btn" @click="toggleLanguage" :title="locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span class="lang-text">{{ locale === 'ar' ? 'English' : 'العربية' }}</span>
      </button>

      <DarkModeToggle />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: var(--glass-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-sm);
  gap: 1rem;
  transition: var(--transition);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 8px rgba(99, 102, 241, 0.3));
}

.brand-title {
  font-weight: 800;
  font-size: 1.05rem;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.version-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: var(--info-bg);
  color: var(--accent-2);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(99, 102, 241, 0.3);
  letter-spacing: 0.5px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.95rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.lang-btn:hover {
  background: var(--info-bg);
  border-color: var(--accent-2);
  color: var(--accent-2);
  transform: translateY(-1px);
}

.lang-btn svg {
  color: var(--accent-2);
}

@media (max-width: 520px) {
  .navbar {
    flex-direction: column;
    padding: 0.85rem 1rem;
  }
  .nav-brand, .nav-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
