<script setup>
defineProps({
  addonName: { type: String, required: true },
  addonLogo: { type: String, required: false },
  addonSummary: { type: String, required: false },
  addonTagline: { type: String, required: false }
})
</script>

<template>
  <header>
    <div class="logo-container">
      <div class="logo-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="14" fill="url(#grad)" />
          <path d="M15 24L21 30L33 18" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48">
              <stop stop-color="#8b5cf6"/>
              <stop offset="0.5" stop-color="#6366f1"/>
              <stop offset="1" stop-color="#3b82f6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 class="gradient-text">{{ addonName }}</h1>
      <p class="summary">{{ addonSummary }}</p>
      <span class="tagline">{{ addonTagline }}</span>
    </div>
  </header>
</template>

<style scoped>
header {
  text-align: center;
  padding: 1rem 0 0.5rem;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 56px;
  height: 56px;
  filter: drop-shadow(0 4px 15px rgba(99, 102, 241, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.gradient-text {
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6, #6366f1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease-in-out infinite;
  margin-bottom: 0;
  line-height: 1.2;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.summary {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}

.tagline {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-2);
  opacity: 0.8;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .gradient-text {
    font-size: 1.8rem;
  }

  .summary {
    font-size: 0.95rem;
  }
}
</style>
