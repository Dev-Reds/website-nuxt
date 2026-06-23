<template>
  <div class="geo-page">
    <ClientOnly>
      <div v-if="mapReady" class="mode-bar">
        <button :class="['mode-btn', { active: gameMode === 'landscape' }]" @click="gameMode = 'landscape'">Länder</button>
        <button :class="['mode-btn', { active: gameMode === 'flags' }]" @click="gameMode = 'flags'">Flaggen</button>
        <div class="streak-display">
          <span v-if="streak > 0" class="streak-fire">{{ '🔥'.repeat(Math.min(streak, 5)) }}</span>
          <span class="streak-num">{{ streak }}</span>
          <span class="streak-label">Serie</span>
        </div>
      </div>
      <div v-if="mapReady" class="top-bar">
        <input v-model="customTarget" list="country-list" @keyup.enter="selectCountry" placeholder="Land eingeben..." class="country-input">
        <datalist id="country-list">
          <option v-for="c in countries" :key="c.nameDe" :value="c.nameDe"/>
        </datalist>
        <button @click="selectCountry" class="ok-btn">Übernehmen</button>
        <button @click="shareCountry" class="share-btn">Teilen</button>
        <span v-if="copied" class="copied-msg">Link kopiert!</span>
      </div>
      <div v-if="mapReady" class="target-area">
        <img v-if="gameMode === 'flags'" :src="`https://flagcdn.com/w160/${target.code.toLowerCase()}.png`" :alt="target.nameDe" class="flag-img">
        <div v-if="gameMode !== 'flags'" class="target-name">{{ target.nameDe }}</div>
      </div>
      <div ref="mapContainer" class="map-container">
        <div v-if="!mapReady" class="map-placeholder">Karte wird geladen...</div>
      </div>
      <div v-if="evaluated" class="eval-overlay distance-text">Entfernung: {{ distanceText }}</div>
      <div v-if="!evaluated && hasMarker" class="eval-row">
        <button @click="evaluate" class="action-btn">Auswerten</button>
      </div>
      <div class="skip-bar">
        <button @click="nextRound" class="action-btn">{{ evaluated ? 'Nächstes Land' : 'Überspringen' }}</button>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Land-Guesser' })

import { ref, watch, onMounted } from 'vue'
import type { Map as LeafletMap, LeafletMouseEvent } from 'leaflet'

const route = useRoute()

interface Country {
  nameDe: string
  nameEn: string
  code: string
}

const mapContainer = ref<HTMLDivElement>()
const mapReady = ref(false)
const hasMarker = ref(false)
const evaluated = ref(false)
const distanceText = ref('')
const customTarget = ref('')
const copied = ref(false)
const gameMode = ref(typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('geo_mode') || 'landscape') : 'landscape')
const streak = ref(0)

if (typeof sessionStorage !== 'undefined') {
  streak.value = parseInt(sessionStorage.getItem('geo_streak') || '0', 10)
}

watch(gameMode, () => {
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('geo_mode', gameMode.value)
})

let map: LeafletMap | null = null
let marker: any = null
let targetMarker: any = null
let line: any = null
let evaluating = false
let L: any

