<script setup>
import { ref, onMounted } from 'vue';

const formula = ref('');
const result = ref(null);
const allData = ref([]);
const loading = ref(false);
const showInfo = ref(false);

// Fetch all data from backend
async function fetchAllData() {
  loading.value = true;

  // Fetch from the mock APIs to get fresh data
  await useFetch('./api/anpr');  // Fetch ANPR data
  await useFetch('./api/map');   // Fetch Map data

  const { data } = await useFetch('./api/allData');  // Fetch all data from database
  allData.value = data.value;
  loading.value = false;
}

// Run user formula
async function runFormula() {
  const { data, error } = await useFetch('/api/executeFormula', {
    method: 'POST',
    body: { formula: formula.value }
  });
  if (!error.value) {
    result.value = data.value.result;
  }
}

// Refresh the list of all data by fetching from APIs
async function refreshData() {
  await fetchAllData();
}

// On mounted, fetch all data once
onMounted(fetchAllData);

// Toggle formula help info
function toggleInfo() {
  showInfo.value = !showInfo.value;
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h2 class="text-3xl">Traffic Data Formulas</h2>

    <!-- Info Button -->
    <button @click="toggleInfo" class="bg-yellow-400 text-white px-4 py-2 mt-2">ℹ️ Info</button>

    <!-- Info Modal -->
    <div v-if="showInfo" class="bg-gray-100 p-4 mt-4 border rounded">
      <h3 class="text-xl">How to Write a Formula</h3>
      <p>Use the following methods in your formula:</p>
      <ul>
        <li><code>map.getSpeed(roadId)</code>: Fetches the speed data for a road.</li>
        <li><code>map.getAccidents(roadId)</code>: Fetches the number of accidents on a road.</li>
        <li><code>anpr.getVehicleCount(criteria)</code>: Fetches the number of vehicles based on criteria.</li>
        <li><code>anpr.getAverageSpeed(criteria)</code>: Fetches the average speed of vehicles based on criteria.</li>
        <li><code>avg()</code>: Calculates the average of an array of numbers.</li>
        <li><code>sum()</code>: Calculates the sum of an array.</li>
        <li><code>count()</code>: Returns the count of elements in an array.</li>
      </ul>
      <p>Example Formula:</p>
      <pre><code>
// Total accidents and average speed of fast cars:
sum(map.getAccidents('R1')) + avg(anpr.getAverageSpeed(data => data.vehicleType === 'Car' && data.speed > 50))
      </code></pre>
    </div>

    <!-- Formula Input -->
    <textarea v-model="formula" rows="5" class="w-full p-2 mt-4 border rounded" placeholder="Enter your formula here..."></textarea>
    <button @click="runFormula" class="bg-blue-500 text-white px-4 py-2 mt-4">Run Formula</button>

    <!-- Formula Result -->
    <div v-if="result" class="mt-4 bg-gray-100 p-4 border rounded">
      <h3 class="text-xl">Formula Result:</h3>
      <p>{{ result }}</p>
    </div>

    <!-- Data display and refresh -->
    <div class="mt-6">
      <h3 class="text-2xl">All Traffic Data</h3>
      <button @click="refreshData" class="bg-green-500 text-white px-4 py-2 mt-4">Refresh Data</button>

      <div v-if="loading" class="mt-4">Loading...</div>
      <div v-if="!loading">
        <h4 class="text-xl mt-4">ANPR Data:</h4>
        <ul>
          <li v-for="(item, index) in allData.anpr" :key="index">{{ item }}</li>
        </ul>

        <h4 class="text-xl mt-4">Map Data:</h4>
        <ul>
          <li v-for="(item, index) in allData.map" :key="index">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
