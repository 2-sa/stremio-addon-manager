<script setup>
defineProps({
  addonName: {
    type: String,
    required: true
  },
  addonLogo: {
    type: String,
    required: false
  },
  addonSummary: {
    type: String,
    required: false
  },
  addonTagline: {
    type: String,
    required: false
  }
})
</script>

<template>
  <header>
    <div class="logo-container">
      <h1 class="gradient-text">{{ addonName }}</h1>
      <p class="summary">{{ addonSummary }}</p>
      <span class="tagline">{{ addonTagline }}</span>
    </div>
  </header>
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 2rem;
}

.gradient-text {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.summary {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 0.5rem auto;
}

.tagline {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
  opacity: 0.8;
}

@media (max-width: 600px) {
  .gradient-text {
    font-size: 2.2rem;
  }
}
</style>
