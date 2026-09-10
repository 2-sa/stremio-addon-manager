<script setup>
import './assets/main.css'
import Navbar from './components/Navbar.vue'
import InfoGuide from './components/InfoGuide.vue'
import Configuration from './components/Configuration.vue'
import Faq from './components/Faq.vue'
import Footer from './components/Footer.vue'
import './assets/studio.css'
</script>

<template>
  <div class="app-layout">
    <a class="skip-link" href="#configure">{{ $i18n.locale === 'ar' ? 'انتقل إلى إدارة الإضافات' : 'Skip to addon manager' }}</a>
    <Navbar />
    <header class="workspace-heading">
      <div>
        <p class="eyebrow">STREMIO / ADDON MANAGER</p>
        <h1>{{ $i18n.locale === 'ar' ? 'إضافاتك، بالترتيب الذي تحبّه.' : 'Your addons. Your order.' }}</h1>
        <p>{{ $i18n.locale === 'ar' ? 'رتّب مكتبتك وعدّل إضافاتك، ثم احفظ التغييرات في حساب Stremio.' : 'Arrange your library, edit your addons, then sync changes to Stremio.' }}</p>
      </div>
      <span class="workspace-label"><span></span>{{ $i18n.locale === 'ar' ? 'مساحة إدارة الإضافات' : 'Addon workspace' }}</span>
    </header>
    <main class="workspace-grid">
      <Configuration />
      <aside class="workspace-aside" :aria-label="$i18n.locale === 'ar' ? 'دليل الاستخدام' : 'Getting started'">
        <section class="quick-guide">
          <span class="eyebrow">{{ $i18n.locale === 'ar' ? 'من هنا تبدأ' : 'GETTING STARTED' }}</span>
          <h2>{{ $i18n.locale === 'ar' ? 'مكتبتك، على ذوقك' : 'Make it your library' }}</h2>
          <ol>
            <li><span>01</span><div><h3>{{ $i18n.locale === 'ar' ? 'اربط حسابك' : 'Connect your account' }}</h3><p>{{ $i18n.locale === 'ar' ? 'استخدم بريد Stremio أو مفتاح AuthKey.' : 'Use your Stremio email or AuthKey.' }}</p></div></li>
            <li><span>02</span><div><h3>{{ $i18n.locale === 'ar' ? 'اختر الترتيب الأنسب' : 'Find your flow' }}</h3><p>{{ $i18n.locale === 'ar' ? 'حمّل إضافاتك، ثم اسحبها لترتيبها.' : 'Load your addons, then drag to reorder.' }}</p></div></li>
            <li><span>03</span><div><h3>{{ $i18n.locale === 'ar' ? 'احفظ وابدأ المشاهدة' : 'Sync and settle in' }}</h3><p>{{ $i18n.locale === 'ar' ? 'زامن التغييرات وأعد فتح Stremio.' : 'Sync your changes and reopen Stremio.' }}</p></div></li>
          </ol>
          <div class="guide-note">{{ $i18n.locale === 'ar' ? 'يدعم إعادة ترتيب كتالوجات Cinemeta الافتراضية أيضًا.' : 'Includes reordering the default Cinemeta catalogs.' }}</div>
        </section>
        <InfoGuide />
      </aside>
      <section id="faq" class="workspace-faq"><Faq /></section>
    </main>
    <Footer />
  </div>
</template>
