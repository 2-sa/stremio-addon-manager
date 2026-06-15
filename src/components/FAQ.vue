<template>
    <section id="faq">
        <h2>{{ $t('faq.title') }}</h2>
        <details>
            <summary>
                {{ $t('faq.q1') }}
            </summary>
            <p>
                {{ $t('faq.a1_1') }}
            </p>
            <p>
                {{ $t('faq.a1_2') }}
            </p>
        </details>
        <details>
            <summary>
                {{ $t('faq.q2') }}
            </summary>
            <p>
                {{ $t('faq.a2_1') }}
            </p>
            <p>
                {{ $t('faq.a2_2') }}
            </p>
        </details>
        <details>
            <summary>
                {{ $t('faq.q3') }}
            </summary>
            <p>
                {{ $t('faq.a3_1') }}
            </p>
            <p v-html="$t('faq.a3_2')"></p>
        </details>
        <details>
            <summary>
                {{ $t('faq.q4') }}
            </summary>
            <p>
                {{ $t('faq.a4_1') }}
            </p>
            <p>
                {{ $t('faq.a4_2') }}
            </p>
        </details>
    </section>
</template>
