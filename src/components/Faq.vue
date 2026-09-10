<script setup>
import { ref } from 'vue'

const activeIdx = ref(null)

const faqItems = [
  {
    qAr: 'هل يتم حفظ الترتيب على جميع أجهزتي المتصلة بحسابي؟',
    qEn: 'Is the new addon order saved across all my devices?',
    aAr: 'نعم! بمجرد النقر على زر "حفظ ومزامنة الترتيب في Stremio"، يتم رفع القائمة الجديدة مباشرة إلى سحابة Stremio الرسمية. ستنعكس التغييرات فوراً على التلفاز، الهاتف، والحاسوب بمجرد إغلاق وفتح تطبيق Stremio.',
    aEn: 'Yes! Once you click the "Sync to Stremio" button, your new order is uploaded straight to Stremio official cloud. Changes will reflect on your TV, phone, and PC as soon as you restart the Stremio app.'
  },
  {
    qAr: 'لماذا تظهر بعض الإضافات بشارة "محمي Protected" ولا يمكن حذفها؟',
    qEn: 'Why do some addons show as "Protected" and cannot be deleted?',
    aAr: 'الإضافات المحمية (مثل Cinemeta و YouTube و WatchHub) هي جزء أساسي من نواة نظام Stremio الافتراضية. لا يسمح خادم Stremio بحذف هذه الإضافات لضمان عدم تعطل الوظائف الأساسية للمشغل.',
    aEn: 'Protected addons (like Cinemeta, YouTube, and WatchHub) are built-in core components of Stremio. The official server prevents deleting them to ensure basic player functionality remains intact.'
  },
  {
    qAr: 'هل بيانات دخولي ومفتاح AuthKey آمنة عند استخدام هذا التطبيق؟',
    qEn: 'Are my login credentials and AuthKey secure when using this app?',
    aAr: 'بالتأكيد 100%. هذه الأداة تعمل بالكامل داخل متصفحك (Client-side). يتم إرسال طلبات المصادقة والمزامنة مباشرة من متصفحك إلى خوادم Stremio الرسمية (api.strem.io) دون المرور بأي خوادم وسيطة أو تخزين خارجي.',
    aEn: 'Absolutely 100%. This tool runs completely locally inside your browser (Client-side). Authentication and sync requests go directly from your browser to official Stremio API servers without intermediary servers.'
  },
  {
    qAr: 'ماذا يعني زر "تعديل الـ Manifest" (أيقونة القلم) بجانب الإضافة؟',
    qEn: 'What does the "Edit Manifest" (pencil icon) do?',
    aAr: 'يتيح لك تعديل بيانات الإضافة المحلية مثل تغيير الاسم الظاهر، الوصف، رابط الأيقونة أو اسم الكتالوجات (Catalogs) قبل حفظها ومزامنتها مع حسابك.',
    aEn: 'It allows you to locally modify manifest metadata such as the display name, description, logo URL, or catalog labels before syncing them back to your account.'
  }
]

function toggleAccordion(idx) {
  activeIdx.value = activeIdx.value === idx ? null : idx
}
</script>

<template>
  <div class="faq-card card">
    <div class="faq-header">
      <div class="faq-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div>
        <h3>{{ $i18n.locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently asked questions' }}</h3>
        <p class="faq-subtitle">{{ $i18n.locale === 'ar' ? 'كل ما تحتاج معرفته عن إدارة إضافاتك.' : 'A little help with managing your addons.' }}</p>
      </div>
    </div>

    <div class="accordion-list">
      <div 
        v-for="(item, index) in faqItems" 
        :key="index" 
        class="accordion-item" 
        :class="{ 'open': activeIdx === index }"
      >
        <button class="accordion-trigger" :aria-expanded="activeIdx === index" @click="toggleAccordion(index)">
          <span class="question-text">
            {{ $i18n.locale === 'ar' ? item.qAr : item.qEn }}
          </span>
          <div class="chevron-box" :class="{ 'rotate': activeIdx === index }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </button>

        <Transition name="accordion">
          <div v-if="activeIdx === index" class="accordion-body">
            <p>{{ $i18n.locale === 'ar' ? item.aAr : item.aEn }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-card {
  padding: 2.25rem;
}

.faq-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.faq-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--warning-bg);
  color: var(--warning);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.faq-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.accordion-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.accordion-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
}

.accordion-item.open {
  border-color: var(--accent-2);
  background: var(--card-bg);
  box-shadow: var(--shadow-sm);
}

.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: inherit;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text-primary);
  gap: 1rem;
  transition: var(--transition);
}

.accordion-trigger:hover {
  color: var(--accent-2);
}

.chevron-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition);
  flex-shrink: 0;
}

.chevron-box.rotate {
  transform: rotate(180deg);
  background: var(--info-bg);
  color: var(--accent-2);
  border-color: var(--accent-2);
}

.accordion-body {
  padding: 0 1.25rem 1.25rem;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.7;
}

.accordion-body p {
  margin: 0;
}

/* Animations */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 300px;
  opacity: 1;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  padding-bottom: 0;
}

@media (max-width: 600px) {
  .faq-card {
    padding: 1.5rem;
  }
  .faq-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
