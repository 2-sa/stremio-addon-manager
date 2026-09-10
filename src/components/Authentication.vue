<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  stremioAPIBase: { type: String, required: true }
})

const { t } = useI18n()
const emits = defineEmits(['auth-key'])

const activeTab = ref('email') // 'email' or 'authKey'
const authKey = ref('')
const email = ref('')
const password = ref('')
const loginButtonText = ref(t('config.login'))
const isLoggingIn = ref(false)
const isConnected = ref(false)
const showAuthKeyHelp = ref(false)

async function loginUserPassword() {
  if (!email.value || !password.value) return
  isLoggingIn.value = true
  loginButtonText.value = t('config.loading')
  try {
    const resp = await fetch(`${props.stremioAPIBase}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: null, email: email.value, password: password.value })
    })
    const data = await resp.json()
    if (data && data.result && data.result.authKey) {
      authKey.value = data.result.authKey
      isConnected.value = true
      loginButtonText.value = t('config.loggedIn')
      emitAuthKey()
    } else {
      alert('Login failed: ' + (data.error || 'Invalid credentials'))
      loginButtonText.value = t('config.login')
    }
  } catch (err) {
    console.error(err)
    alert('Login failed: ' + err.message)
    loginButtonText.value = t('config.login')
  } finally {
    isLoggingIn.value = false
  }
}

function handleAuthKeyInput() {
  if (authKey.value && authKey.value.trim().length > 10) {
    isConnected.value = true
  } else {
    isConnected.value = false
  }
  emitAuthKey()
}

function emitAuthKey() {
  const cleaned = authKey.value.replaceAll('"', '').trim()
  emits('auth-key', cleaned)
}

function disconnectSession() {
  authKey.value = ''
  isConnected.value = false
  loginButtonText.value = t('config.login')
  emits('auth-key', '')
}

function copyConsoleSnippet() {
  const snippet = `JSON.parse(localStorage.getItem("profile")).auth.key`
  navigator.clipboard.writeText(snippet)
}
</script>

<template>
  <div class="auth-container">
    <!-- Active Connected State -->
    <div v-if="isConnected" class="connected-badge-card">
      <div class="connected-info">
        <div class="pulse-circle"></div>
        <div>
          <span class="badge success">{{ $t('config.loggedIn') }}</span>
          <p class="connected-text">
            {{ email ? email : 'Stremio AuthKey Session Active' }}
          </p>
        </div>
      </div>
      <button class="button outline danger-hover" @click="disconnectSession">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>تسجيل خروج / تغيير الحساب</span>
      </button>
    </div>

    <!-- Login Tabs & Form -->
    <div v-else class="auth-tabs-wrapper">
      <div class="tabs-header">
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ 'active': activeTab === 'email' }" 
          @click="activeTab = 'email'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>{{ $t('config.emailPlaceholder') }}</span>
        </button>

        <button 
          type="button" 
          class="tab-btn" 
          :class="{ 'active': activeTab === 'authKey' }" 
          @click="activeTab = 'authKey'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
          </svg>
          <span>Stremio AuthKey</span>
        </button>
      </div>

      <!-- Tab Content: Email & Password -->
      <div v-if="activeTab === 'email'" class="tab-content">
        <div class="auth-fields">
          <div class="row-fields">
            <div class="input-with-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" autocomplete="username" v-model="email" :aria-label="$t('config.emailPlaceholder')" :placeholder="$t('config.emailPlaceholder')" />
            </div>

            <div class="input-with-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type="password" autocomplete="current-password" v-model="password" :aria-label="$t('config.passwordPlaceholder')" :placeholder="$t('config.passwordPlaceholder')" @keydown.enter="!isLoggingIn && email && password && loginUserPassword()" />
            </div>
          </div>

          <button class="button primary mt-2" @click="loginUserPassword" :disabled="isLoggingIn || !email || !password">
            <span v-if="isLoggingIn" class="spinner"></span>
            <span>{{ loginButtonText }}</span>
          </button>
        </div>
      </div>

      <!-- Tab Content: AuthKey -->
      <div v-else class="tab-content">
        <div class="auth-fields">
          <div class="input-with-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
            <input type="password" autocomplete="off" v-model="authKey" @input="handleAuthKeyInput" :aria-label="$t('config.authKeyPlaceholder')" :placeholder="$t('config.authKeyPlaceholder')" />
          </div>

          <!-- Helper Trigger -->
          <div class="help-trigger mt-2">
            <button type="button" class="button outline text-sm" @click="showAuthKeyHelp = !showAuthKeyHelp">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>كيف أحصل على Stremio AuthKey؟</span>
            </button>
          </div>

          <!-- Expandable Help Box -->
          <div v-if="showAuthKeyHelp" class="help-box">
            <h6>خطوات استخراج مفتاح AuthKey:</h6>
            <ol>
              <li>{{ $t('summary.step1b1') }}</li>
              <li>{{ $t('summary.step1b2') }}</li>
              <li class="code-snippet-row">
                <code>JSON.parse(localStorage.getItem("profile")).auth.key</code>
                <button type="button" class="icon-only" title="نسخ الكود" @click="copyConsoleSnippet">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              </li>
              <li>{{ $t('summary.step1b3') }}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  margin-top: 0.5rem;
}

.connected-badge-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--success);
  border-radius: var(--radius-lg);
  gap: 1rem;
  flex-wrap: wrap;
}

.connected-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pulse-circle {
  width: 14px;
  height: 14px;
  background: var(--success);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 4px var(--success-bg);
}

.pulse-circle::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid var(--success);
  animation: ripple 2s infinite ease-out;
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

.connected-text {
  margin: 0.25rem 0 0;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.auth-tabs-wrapper {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--text-primary);
  background: var(--card-bg-hover);
}

.tab-btn.active {
  background: var(--card-bg);
  color: var(--accent-1);
  box-shadow: var(--shadow-sm);
}

.tab-btn svg {
  color: currentColor;
}

.auth-fields {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.row-fields {
  display: flex;
  gap: 0.85rem;
}

.row-fields > * {
  flex: 1;
  min-width: 0;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon svg {
  position: absolute;
  right: 1rem;
  color: var(--text-muted);
  pointer-events: none;
  transition: var(--transition);
}

html[dir="ltr"] .input-with-icon svg {
  right: auto;
  left: 1rem;
}

.input-with-icon input {
  padding-right: 2.8rem;
}

html[dir="ltr"] .input-with-icon input {
  padding-right: 1.15rem;
  padding-left: 2.8rem;
}

.input-with-icon input:focus + svg,
.input-with-icon input:focus ~ svg {
  color: var(--accent-2);
}

.text-sm {
  font-size: 0.82rem !important;
  padding: 0.5rem 1rem !important;
}

.help-box {
  background: var(--card-bg);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: var(--radius-md);
  padding: 1.1rem 1.25rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.25s ease;
}

.help-box h6 {
  color: var(--accent-2);
  margin-bottom: 0.65rem;
  font-size: 0.9rem;
}

.help-box ol {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 1.25rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

html[dir="ltr"] .help-box ol {
  padding-right: 0;
  padding-left: 1.25rem;
}

.code-snippet-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  margin: 0.35rem 0;
}

.code-snippet-row code {
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 0.8rem;
  color: var(--accent-1);
  word-break: break-all;
}

@media (max-width: 580px) {
  .row-fields {
    flex-direction: column;
  }
  .tabs-header {
    flex-direction: column;
  }
  .connected-badge-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
