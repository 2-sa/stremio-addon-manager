<script setup>
</script>

<template>
  <footer class="modern-footer">
    <div class="footer-divider"></div>
    <div class="footer-content">
      <div class="footer-left">
        <p class="made-with">
          <span>{{ $t('footer.madeWith') }}</span>
          <span class="heart-pulse">❤️</span>
        </p>
        <span class="footer-sub">Open-source Stremio Addon Manager</span>
      </div>

      <div class="footer-actions">
        <a href="https://github.com/2-sa/stremio-addon-manager" target="_blank" rel="noopener noreferrer" class="source-pill">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>{{ $t('footer.sourceCode') }}</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.modern-footer {
  margin-top: 2.5rem;
  padding-bottom: 1.5rem;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
  margin-bottom: 1.75rem;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.made-with {
  font-size: 0.92rem;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.heart-pulse {
  display: inline-block;
  animation: heartBeat 1.5s ease-in-out infinite;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.footer-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.source-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--card-bg);
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.source-pill:hover {
  color: #ffffff;
  border-color: var(--accent-1);
  background: var(--accent-gradient);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

@media (max-width: 580px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
