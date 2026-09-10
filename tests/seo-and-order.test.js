import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { normalizeSiteUrl } from '../scripts/seo.js'
import { moveAddon } from '../src/utils/addon-order.js'

test('site URL accepts only a clean HTTPS origin', () => {
  assert.equal(normalizeSiteUrl('https://stremio-addon-manager-teal.vercel.app'), 'https://stremio-addon-manager-teal.vercel.app/')
  for (const url of ['http://example.org', 'https://user:pass@example.org', 'https://example.org/path', 'https://example.org/?key=private', 'https://example.org/#private']) {
    assert.throws(() => normalizeSiteUrl(url))
  }
})

test('production metadata uses one real canonical and absolute sharing image', () => {
  const html = readFileSync('dist/index.html', 'utf8')
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.match(html, /href="https:\/\/stremio-addon-manager-teal.vercel.app\/"/)
  assert.match(html, /property="og:image" content="https:\/\/stremio-addon-manager-teal.vercel.app\/logo.png"/)
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.equal(schema['@type'], 'WebApplication')
  assert.equal(schema.url, 'https://stremio-addon-manager-teal.vercel.app/')
  assert.match(html, /عن مدير إضافات ستريميو/)
  assert.match(html, /This is an unofficial project/)
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/stremio-addon-manager-teal.vercel.app\/sitemap.xml/)
  assert.match(readFileSync('dist/sitemap.xml', 'utf8'), /<loc>https:\/\/stremio-addon-manager-teal.vercel.app\/<\/loc>/)
})

test('touch and keyboard moves preserve full addon objects and protected entries', () => {
  const protectedAddon = { manifest: { name: 'Cinemeta' }, flags: { protected: true } }
  const custom = { manifest: { name: 'Custom' } }
  const addons = [protectedAddon, custom]
  assert.equal(moveAddon(addons, 1, -1), true)
  assert.deepEqual(addons, [custom, protectedAddon])
  assert.equal(addons[1], protectedAddon)
  assert.equal(moveAddon(addons, 0, 1), true)
  assert.deepEqual(addons, [protectedAddon, custom])
})

test('boundary moves cannot delete, duplicate, or wrap an addon', () => {
  const addons = [{ id: 'a' }, { id: 'b' }]
  const before = [...addons]
  for (const [index, offset] of [[0,-1],[1,1],[-1,1],[2,-1],[0,2],[0.5,1]]) {
    assert.equal(moveAddon(addons, index, offset), false)
    assert.deepEqual(addons, before)
  }
})
