<script setup>
import { ref, onMounted } from 'vue'

const darkIcon = '🌙'
const lightIcon = '☀️'
let darkEnabled = ref(getDarkModePreference())
let toggleIcon = ref(darkEnabled.value ? lightIcon : darkIcon)

function getDarkModePreference() {
    const userSet = localStorage.getItem('darkMode')
    // User explicit setting takes precedence
    if (userSet !== null) {
        return userSet === 'true'
    } else {
        // If user has no preference, use system preference
        if (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true
        }
    }

    return false
}

function toggleMode() {
    darkEnabled.value = !darkEnabled.value
    localStorage.setItem('darkMode', darkEnabled.value)
    document.body.classList.toggle('dark')
    if (darkEnabled.value) {
        toggleIcon.value = lightIcon
    } else {
        toggleIcon.value = darkIcon
    }
}

onMounted(() => {
    if (darkEnabled.value) {
        document.body.classList.add('dark')
    }
})
</script>

<template>
    <div class="theme-toggle">
        <button class="icon-button" @click="toggleMode" :title="darkEnabled ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <span class="icon">{{ toggleIcon }}</span>
        </button>
    </div>
</template>

<style scoped>
.theme-toggle {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem; /* For RTL it will be on the left */
    z-index: 100;
}

html[dir="ltr"] .theme-toggle {
    left: auto;
    right: 1.5rem;
}

.icon-button {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
}

.icon-button:hover {
    transform: rotate(15deg) scale(1.1);
    background: var(--card-bg-hover);
    border-color: var(--primary);
}

.icon {
    font-size: 1.2rem;
    line-height: 1;
}
</style>
