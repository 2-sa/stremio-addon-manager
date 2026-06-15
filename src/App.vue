<script setup>
import './assets/main.css'
import Header from './components/Header.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import Configuration from './components/Configuration.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <header>
    <DarkModeToggle />
    <Header :addonName="$t('app.name')"
      :addonSummary="$t('app.summary')"
      :addonTagline="$t('app.tagline')" addonLogo="logo.png" />
  </header>
  <main>
    <Configuration />
  </main>
  <footer>
    <Footer />
  </footer>
</template>
