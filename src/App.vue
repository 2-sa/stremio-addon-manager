<script setup>
import './assets/main.css'
import Navbar from './components/Navbar.vue'
import Header from './components/Header.vue'
import InfoGuide from './components/InfoGuide.vue'
import Configuration from './components/Configuration.vue'
import Faq from './components/Faq.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <Header 
      :addonName="$t('app.name')"
      :addonSummary="$t('app.summary')"
      :addonTagline="$t('app.tagline')" 
      addonLogo="logo.png" 
    />
    <main class="main-content">
      <InfoGuide />
      <Configuration />
      <Faq />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
