import { loadEnv } from 'vite'

const title = 'مدير إضافات ستريميو | Stremio Addon Manager'
const description = 'رتّب إضافات Stremio وكتالوجات Cinemeta، عدّل بيانات الإضافات وزامن الترتيب مع حسابك، دون إعادة التثبيت.'
const repository = 'https://github.com/2-sa/stremio-addon-manager'
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

export function normalizeSiteUrl(value) {
  if (!value) return ''
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('SITE_URL must be an HTTPS origin without credentials, a path, query, or fragment.')
  }
  return url.origin + '/'
}

export function seoPlugin() {
  let siteUrl = ''
  return {
    name: 'stremio-seo',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      siteUrl = normalizeSiteUrl(process.env.SITE_URL ?? env.SITE_URL ?? 'https://stremio-addon-manager-teal.vercel.app/')
      if (config.command === 'build' && !siteUrl) {
        config.logger.warn('SITE_URL is not set: canonical URL, absolute share images and sitemap are omitted.')
      }
    },
    transformIndexHtml() {
      const application = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'مدير إضافات ستريميو',
        alternateName: 'Stremio Addon Manager',
        description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        inLanguage: ['ar', 'en'],
        isAccessibleForFree: true,
        author: { '@type': 'Person', name: '2-sa', url: 'https://github.com/2-sa' },
        sameAs: repository,
        featureList: ['Reorder Stremio addons including Cinemeta', 'Remove non-protected addons', 'Edit addon manifests', 'Sync addon order to Stremio'],
        ...(siteUrl ? { url: siteUrl, image: siteUrl + 'logo.png' } : {})
      }
      const tags = [
        { tag: 'meta', attrs: { name: 'description', content: description }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'robots', content: 'index, follow, max-image-preview:large' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'Stremio Addon Manager' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'ar_SA' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:title', content: title }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:description', content: description }, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(application).replace(/</g, '\\u003c'), injectTo: 'head' }
      ]
      if (siteUrl) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: siteUrl }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: siteUrl }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: siteUrl + 'logo.png' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Stremio Addon Manager' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: siteUrl + 'logo.png' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'Stremio Addon Manager' }, injectTo: 'head' }
        )
      }
      return tags
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: 'User-agent: *\nAllow: /\n' + (siteUrl ? '\nSitemap: ' + siteUrl + 'sitemap.xml\n' : '') })
      if (siteUrl) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + escape(siteUrl) + '</loc></url></urlset>\n' })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: '# Stremio Addon Manager\n\n> Free, open-source browser utility for organizing a Stremio account’s addons. This is an unofficial project.\n\n## Capabilities\n- Reorder installed addons, including Cinemeta catalogs.\n- Remove addons that are not protected.\n- Edit addon manifest metadata.\n- Explicitly sync the changed collection to Stremio.\n\n## Authentication and limitations\nUses a Stremio email/password login or AuthKey. Authentication and synchronization requests go from the browser to https://api.strem.io/api/. This project is not affiliated with Stremio and provides no warranty. Never share credentials or AuthKeys.\n\n## Links\n' + (siteUrl ? '- [Application](' + siteUrl + ')\n' : '') + '- [Source and documentation](' + repository + ')\n- [Stremio Web](https://web.stremio.com/)\n' })
    }
  }
}
