<script setup>
defineProps({
  addonName: { type: String, required: true },
  addonLogo: { type: String, required: false },
  addonSummary: { type: String, required: false },
  addonTagline: { type: String, required: false }
})
</script>

<template>
  <header class="hero-header">
    <div class="hero-glow"></div>
    
    <div class="logo-container">
      <div class="logo-wrapper">
        <div class="logo-icon">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="16" fill="url(#hero-grad)" />
            <path d="M14 24L21 31L34 17" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="hero-grad" x1="0" y1="0" x2="48" y2="48">
                <stop stop-color="#8b5cf6"/>
                <stop offset="0.5" stop-color="#6366f1"/>
                <stop offset="1" stop-color="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div class="title-section">
        <h1 class="gradient-text">{{ addonName }}</h1>
        <p class="summary">{{ addonSummary }}</p>
        
        <div class="tagline-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>{{ addonTagline }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-header {
  text-align: center;
  padding: 1.5rem 0 0.75rem;
  position: relative;
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 180px;
  background: var(--accent-gradient);
  filter: blur(80px);
  opacity: 0.22;
  border-radius: 50%;
  z-index: -1;
  pointer-events: none;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.logo-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 8px 25px rgba(99, 102, 241, 0.45));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-8px) scale(1.03); }
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
}

.gradient-text {
  font-size: 2.85rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa 0%, #818cf8 35%, #60a5fa 70%, #a78bfa 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 6s ease infinite;
  margin-bottom: 0;
  line-height: 1.25;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.summary {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.65;
}

.tagline-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 1.1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent-2);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.tagline-pill:hover {
  border-color: var(--accent-2);
  background: var(--info-bg);
  transform: translateY(-2px);
}

.tagline-pill svg {
  color: var(--accent-1);
}

@media (max-width: 640px) {
  .gradient-text {
    font-size: 2.1rem;
  }
  .summary {
    font-size: 0.98rem;
    padding: 0 0.5rem;
  }
}
</style>
