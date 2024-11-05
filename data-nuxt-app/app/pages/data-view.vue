<!-- app/pages/data-view.vue -->
<script setup>
import { ref } from 'vue';

const loading = ref(false);
const allData = ref({ anpr: [], map: [] });

async function fetchAllData() {
  loading.value = true;
  const { data, error } = await useFetch('api/allData');
  if (!error.value) {
    allData.value = data.value;
  }
  loading.value = false;
}

fetchAllData();
</script>

<template>
  <div class="container mx-auto p-6">
    <h2 class="text-3xl">All Traffic Data</h2>
    <button @click="fetchAllData" class="bg-blue-500 text-white px-4 py-2 mt-4">Refresh Data</button>

    <div v-if="loading" class="mt-4">Loading...</div>

    <div v-if="!loading">
      <!-- ANPR Data Table -->
      <h3 class="text-2xl mt-4">ANPR Data</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 px-4 border">License Plate</th>
              <th class="py-2 px-4 border">Timestamp</th>
              <th class="py-2 px-4 border">Vehicle Type</th>
              <th class="py-2 px-4 border">Speed</th>
              <th class="py-2 px-4 border">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in allData.anpr" :key="index">
              <td class="py-2 px-4 border">{{ item.licensePlate }}</td>
              <td class="py-2 px-4 border">{{ item.timestamp }}</td>
              <td class="py-2 px-4 border">{{ item.vehicleType }}</td>
              <td class="py-2 px-4 border">{{ item.speed }}</td>
              <td class="py-2 px-4 border">{{ item.location }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Map Data Table -->
      <h3 class="text-2xl mt-8">Map Data</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 px-4 border">Road ID</th>
              <th class="py-2 px-4 border">Road Name</th>
              <th class="py-2 px-4 border">Vehicle Density</th>
              <th class="py-2 px-4 border">Avg Speed</th>
              <th class="py-2 px-4 border">Congestion Level</th>
              <th class="py-2 px-4 border">Accidents Reported</th>
              <th class="py-2 px-4 border">Weather Condition</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in allData.map" :key="index">
              <td class="py-2 px-4 border">{{ item.roadId }}</td>
              <td class="py-2 px-4 border">{{ item.roadName }}</td>
              <td class="py-2 px-4 border">{{ item.vehicleDensity }}</td>
              <td class="py-2 px-4 border">{{ item.avgSpeed }}</td>
              <td class="py-2 px-4 border">{{ item.congestionLevel }}</td>
              <td class="py-2 px-4 border">{{ item.accidentsReported }}</td>
              <td class="py-2 px-4 border">{{ item.weatherCondition }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
