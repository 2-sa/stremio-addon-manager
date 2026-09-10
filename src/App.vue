<script setup>
import './assets/main.css'
import Navbar from './components/Navbar.vue'
import Configuration from './components/Configuration.vue'
import Faq from './components/Faq.vue'
import './assets/studio.css'
</script>

<template>
  <div class="app-layout">
    <a class="skip-link" href="#configure">{{ $i18n.locale === 'ar' ? 'انتقل إلى إدارة الإضافات' : 'Skip to addon manager' }}</a>
    <Navbar />
    <header class="workspace-heading">
      <div>
        <h1>{{ $i18n.locale === 'ar' ? 'رتّب إضافاتك' : 'Organize your addons' }}</h1>
        <p>{{ $i18n.locale === 'ar' ? 'رتّب مكتبتك وعدّل إضافاتك، ثم احفظ التغييرات في حساب Stremio.' : 'Arrange your library, edit your addons, then sync changes to Stremio.' }}</p>
      </div>
    </header>
    <main class="workspace-grid">
      <Configuration />
      <section id="faq" class="workspace-faq"><Faq /></section>
    </main>
  </div>
</template>