const countries: Country[] = [
  { nameDe: 'Ägypten', nameEn: 'Egypt', code: 'EG' }, { nameDe: 'Äthiopien', nameEn: 'Ethiopia', code: 'ET' },
  { nameDe: 'Afghanistan', nameEn: 'Afghanistan', code: 'AF' }, { nameDe: 'Albanien', nameEn: 'Albania', code: 'AL' },
  { nameDe: 'Algerien', nameEn: 'Algeria', code: 'DZ' }, { nameDe: 'Angola', nameEn: 'Angola', code: 'AO' },
  { nameDe: 'Argentinien', nameEn: 'Argentina', code: 'AR' }, { nameDe: 'Australien', nameEn: 'Australia', code: 'AU' },
  { nameDe: 'Bangladesch', nameEn: 'Bangladesh', code: 'BD' }, { nameDe: 'Belgien', nameEn: 'Belgium', code: 'BE' },
  { nameDe: 'Bolivien', nameEn: 'Bolivia', code: 'BO' }, { nameDe: 'Bosnien und Herzegowina', nameEn: 'Bosnia and Herzegovina', code: 'BA' },
  { nameDe: 'Brasilien', nameEn: 'Brazil', code: 'BR' }, { nameDe: 'Bulgarien', nameEn: 'Bulgaria', code: 'BG' },
  { nameDe: 'Chile', nameEn: 'Chile', code: 'CL' }, { nameDe: 'China', nameEn: 'China', code: 'CN' },
  { nameDe: 'Costa Rica', nameEn: 'Costa Rica', code: 'CR' }, { nameDe: 'Dänemark', nameEn: 'Denmark', code: 'DK' },
  { nameDe: 'Deutschland', nameEn: 'Germany', code: 'DE' }, { nameDe: 'Ecuador', nameEn: 'Ecuador', code: 'EC' },
  { nameDe: 'El Salvador', nameEn: 'El Salvador', code: 'SV' }, { nameDe: 'Elfenbeinküste', nameEn: 'Ivory Coast', code: 'CI' },
  { nameDe: 'Estland', nameEn: 'Estonia', code: 'EE' }, { nameDe: 'Finnland', nameEn: 'Finland', code: 'FI' },
  { nameDe: 'Frankreich', nameEn: 'France', code: 'FR' }, { nameDe: 'Ghana', nameEn: 'Ghana', code: 'GH' },
  { nameDe: 'Griechenland', nameEn: 'Greece', code: 'GR' }, { nameDe: 'Grönland', nameEn: 'Greenland', code: 'GL' },
  { nameDe: 'Guatemala', nameEn: 'Guatemala', code: 'GT' }, { nameDe: 'Honduras', nameEn: 'Honduras', code: 'HN' },
  { nameDe: 'Indien', nameEn: 'India', code: 'IN' }, { nameDe: 'Indonesien', nameEn: 'Indonesia', code: 'ID' },
  { nameDe: 'Irak', nameEn: 'Iraq', code: 'IQ' }, { nameDe: 'Iran', nameEn: 'Iran', code: 'IR' },
  { nameDe: 'Irland', nameEn: 'Ireland', code: 'IE' }, { nameDe: 'Island', nameEn: 'Iceland', code: 'IS' },
  { nameDe: 'Israel', nameEn: 'Israel', code: 'IL' }, { nameDe: 'Italien', nameEn: 'Italy', code: 'IT' },
  { nameDe: 'Jamaika', nameEn: 'Jamaica', code: 'JM' }, { nameDe: 'Japan', nameEn: 'Japan', code: 'JP' },
  { nameDe: 'Jemen', nameEn: 'Yemen', code: 'YE' }, { nameDe: 'Jordanien', nameEn: 'Jordan', code: 'JO' },
  { nameDe: 'Kambodscha', nameEn: 'Cambodia', code: 'KH' }, { nameDe: 'Kamerun', nameEn: 'Cameroon', code: 'CM' },
  { nameDe: 'Kanada', nameEn: 'Canada', code: 'CA' }, { nameDe: 'Kasachstan', nameEn: 'Kazakhstan', code: 'KZ' },
  { nameDe: 'Katar', nameEn: 'Qatar', code: 'QA' }, { nameDe: 'Kenia', nameEn: 'Kenya', code: 'KE' },
  { nameDe: 'Kirgisistan', nameEn: 'Kyrgyzstan', code: 'KG' }, { nameDe: 'Kolumbien', nameEn: 'Colombia', code: 'CO' },
  { nameDe: 'Kosovo', nameEn: 'Kosovo', code: 'XK' }, { nameDe: 'Kroatien', nameEn: 'Croatia', code: 'HR' },
  { nameDe: 'Kuba', nameEn: 'Cuba', code: 'CU' }, { nameDe: 'Laos', nameEn: 'Laos', code: 'LA' },
  { nameDe: 'Lettland', nameEn: 'Latvia', code: 'LV' }, { nameDe: 'Libanon', nameEn: 'Lebanon', code: 'LB' },
  { nameDe: 'Libyen', nameEn: 'Libya', code: 'LY' }, { nameDe: 'Litauen', nameEn: 'Lithuania', code: 'LT' },
  { nameDe: 'Luxemburg', nameEn: 'Luxembourg', code: 'LU' }, { nameDe: 'Madagaskar', nameEn: 'Madagascar', code: 'MG' },
  { nameDe: 'Malaysia', nameEn: 'Malaysia', code: 'MY' }, { nameDe: 'Marokko', nameEn: 'Morocco', code: 'MA' },
  { nameDe: 'Mexiko', nameEn: 'Mexico', code: 'MX' }, { nameDe: 'Mongolei', nameEn: 'Mongolia', code: 'MN' },
  { nameDe: 'Montenegro', nameEn: 'Montenegro', code: 'ME' }, { nameDe: 'Mosambik', nameEn: 'Mozambique', code: 'MZ' },
  { nameDe: 'Myanmar', nameEn: 'Myanmar', code: 'MM' }, { nameDe: 'Namibia', nameEn: 'Namibia', code: 'NA' },
  { nameDe: 'Nepal', nameEn: 'Nepal', code: 'NP' }, { nameDe: 'Neuseeland', nameEn: 'New Zealand', code: 'NZ' },
  { nameDe: 'Nicaragua', nameEn: 'Nicaragua', code: 'NI' }, { nameDe: 'Niederlande', nameEn: 'Netherlands', code: 'NL' },
  { nameDe: 'Nigeria', nameEn: 'Nigeria', code: 'NG' }, { nameDe: 'Norwegen', nameEn: 'Norway', code: 'NO' },
  { nameDe: 'Österreich', nameEn: 'Austria', code: 'AT' }, { nameDe: 'Oman', nameEn: 'Oman', code: 'OM' },
  { nameDe: 'Pakistan', nameEn: 'Pakistan', code: 'PK' }, { nameDe: 'Panama', nameEn: 'Panama', code: 'PA' },
  { nameDe: 'Peru', nameEn: 'Peru', code: 'PE' }, { nameDe: 'Philippinen', nameEn: 'Philippines', code: 'PH' },
  { nameDe: 'Polen', nameEn: 'Poland', code: 'PL' }, { nameDe: 'Portugal', nameEn: 'Portugal', code: 'PT' },
  { nameDe: 'Rumänien', nameEn: 'Romania', code: 'RO' }, { nameDe: 'Ruanda', nameEn: 'Rwanda', code: 'RW' },
  { nameDe: 'Russland', nameEn: 'Russia', code: 'RU' }, { nameDe: 'Sambia', nameEn: 'Zambia', code: 'ZM' },
  { nameDe: 'Saudi-Arabien', nameEn: 'Saudi Arabia', code: 'SA' }, { nameDe: 'Schweden', nameEn: 'Sweden', code: 'SE' },
  { nameDe: 'Schweiz', nameEn: 'Switzerland', code: 'CH' }, { nameDe: 'Senegal', nameEn: 'Senegal', code: 'SN' },
  { nameDe: 'Serbien', nameEn: 'Serbia', code: 'RS' }, { nameDe: 'Simbabwe', nameEn: 'Zimbabwe', code: 'ZW' },
  { nameDe: 'Singapur', nameEn: 'Singapore', code: 'SG' }, { nameDe: 'Slowakei', nameEn: 'Slovakia', code: 'SK' },
  { nameDe: 'Slowenien', nameEn: 'Slovenia', code: 'SI' }, { nameDe: 'Somalia', nameEn: 'Somalia', code: 'SO' },
  { nameDe: 'Spanien', nameEn: 'Spain', code: 'ES' }, { nameDe: 'Sri Lanka', nameEn: 'Sri Lanka', code: 'LK' },
  { nameDe: 'Sudan', nameEn: 'Sudan', code: 'SD' }, { nameDe: 'Südafrika', nameEn: 'South Africa', code: 'ZA' },
  { nameDe: 'Südkorea', nameEn: 'South Korea', code: 'KR' }, { nameDe: 'Syrien', nameEn: 'Syria', code: 'SY' },
  { nameDe: 'Tansania', nameEn: 'Tanzania', code: 'TZ' }, { nameDe: 'Thailand', nameEn: 'Thailand', code: 'TH' },
  { nameDe: 'Tschechien', nameEn: 'Czech Republic', code: 'CZ' }, { nameDe: 'Tunesien', nameEn: 'Tunisia', code: 'TN' },
  { nameDe: 'Türkei', nameEn: 'Turkey', code: 'TR' }, { nameDe: 'Uganda', nameEn: 'Uganda', code: 'UG' },
  { nameDe: 'Ukraine', nameEn: 'Ukraine', code: 'UA' }, { nameDe: 'Ungarn', nameEn: 'Hungary', code: 'HU' },
  { nameDe: 'Uruguay', nameEn: 'Uruguay', code: 'UY' }, { nameDe: 'Usbekistan', nameEn: 'Uzbekistan', code: 'UZ' },
  { nameDe: 'Venezuela', nameEn: 'Venezuela', code: 'VE' }, { nameDe: 'Vietnam', nameEn: 'Vietnam', code: 'VN' },
  { nameDe: 'Vereinigte Arabische Emirate', nameEn: 'United Arab Emirates', code: 'AE' },
  { nameDe: 'Vereinigte Staaten', nameEn: 'United States', code: 'US' },
  { nameDe: 'Vereinigtes Königreich', nameEn: 'United Kingdom', code: 'GB' },
  { nameDe: 'Weißrussland', nameEn: 'Belarus', code: 'BY' },
]

