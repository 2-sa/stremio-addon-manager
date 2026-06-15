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
    <legend>{{ $t('config.step0') }}</legend>
    <p class="grouped">
        <input type="text" v-model="email" :placeholder="$t('config.emailPlaceholder')">
        <input type="password" v-model="password" :placeholder="$t('config.passwordPlaceholder')">
        <button class="button primary" @click="loginUserPassword">
            {{ loginButtonText }}
        </button>
    </p>
    <p>
        <strong>{{ $t('config.or') }}</strong>
    </p>
    <p class="grouped">
        <input type="password" v-model="authKey" v-on:input="emitAuthKey" :placeholder="$t('config.authKeyPlaceholder')">
    </p>
</template>

<style scoped>
.sortable-list .item {
    list-style: none;
    display: flex;
    cursor: move;
    align-items: center;
    border-radius: 5px;
    padding: 10px 13px;
    margin-bottom: 11px;
    /* box-shadow: 0 2px 4px rgba(0,0,0,0.06); */
    border: 1px solid #ccc;
    justify-content: space-between;
}

.dark .sortable-list .item {
    border: 1px solid #434242;
}

.item .details {
    display: flex;
    align-items: center;
}

.item .details img {
    height: 60px;
    width: 60px;
    pointer-events: none;
    margin-right: 12px;
    object-fit: contain;
    object-position: center;
    border-radius: 30%;
    background-color: #262626;

}
</style>
