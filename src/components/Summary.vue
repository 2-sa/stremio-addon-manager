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
            {{ $t('summary.step1b2') }} <a href="#faq">(?)</a> <code>JSON.parse(localStorage.getItem("profile")).auth.key</code>
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