onMounted(async () => {
  const leaflet = await import('leaflet')
  await import('leaflet/dist/leaflet.css')
  L = leaflet.default || leaflet
  initMap()
  mapReady.value = true
  const shared = route.query.country
  if (shared) {
    const match = countries.find((c) => c.nameEn === shared || c.nameDe === shared)
    if (match) target.value = match as Country
  }
  fetchTargetData()
})

function initMap() {
  if (!mapContainer.value) return
  map = L.map(mapContainer.value, {
    center: [0, 0], zoom: 2, minZoom: 2, maxZoom: 8, zoomControl: true,
    maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
    maxBoundsViscosity: 1,
  })
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri, DeLorme, HERE, USGS, Intermap, increment P Corp., NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), MapmyIndia, NGCC, &copy; OpenStreetMap contributors',
    noWrap: true,
  }).addTo(map!)
  map!.on('click', onMapClick)
}

function onMapClick(e: LeafletMouseEvent) {
  if (evaluated.value || evaluating) return
  if (marker) { map?.removeLayer(marker) }
  marker = L.circleMarker([e.latlng.lat, e.latlng.lng], {
    radius: 10, fillColor: '#2196f3', color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.8,
  }).bindTooltip('Deine Antwort', { permanent: true, direction: 'top', className: 'geo-tooltip' }).addTo(map!)
  marker.lat = e.latlng.lat
  marker.lng = e.latlng.lng
  hasMarker.value = true
}

