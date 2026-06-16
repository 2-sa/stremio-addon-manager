<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  stremioAPIBase: { type: String, required: true }
})

const { t } = useI18n()
const emits = defineEmits(['auth-key'])

const authKey = ref('')
const email = ref('')
const password = ref('')
const loginButtonText = ref(t('config.login'))
const isLoggingIn = ref(false)

async function loginUserPassword() {
  isLoggingIn.value = true
  loginButtonText.value = t('config.loading')
  try {
    const resp = await fetch(`${props.stremioAPIBase}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: null, email: email.value, password: password.value })
    })
    const data = await resp.json()
    authKey.value = data.result.authKey
    loginButtonText.value = t('config.loggedIn')
    emitAuthKey()
  } catch (err) {
    console.error(err)
    alert('Login failed: ' + err.message)
  } finally {
    isLoggingIn.value = false
  }
}

function emitAuthKey() {
  emits('auth-key', authKey.value.replaceAll('"', '').trim())
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-method">
      <div class="method-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>{{ $t('config.emailPlaceholder') }}</span>
      </div>
      <div class="auth-fields">
        <input type="text" v-model="email" :placeholder="$t('config.emailPlaceholder')" />
        <input type="password" v-model="password" :placeholder="$t('config.passwordPlaceholder')" />
        <button class="button primary" @click="loginUserPassword" :disabled="isLoggingIn">
          <span v-if="isLoggingIn" class="spinner"></span>
          {{ loginButtonText }}
        </button>
      </div>
    </div>

    <div class="divider">
      <span>{{ $t('config.or') }}</span>
    </div>

    <div class="auth-method">
      <div class="method-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <key xmlns="http://www.w3.org/2000/svg" transform="translate(3, 3)"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></key>
        </svg>
        <span>Stremio AuthKey</span>
      </div>
      <div class="auth-fields">
        <input type="password" v-model="authKey" @input="emitAuthKey" :placeholder="$t('config.authKeyPlaceholder')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 0.75rem;
}

.auth-method {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.method-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.method-header svg {
  color: var(--accent-2);
  flex-shrink: 0;
}

.auth-fields {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}
</style>
