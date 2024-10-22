<script setup>
const anprEndpoint = '/api/anpr';
const mapEndpoint = '/api/map';

// Fetch data from both ANPR and Map endpoints
const { data: anprData, refresh: refreshAnpr } = await useFetch(anprEndpoint);
const { data: mapData, refresh: refreshMap } = await useFetch(mapEndpoint);

// Refresh data every time the user clicks
function refreshData() {
  refreshAnpr();
  refreshMap();
}
</script>

<template>
  <div class="container bg-gray-700 text-white">
    <h2 class="text-3xl">Traffic Data Visualization</h2>

    <button @click="refreshData" class="bg-blue-500 text-white px-4 py-2">Refresh Data</button>

    <div class="mt-4">
      <h3 class="text-2xl">ANPR Data</h3>
      <pre>{{ anprData }}</pre>
    </div>

    <div class="mt-4">
      <h3 class="text-2xl">Map Data</h3>
      <pre>{{ mapData }}</pre>
    </div>
  </div>
</template>