async function evaluate() {
  if (evaluating || !marker) return
  evaluating = true

  await fetchTargetData()

  let correct = false
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.lat}&lon=${marker.lng}&zoom=3`,
      { headers: { 'User-Agent': 'GeoReferat/1.0', 'Accept-Language': 'de' } }
    )
    const data = await res.json()
    const clickedCountry = data.address?.country
    if (clickedCountry) {
      const matched = countries.find(
        (c) => c.nameEn.toLowerCase() === clickedCountry.toLowerCase() ||
               c.nameDe.toLowerCase() === clickedCountry.toLowerCase()
      )
      correct = matched?.nameDe === target.value.nameDe
    }
    marker.setStyle({ fillColor: correct ? '#4caf50' : '#f44336' })
  } catch {
    marker.setStyle({ fillColor: '#9e9e9e' })
  }

  if (correct) { streak.value++; if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('geo_streak', String(streak.value)) }
  else { streak.value = 0; if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('geo_streak', '0') }

  showTargetCountry()

  if (targetGeoCache) {
    const userLatLng = L.latLng(marker.lat, marker.lng)
    const targetLatLng = L.latLng(targetCacheLat, targetCacheLng)
    const geojson = targetGeoCache.geojson
    const endPoint = geojson && !correct ? nearestBorder(userLatLng, geojson) : targetLatLng
    const dist = correct ? 0 : map!.distance(userLatLng, endPoint)
    distanceText.value = correct ? '0 m' : `${Math.round(dist / 1000).toLocaleString('de-DE')} km`

    if (!correct) {
      line = L.polyline([userLatLng, endPoint], {
        color: '#ff9800', weight: 3, opacity: 0.9, dashArray: '8 12',
      }).addTo(map!)
    }
  } else {
    distanceText.value = '— km'
  }

  evaluated.value = true
  evaluating = false
}

function nearestBorder(point: any, geojson: any) {
  const rings = geojson.type === 'MultiPolygon' ? geojson.coordinates.flat() :
                geojson.type === 'Polygon' ? geojson.coordinates : []
  let minDist = Infinity
  let nearest = point
  const steps = 15
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [lng1, lat1] = ring[i]
      const [lng2, lat2] = ring[i + 1]
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const p = L.latLng(lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t)
        const d = map!.distance(point, p)
        if (d < minDist) { minDist = d; nearest = p }
      }
    }
  }
  return nearest
}

const target = ref<Country>(countries[Math.floor(Math.random() * countries.length)] as Country)
let targetGeoCache: any = null
let targetCacheLat = 0
let targetCacheLng = 0

const TARGET_CACHE: Record<string, any> = {}

async function fetchTargetData() {
  const en = target.value.nameEn
  if (TARGET_CACHE[en]) { targetGeoCache = TARGET_CACHE[en]; targetCacheLat = targetGeoCache.lat; targetCacheLng = targetGeoCache.lon; return }
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(en)}&limit=10&polygon_geojson=1`,
      { headers: { 'User-Agent': 'GeoReferat/1.0' } }
    )
    const data = await res.json()
    const countryResult = data.find((r: any) => r.type === 'country') || data[0]
    if (countryResult) {
      targetGeoCache = countryResult
      targetCacheLat = parseFloat(countryResult.lat)
      targetCacheLng = parseFloat(countryResult.lon)
      TARGET_CACHE[en] = countryResult
    }
  } catch {}
}

