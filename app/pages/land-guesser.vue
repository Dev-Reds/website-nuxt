<template>
  <div class="geo-page">
    <ClientOnly>
      <div v-if="mapReady" class="top-bar">
        <input v-model="customTarget" list="country-list" @keyup.enter="selectCountry" placeholder="Land eingeben..." class="country-input">
        <datalist id="country-list">
          <option v-for="c in countries" :key="c.nameDe" :value="c.nameDe"/>
        </datalist>
        <button @click="selectCountry" class="ok-btn">Übernehmen</button>
        <button @click="shareCountry" class="share-btn">Teilen</button>
        <span v-if="copied" class="copied-msg">Link kopiert!</span>
      </div>
      <div v-if="mapReady" class="target-name">{{ target.nameDe }}</div>
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

import { ref, onMounted } from 'vue'
import type { Map as LeafletMap, LeafletMouseEvent } from 'leaflet'

const route = useRoute()

interface Country {
  nameDe: string
  nameEn: string
}

const mapContainer = ref<HTMLDivElement>()
const mapReady = ref(false)
const hasMarker = ref(false)
const evaluated = ref(false)
const distanceText = ref('')
const customTarget = ref('')
const copied = ref(false)

let map: LeafletMap | null = null
let marker: any = null
let targetMarker: any = null
let line: any = null
let evaluating = false
let L: any

