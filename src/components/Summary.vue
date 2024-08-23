<template>
  <section id="features">
    <h2>{{ $t('summary.why') }}</h2>
    <p>
      {{ $t('summary.whyText1') }}
    </p>
    <p>
      {{ $t('summary.whyText2') }}
      <strong>{{ $t('summary.noSupport') }}</strong>
    </p>
    <h3>{{ $t('summary.how') }}</h3>
    <ol>
      <li>{{ $t('summary.step1') }}</li>
      <ul>
        <li>{{ $t('summary.step1a') }}</li>
        <li>{{ $t('summary.step1b') }}</li>
        <ul>
          <li>
            <i18n-t keypath="summary.step1b1" tag="span">
              <template #link>
                <a href="https://web.stremio.com/" target="_blank">https://web.stremio.com/</a>
              </template>
            </i18n-t>
          </li>
          <li>
            {{ $t('summary.step1b2') }} <a href="#faq">(?)</a>
            <div class="code-container">
              <code>JSON.parse(localStorage.getItem("profile")).auth.key</code>
            </div>
          </li>
          <li>{{ $t('summary.step1b3') }}</li>
        </ul>
      </ul>
      <li>{{ $t('summary.step2') }}</li>
      <li>{{ $t('summary.step3') }}</li>
      <li>
        {{ $t('summary.step4') }}
      </li>
    </ol>
  </section>
</template>

<style scoped>
.code-container {
    overflow-x: auto;
    padding: 10px;
    border-radius: 4px;
}

code {
    white-space: nowrap;
    font-family: monospace;
    font-size: 0.9em;
    color: #b93334;
}

@media (max-width: 600px) {
    .code-container {
        padding: 5px;
    }
    code {
        font-size: 0.8em;
    }
}
</style>