function showTargetCountry() {
  if (!targetGeoCache || !map) return
  if (targetMarker) { map.removeLayer(targetMarker); targetMarker = null }
  if (targetGeoCache.geojson) {
    targetMarker = L.geoJSON(targetGeoCache.geojson, {
      style: { color: '#2196f3', weight: 2, fillColor: '#2196f3', fillOpacity: 0.15 },
    }).addTo(map)
  } else {
    targetMarker = L.circleMarker([targetCacheLat, targetCacheLng], {
      radius: 10, fillColor: '#2196f3', color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.8,
    }).addTo(map)
  }
  targetMarker.bindTooltip(target.value.nameDe, { permanent: true, direction: 'top', className: 'geo-tooltip' })
}

function nextRound() {
  cleanup()
  target.value = countries[Math.floor(Math.random() * countries.length)] as Country
  fetchTargetData()
}

function selectCountry() {
  const match = countries.find(
    (c) => c.nameDe.toLowerCase() === customTarget.value.toLowerCase() ||
           c.nameEn.toLowerCase() === customTarget.value.toLowerCase()
  )
  if (!match) return
  customTarget.value = ''
  cleanup()
  target.value = match as Country
  fetchTargetData()
}

function shareCountry() {
  const url = new URL(window.location.href)
  url.searchParams.set('country', target.value.nameEn)
  navigator.clipboard.writeText(url.toString())
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function cleanup() {
  if (marker) { map?.removeLayer(marker); marker = null }
  if (targetMarker) { map?.removeLayer(targetMarker); targetMarker = null }
  if (line) { map?.removeLayer(line); line = null }
  hasMarker.value = false
  evaluated.value = false
  distanceText.value = ''
}
</script>

<style scoped>
.geo-page {
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 60px);
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 10px;
  text-align: center;
  box-sizing: border-box;
}

