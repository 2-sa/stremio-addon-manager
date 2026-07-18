<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)

function toggleGuide() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="guide-banner card" :class="{ 'expanded': isExpanded }">
    <div class="guide-header" @click="toggleGuide">
      <div class="header-left">
        <div class="icon-pulse">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
        </div>
        <div>
          <h4 class="guide-title">{{ $t('summary.why') }} & {{ $t('summary.how') }}</h4>
          <span class="guide-subtitle">{{ $t('summary.whyText2') }}</span>
        </div>
      </div>
      <button class="expand-btn" :aria-expanded="isExpanded">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotate': isExpanded }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </div>

    <Transition name="expand">
      <div v-if="isExpanded" class="guide-body">
        <div class="guide-section">
          <h5>{{ $t('summary.why') }}</h5>
          <p>{{ $t('summary.whyText1') }}</p>
          <div class="warning-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <strong>تنبيه هام:</strong> {{ $t('summary.whyText2') }}
              <br />
              <small>{{ $t('summary.noSupport') }}</small>
            </div>
          </div>
        </div>

        <div class="guide-section mt-4">
          <h5>{{ $t('summary.how') }}</h5>
          <ol class="steps-list">
            <li><strong>1.</strong> {{ $t('summary.step1') }}</li>
            <li><strong>2.</strong> {{ $t('summary.step2') }}</li>
            <li><strong>3.</strong> {{ $t('summary.step3') }}</li>
            <li><strong>4.</strong> {{ $t('summary.step4') }}</li>
          </ol>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.guide-banner {
  padding: 1.25rem 1.75rem;
  border-left: 4px solid var(--accent-1);
  background: var(--card-bg);
  transition: var(--transition);
}

html[dir="rtl"] .guide-banner {
  border-left: none;
  border-right: 4px solid var(--accent-1);
}

.guide-banner.expanded {
  border-color: var(--accent-2);
  box-shadow: var(--shadow-lg);
}

.guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-pulse {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--info-bg);
  color: var(--accent-2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}

.guide-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.guide-subtitle {
  font-size: 0.82rem;
  color: var(--warning);
  font-weight: 600;
}

.expand-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition);
  cursor: pointer;
  flex-shrink: 0;
}

.guide-header:hover .expand-btn {
  background: var(--card-bg-hover);
  color: var(--accent-2);
  border-color: var(--accent-2);
}

.expand-btn svg.rotate {
  transform: rotate(180deg);
}

.guide-body {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.guide-section h5 {
  font-size: 1.05rem;
  color: var(--accent-2);
  margin-bottom: 0.5rem;
}

.warning-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--warning-bg);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: var(--radius-md);
  color: var(--warning);
  font-size: 0.88rem;
  margin-top: 1rem;
  align-items: flex-start;
}

.warning-box svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  list-style: none;
  padding: 0;
}

.steps-list li {
  font-size: 0.95rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.65rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.steps-list li strong {
  color: var(--accent-1);
}

/* Animations */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 800px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  padding-top: 0;
}

@media (max-width: 520px) {
  .guide-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .expand-btn {
    align-self: flex-end;
  }
}
</style>
