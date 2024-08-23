import { createI18n } from 'vue-i18n'

export const messages = {
  en: {
    app: {
      name: "Stremio Addon Manager",
      summary: "Effortlessly manage the order of your Stremio addons without re-installing.",
      tagline: "Including the default Cinemeta catalogs."
    },
    summary: {
      why: "Why?",
      whyText1: "Stremio currently doesn't allow users to change the order that their installed addons appear on the home screen. As a work around, it is common for users to remove and re-install addons in the order they want them to appear. This is a tedious and cumbersome process. This addon uses the internal Stremio API to manipulate addon order without having to add/remove them.",
      whyText2: "This is a workaround and not a solution. It is not recommended to use this tool unless you are comfortable with the risks involved.",
      noSupport: "No support or warranty is given.",
      how: "How?",
      step1: "Connect your Stremio account. We support 2 different authentication methods:",
      step1a: "Login using your Stremio account (Facebook login is not supported)",
      step1b: "Login using an authentication key",
      step1b1: "Login to https://web.stremio.com/ using your Stremio credentials in your browser.",
      step1b2: "Open the developer console (?) and paste the follow code snippet:",
      step1b3: "Take the output value and paste it into the form below.",
      step2: "Click 'Load Addons' to load your profiles addons.",
      step3: "Re-order your addons as you like.",
      step4: "Click the 'Sync To Stremio' button to sync the changes back to your profile."
    },
    addon: {
      openConfig: "Open addon configuration page in new window",
      copyUrl: "Copy addon manifest URL to clipboard",
      remove: "Remove addon from list",
      editManifest: "Edit manifest JSON"
    },
    config: {
      title: "Configuration",
      step1: "Step 1: Load",
      loading: "Loading...",
      loadAddons: "Load User Addons",
      step2: "Step 2: Reorder",
      step3: "Step 3: Sync",
      syncToStremio: "Sync to Stremio",
      step0: "Step 0: Authenticate",
      emailPlaceholder: "Stremio E-mail",
      passwordPlaceholder: "Stremio Password",
      login: "Login",
      loggedIn: "Logged in",
      or: "OR",
      authKeyPlaceholder: "Paste Stremio AuthKey here...",
      editManifest: "Edit manifest"
    },
    dynamicForm: {
      name: "Name",
      description: "Description",
      logo: "Logo URL",
      background: "Background URL",
      catalogs: "Catalogs",
      catalogName: "Catalog Name",
      save: "Save",
      advancedMode: "Advanced mode",
      classicMode: "Classic mode",
      invalidJson: "Invalid JSON format"
    },
    thanks: {
      title: "Thank you",
      text: "Big thank you to <code>Sleeyax</code> and <code>&#60;Code/&#62;</code> for the conversations and code snippets that made this really easy to implement."
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: "What risks are involved?",
      a1_1: "This was whipped together in a couple of hours. It is not well tested and may break your Stremio profile. Stremio functionality relies on the existence of certain addons (ie, Cinemeta). It is possible that the order of addons is also important to some functionality.",
      a1_2: "There is currently no way to 'reset' your addons to previous configurations or default configurations.",
      q2: "Are my credentials safe?",
      a2_1: "Yes. We only use your credentials to authenticate with the Stremio API. We do not store them in any way; as soon as you refresh the page they are gone.",
      a2_2: "If you're still in doubt, we highly encourage you to go read the source code. You'll see there's no hidden funny business going on.",
      q3: "What is the developer console and how do I open it?",
      a3_1: "The browser developer console is a tool which logs the information associated with a web application, such as network requests and errors. It also allows you to interact with the loaded web page using JavaScript. Most modern browsers have a developer console built in.",
      a3_2: "Use <a href=\"https://balsamiq.com/support/faqs/browserconsole/\" target=\"_blank\">this guide</a> to open your browsers developer console, ensuring have the Stremio web app open.",
      q4: "Can I use this to move Cinemeta catalogs from the top?",
      a4_1: "Yes! This will allow you to move the Cinemeta provided catalogs (ie, Popular - Series/Movie and Featured - Series/Movie) from the top of your catalog list.",
      a4_2: "Do note that the in-built 'Continue watching' catalog cannot be moved from the top."
    },
    footer: {
      madeWith: "Made with ❤️, 🤖 and 🥞's - enjoy!",
      sourceCode: "Source Code"
    }
  },
  ar: {
    app: {
      name: "مدير إضافات Stremio",
      summary: "أدر ترتيب إضافات Stremio الخاصة بك بسهولة وبدون الحاجة لإعادة التثبيت.",
      tagline: "بما في ذلك فهارس Cinemeta الافتراضية."
    },
    summary: {
      why: "لماذا؟",
      whyText1: "لا يسمح Stremio حاليًا للمستخدمين بتغيير ترتيب الإضافات المثبتة على الشاشة الرئيسية. كحل بديل، يضطر المستخدمون غالبًا لإزالة الإضافات وإعادة تثبيتها بالترتيب الذي يريدونه. هذه عملية متعبة ومملة. تستخدم هذه الأداة واجهة برمجة تطبيقات (API) داخلية في Stremio لتعديل ترتيب الإضافات دون الحاجة إلى إضافتها/إزالتها.",
      whyText2: "هذا حل مؤقت (Workaround) وليس حلاً جذرياً. لا يوصى باستخدام هذه الأداة إلا إذا كنت على دراية بالمخاطر المحتملة.",
      noSupport: "لا نقدم أي دعم فني أو ضمانات.",
      how: "كيف؟",
      step1: "قم بتوصيل حساب Stremio الخاص بك. نحن ندعم طريقتين مختلفتين للمصادقة:",
      step1a: "تسجيل الدخول باستخدام حساب Stremio (تسجيل الدخول عبر فيسبوك غير مدعوم)",
      step1b: "تسجيل الدخول باستخدام مفتاح المصادقة (AuthKey)",
      step1b1: "سجل الدخول إلى https://web.stremio.com/ باستخدام بيانات Stremio الخاصة بك في المتصفح.",
      step1b2: "افتح وحدة تحكم المطورين (?) والصق الكود التالي:",
      step1b3: "انسخ القيمة الناتجة والصقها في النموذج أدناه.",
      step2: "انقر على 'تحميل الإضافات' لتحميل إضافات ملفك الشخصي.",
      step3: "أعد ترتيب الإضافات كما يحلو لك.",
      step4: "انقر على زر 'المزامنة مع Stremio' لحفظ التغييرات في ملفك الشخصي."
    },
    addon: {
      openConfig: "افتح صفحة إعدادات الإضافة في نافذة جديدة",
      copyUrl: "انسخ رابط الإضافة",
      remove: "احذف الإضافة من القائمة",
      editManifest: "تعديل بيانات الإضافة (JSON)"
    },
    config: {
      title: "الإعدادات",
      step1: "الخطوة الأولى: جلب الإضافات",
      loading: "جارٍ التحميل...",
      loadAddons: "استعرض إضافاتك الحالية",
      step2: "الخطوة الثانية: إعادة الترتيب",
      step3: "الخطوة الثالثة: المزامنة",
      syncToStremio: "زامن التعديلات مع Stremio",
      step0: "الخطوة التمهيدية: تسجيل الدخول",
      emailPlaceholder: "البريد الإلكتروني (Stremio)",
      passwordPlaceholder: "كلمة المرور (Stremio)",
      login: "تسجيل الدخول",
      loggedIn: "تم تسجيل الدخول",
      or: "أو",
      authKeyPlaceholder: "ضع رمز Stremio AuthKey هنا...",
      editManifest: "تعديل المانيفست (بيانات الإضافة)"
    },
    dynamicForm: {
      name: "الاسم",
      description: "الوصف",
      logo: "رابط اللوجو (الشعار)",
      background: "رابط صورة الخلفية",
      catalogs: "الفهارس (Catalogs)",
      catalogName: "اسم الفهرس",
      save: "حفظ",
      advancedMode: "الوضع المتقدم",
      classicMode: "الوضع الكلاسيكي",
      invalidJson: "تنسيق JSON غير صالح"
    },
    thanks: {
      title: "شكر خاص",
      text: "شكر كبير لـ <code>Sleeyax</code> و <code>&#60;Code/&#62;</code> على النقاشات والأكواد البرمجية التي جعلت تنفيذ هذه الأداة سهلاً للغاية."
    },
    faq: {
      title: "الأسئلة الشائعة",
      q1: "ما هي المخاطر المحتملة؟",
      a1_1: "تم إنشاء هذه الأداة في غضون بضع ساعات. لم يتم اختبارها بشكل مكثف وقد تتسبب في تعطل ملف Stremio الخاص بك. تعتمد بعض وظائف Stremio على وجود إضافات معينة (مثل Cinemeta). من المحتمل أن يكون ترتيب الإضافات مهماً لبعض الوظائف.",
      a1_2: "لا توجد حاليًا طريقة لـ 'إعادة تعيين' الإضافات إلى إعداداتها السابقة أو الافتراضية.",
      q2: "هل بيانات تسجيل الدخول الخاصة بي آمنة؟",
      a2_1: "نعم. نستخدم بياناتك فقط للمصادقة مع Stremio API. نحن لا نقوم بتخزينها بأي شكل من الأشكال؛ بمجرد تحديث الصفحة، سيتم مسحها.",
      a2_2: "إذا كان لا يزال لديك شك، فنحن نشجعك بشدة على قراءة الكود المصدري. سترى أنه لا توجد أي عمليات مخفية.",
      q3: "ما هي وحدة تحكم المطورين (Developer Console) وكيف أفتحها؟",
      a3_1: "وحدة تحكم مطوري المتصفح هي أداة تسجل المعلومات المرتبطة بتطبيق الويب، مثل طلبات الشبكة والأخطاء. وتتيح لك أيضاً التفاعل مع الصفحة المحملة باستخدام JavaScript. معظم المتصفحات الحديثة تحتوي على هذه الأداة مدمجة.",
      a3_2: "استخدم <a href=\"https://balsamiq.com/support/faqs/browserconsole/\" target=\"_blank\">هذا الدليل</a> لفتح وحدة تحكم المطورين في متصفحك، مع التأكد من فتح تطبيق الويب الخاص بـ Stremio.",
      q4: "هل يمكنني استخدام هذه الأداة لإبعاد فهارس Cinemeta من الأعلى؟",
      a4_1: "نعم! سيتيح لك هذا إزالة الفهارس التي توفرها Cinemeta (مثل Popular - Series/Movie و Featured - Series/Movie) من أعلى قائمة الفهارس لديك.",
      a4_2: "لاحظ أنه لا يمكن إزالة فهرس 'متابعة المشاهدة' (Continue watching) المدمج من الأعلى."
    },
    footer: {
      madeWith: "صُنع بكل ❤️ و 🤖 و 🥞 - استمتع!",
      sourceCode: "الكود المصدري"
    }
  }
}

export const i18n = createI18n({
  locale: 'ar',
  fallbackLocale: 'en',
  messages,
  missing: (locale, key) => {
    setTimeout(() => {
      console.warn(`[i18n] Missing translation for key: ${key} in ${locale}`)
    }, 0)
  }
})