.target-name {
  color: rgb(188, 0, 0);
  font-size: clamp(20px, 6vw, 28px);
  margin: 16px 0 4px;
}

.hint-text {
  color: #ccc;
  font-size: 16px;
  padding: 4px 0 8px;
}

.map-container {
  flex: 1;
  width: 100%;
  border: 2px solid rgb(188, 0, 0);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  min-height: 200px;
}

.map-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #ccc;
  font-size: 20px;
  z-index: 1000;
}

.eval-overlay {
  text-align: center;
  padding: 6px 0 2px;
}

.eval-overlay.distance-text {
  color: #ff9800;
  font-size: 18px;
}

.eval-row {
  flex-shrink: 0;
  padding: 8px 0 4px;
  text-align: center;
}

.skip-bar {
  flex-shrink: 0;
  padding: 8px 0 12px;
  text-align: center;
}

.action-btn {
  padding: 10px 30px;
  font-size: clamp(14px, 4vw, 18px);
  background: rgb(188, 0, 0);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.action-btn:hover {
  background: rgb(155, 0, 0);
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 10px 4px;
  flex-wrap: wrap;
}

.country-input {
  padding: 8px 14px;
  font-size: 16px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #1a1a1a;
  color: #fff;
  width: min(240px, 100%);
  max-width: 100%;
  outline: none;
  box-sizing: border-box;
}

@media (max-width: 500px) {
  .country-input {
    width: 100%;
  }
  .ok-btn, .share-btn {
    font-size: 13px;
    padding: 8px 12px;
  }
.mode-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 10px 0;
}

.mode-btn {
  padding: 6px 18px;
  font-size: 14px;
  font-family: inherit;
  background: transparent;
  color: #999;
  border: 1px solid #555;
  border-radius: 6px;
  cursor: pointer;
  transition: all .15s;
}

.mode-btn.active {
  background: rgb(188, 0, 0);
  color: #fff;
  border-color: rgb(188, 0, 0);
}

.mode-btn:hover {
  color: #fff;
  border-color: #888;
}

.streak-display {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 16px;
  font-size: 14px;
}

.streak-fire {
  font-size: 16px;
  line-height: 1;
}

.streak-num {
  font-weight: 700;
  color: #ff9800;
  font-size: 18px;
}

.streak-label {
  color: #999;
  font-size: 12px;
}

.target-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 10px 0 4px;
}

.flag-img {
  width: 80px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,.4);
}

.top-bar {
    gap: 6px;
  }
}

.country-input:focus {
  border-color: rgb(188, 0, 0);
}

.skip-btn {
  padding: 8px 18px;
  font-size: 14px;
  background: transparent;
  color: #999;
  border: 1px solid #555;
  border-radius: 6px;
  cursor: pointer;
}

.skip-btn:hover {
  color: #fff;
  border-color: #888;
}

.ok-btn {
  padding: 8px 14px;
  font-size: 14px;
  background: rgb(188, 0, 0);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.ok-btn:hover {
  background: rgb(155, 0, 0);
}

.share-btn {
  padding: 8px 14px;
  font-size: 14px;
  background: transparent;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 6px;
  cursor: pointer;
}

.share-btn:hover {
  color: #fff;
  border-color: #888;
}

.copied-msg {
  color: #4caf50;
  font-size: 14px;
  white-space: nowrap;
}
</style>

<style>
body:has(.geo-page) {
  background: #000 url('/background.png') center/cover no-repeat fixed;
  min-height: 100vh;
}

.leaflet-control-attribution {
  display: none !important;
}

.geo-tooltip {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  color: #fff !important;
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 0 6px #000, 0 0 3px #000;
  padding: 0 4px !important;
}

.geo-tooltip::before {
  display: none !important;
}
</style>