const countries: Country[] = [
  { nameDe: 'Ägypten', nameEn: 'Egypt' }, { nameDe: 'Äthiopien', nameEn: 'Ethiopia' },
  { nameDe: 'Afghanistan', nameEn: 'Afghanistan' }, { nameDe: 'Albanien', nameEn: 'Albania' },
  { nameDe: 'Algerien', nameEn: 'Algeria' }, { nameDe: 'Angola', nameEn: 'Angola' },
  { nameDe: 'Argentinien', nameEn: 'Argentina' }, { nameDe: 'Australien', nameEn: 'Australia' },
  { nameDe: 'Bangladesch', nameEn: 'Bangladesh' }, { nameDe: 'Belgien', nameEn: 'Belgium' },
  { nameDe: 'Bolivien', nameEn: 'Bolivia' }, { nameDe: 'Bosnien und Herzegowina', nameEn: 'Bosnia and Herzegovina' },
  { nameDe: 'Brasilien', nameEn: 'Brazil' }, { nameDe: 'Bulgarien', nameEn: 'Bulgaria' },
  { nameDe: 'Chile', nameEn: 'Chile' }, { nameDe: 'China', nameEn: 'China' },
  { nameDe: 'Costa Rica', nameEn: 'Costa Rica' }, { nameDe: 'Dänemark', nameEn: 'Denmark' },
  { nameDe: 'Deutschland', nameEn: 'Germany' }, { nameDe: 'Ecuador', nameEn: 'Ecuador' },
  { nameDe: 'El Salvador', nameEn: 'El Salvador' }, { nameDe: 'Elfenbeinküste', nameEn: 'Ivory Coast' },
  { nameDe: 'Estland', nameEn: 'Estonia' }, { nameDe: 'Finnland', nameEn: 'Finland' },
  { nameDe: 'Frankreich', nameEn: 'France' }, { nameDe: 'Ghana', nameEn: 'Ghana' },
  { nameDe: 'Griechenland', nameEn: 'Greece' }, { nameDe: 'Grönland', nameEn: 'Greenland' },
  { nameDe: 'Guatemala', nameEn: 'Guatemala' }, { nameDe: 'Honduras', nameEn: 'Honduras' },
  { nameDe: 'Indien', nameEn: 'India' }, { nameDe: 'Indonesien', nameEn: 'Indonesia' },
  { nameDe: 'Irak', nameEn: 'Iraq' }, { nameDe: 'Iran', nameEn: 'Iran' },
  { nameDe: 'Irland', nameEn: 'Ireland' }, { nameDe: 'Island', nameEn: 'Iceland' },
  { nameDe: 'Israel', nameEn: 'Israel' }, { nameDe: 'Italien', nameEn: 'Italy' },
  { nameDe: 'Jamaika', nameEn: 'Jamaica' }, { nameDe: 'Japan', nameEn: 'Japan' },
  { nameDe: 'Jemen', nameEn: 'Yemen' }, { nameDe: 'Jordanien', nameEn: 'Jordan' },
  { nameDe: 'Kambodscha', nameEn: 'Cambodia' }, { nameDe: 'Kamerun', nameEn: 'Cameroon' },
  { nameDe: 'Kanada', nameEn: 'Canada' }, { nameDe: 'Kasachstan', nameEn: 'Kazakhstan' },
  { nameDe: 'Katar', nameEn: 'Qatar' }, { nameDe: 'Kenia', nameEn: 'Kenya' },
  { nameDe: 'Kirgisistan', nameEn: 'Kyrgyzstan' }, { nameDe: 'Kolumbien', nameEn: 'Colombia' },
  { nameDe: 'Kosovo', nameEn: 'Kosovo' }, { nameDe: 'Kroatien', nameEn: 'Croatia' },
  { nameDe: 'Kuba', nameEn: 'Cuba' }, { nameDe: 'Laos', nameEn: 'Laos' },
  { nameDe: 'Lettland', nameEn: 'Latvia' }, { nameDe: 'Libanon', nameEn: 'Lebanon' },
  { nameDe: 'Libyen', nameEn: 'Libya' }, { nameDe: 'Litauen', nameEn: 'Lithuania' },
  { nameDe: 'Luxemburg', nameEn: 'Luxembourg' }, { nameDe: 'Madagaskar', nameEn: 'Madagascar' },
  { nameDe: 'Malaysia', nameEn: 'Malaysia' }, { nameDe: 'Marokko', nameEn: 'Morocco' },
  { nameDe: 'Mexiko', nameEn: 'Mexico' }, { nameDe: 'Mongolei', nameEn: 'Mongolia' },
  { nameDe: 'Montenegro', nameEn: 'Montenegro' }, { nameDe: 'Mosambik', nameEn: 'Mozambique' },
  { nameDe: 'Myanmar', nameEn: 'Myanmar' }, { nameDe: 'Namibia', nameEn: 'Namibia' },
  { nameDe: 'Nepal', nameEn: 'Nepal' }, { nameDe: 'Neuseeland', nameEn: 'New Zealand' },
  { nameDe: 'Nicaragua', nameEn: 'Nicaragua' }, { nameDe: 'Niederlande', nameEn: 'Netherlands' },
  { nameDe: 'Nigeria', nameEn: 'Nigeria' }, { nameDe: 'Norwegen', nameEn: 'Norway' },
  { nameDe: 'Österreich', nameEn: 'Austria' }, { nameDe: 'Oman', nameEn: 'Oman' },
  { nameDe: 'Pakistan', nameEn: 'Pakistan' }, { nameDe: 'Panama', nameEn: 'Panama' },
  { nameDe: 'Peru', nameEn: 'Peru' }, { nameDe: 'Philippinen', nameEn: 'Philippines' },
  { nameDe: 'Polen', nameEn: 'Poland' }, { nameDe: 'Portugal', nameEn: 'Portugal' },
  { nameDe: 'Rumänien', nameEn: 'Romania' }, { nameDe: 'Ruanda', nameEn: 'Rwanda' },
  { nameDe: 'Russland', nameEn: 'Russia' }, { nameDe: 'Sambia', nameEn: 'Zambia' },
  { nameDe: 'Saudi-Arabien', nameEn: 'Saudi Arabia' }, { nameDe: 'Schweden', nameEn: 'Sweden' },
  { nameDe: 'Schweiz', nameEn: 'Switzerland' }, { nameDe: 'Senegal', nameEn: 'Senegal' },
  { nameDe: 'Serbien', nameEn: 'Serbia' }, { nameDe: 'Simbabwe', nameEn: 'Zimbabwe' },
  { nameDe: 'Singapur', nameEn: 'Singapore' }, { nameDe: 'Slowakei', nameEn: 'Slovakia' },
  { nameDe: 'Slowenien', nameEn: 'Slovenia' }, { nameDe: 'Somalia', nameEn: 'Somalia' },
  { nameDe: 'Spanien', nameEn: 'Spain' }, { nameDe: 'Sri Lanka', nameEn: 'Sri Lanka' },
  { nameDe: 'Sudan', nameEn: 'Sudan' }, { nameDe: 'Südafrika', nameEn: 'South Africa' },
  { nameDe: 'Südkorea', nameEn: 'South Korea' }, { nameDe: 'Syrien', nameEn: 'Syria' },
  { nameDe: 'Tansania', nameEn: 'Tanzania' }, { nameDe: 'Thailand', nameEn: 'Thailand' },
  { nameDe: 'Tschechien', nameEn: 'Czech Republic' }, { nameDe: 'Tunesien', nameEn: 'Tunisia' },
  { nameDe: 'Türkei', nameEn: 'Turkey' }, { nameDe: 'Uganda', nameEn: 'Uganda' },
  { nameDe: 'Ukraine', nameEn: 'Ukraine' }, { nameDe: 'Ungarn', nameEn: 'Hungary' },
  { nameDe: 'Uruguay', nameEn: 'Uruguay' }, { nameDe: 'Usbekistan', nameEn: 'Uzbekistan' },
  { nameDe: 'Venezuela', nameEn: 'Venezuela' }, { nameDe: 'Vietnam', nameEn: 'Vietnam' },
  { nameDe: 'Vereinigte Arabische Emirate', nameEn: 'United Arab Emirates' },
  { nameDe: 'Vereinigte Staaten', nameEn: 'United States' },
  { nameDe: 'Vereinigtes Königreich', nameEn: 'United Kingdom' },
  { nameDe: 'Weißrussland', nameEn: 'Belarus' },
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
  }).addTo(map)
  map.on('click', onMapClick)
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

const target = ref<Country>(countries[Math.floor(Math.random() * countries.length)])
let targetGeoCache: any = null
let targetCacheLat = 0
let targetCacheLng = 0

const TARGET_CACHE: Record<string, any> = {}

async function fetchTargetData() {
  const en = target.value.nameEn
  if (TARGET_CACHE[en]) { targetGeoCache = TARGET_CACHE[en]; targetCacheLat = targetGeoCache.lat; targetCacheLng = targetGeoCache.lon; return }
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(en)}&limit=1&polygon_geojson=1`,
      { headers: { 'User-Agent': 'GeoReferat/1.0' } }
    )
    const data = await res.json()
    if (data[0]) {
      targetGeoCache = data[0]
      targetCacheLat = parseFloat(data[0].lat)
      targetCacheLng = parseFloat(data[0].lon)
      TARGET_CACHE[en] = data[0]
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
  font-size: 28px;
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
  font-size: 18px;
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
