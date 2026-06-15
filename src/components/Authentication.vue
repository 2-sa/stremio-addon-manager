<script setup>
import { ref } from 'vue'

const props = defineProps({
    stremioAPIBase: {
        type: String,
        required: true
    },
})

const authKey = ref('')
const email = ref('')
const password = ref('')
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const loginButtonText = ref(t('config.login'))
const emits = defineEmits(['auth-key'])

async function loginUserPassword() {
    try {
        fetch(`${props.stremioAPIBase}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authKey: null,
                email: email.value,
                password: password.value,
            })
        }).then((resp) => {
            resp.json().then((data) => {
                console.log("Auth data:" + data)
                authKey.value = data.result.authKey
                loginButtonText.value = t('config.loggedIn')
                emitAuthKey()
            })
        })
    } catch (err) {
        console.error(err);
        alert('Login failed: ' + err.message);
    }
}

function emitAuthKey() {
    emits('auth-key', authKey.value.replaceAll('"', '').trim())
}

</script>

<template>
    <div class="flex-col gap-4">
        <div class="flex gap-2">
            <input type="text" v-model="email" :placeholder="$t('config.emailPlaceholder')">
            <input type="password" v-model="password" :placeholder="$t('config.passwordPlaceholder')">
            <button class="button" @click="loginUserPassword">
                {{ loginButtonText }}
            </button>
        </div>
        <div class="text-center">
            <strong style="color: var(--text-secondary)">{{ $t('config.or') }}</strong>
        </div>
        <div class="flex">
            <input type="password" v-model="authKey" @input="emitAuthKey" :placeholder="$t('config.authKeyPlaceholder')">
        </div>
    </div>
</template>
