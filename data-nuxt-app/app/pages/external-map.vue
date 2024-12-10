<!-- app/pages/external-map.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const intersections = ref([]);
const roads = ref([]);
const shortestPath = ref(null);
const loading = ref(false);
const error = ref(null);

// Selected intersections for path finding
const startIntersection = ref(null);
const endIntersection = ref(null);

// Fetch map data
async function fetchMapData() {
  loading.value = true;
  try {
    const { data: mapData } = await useFetch('/api/external-map');
    intersections.value = mapData.value.intersections || [];
    roads.value = mapData.value.roads || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Calculate shortest path
async function calculatePath() {
  if (!startIntersection.value || !endIntersection.value) {
    error.value = 'Please select both start and end intersections';
    return;
  }

  loading.value = true;
  try {
    const { data } = await useFetch('/api/external-map/shortest-path', {
      query: {
        start: startIntersection.value,
        end: endIntersection.value
      }
    });
    shortestPath.value = data.value;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Initial fetch
onMounted(fetchMapData);
</script>

<template>
  <div class="container mx-auto p-6 mb-20">
    <h2 class="text-3xl mb-4">External Map Data Analysis</h2>
    
    <!-- Controls -->
    <div class="mb-6">
      <button @click="fetchMapData" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Refresh Data
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      Loading...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Intersections Table -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-xl mb-4">Intersections</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-4 py-2">ID</th>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Coordinates</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="intersection in intersections" :key="intersection.id">
                <td class="border px-4 py-2">{{ intersection.id }}</td>
                <td class="border px-4 py-2">{{ intersection.name }}</td>
                <td class="border px-4 py-2">({{ intersection.x_coordinate }}, {{ intersection.y_coordinate }})</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Roads Table -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-xl mb-4">Roads</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-4 py-2">ID</th>
                <th class="px-4 py-2">Start</th>
                <th class="px-4 py-2">End</th>
                <th class="px-4 py-2">Length</th>
                <th class="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="road in roads" :key="road.id">
                <td class="border px-4 py-2">{{ road.id }}</td>
                <td class="border px-4 py-2">{{ road.start_intersection }}</td>
                <td class="border px-4 py-2">{{ road.end_intersection }}</td>
                <td class="border px-4 py-2">{{ road.length }}</td>
                <td class="border px-4 py-2">
                  <span :class="road.useable ? 'text-green-600' : 'text-red-600'">
                    {{ road.useable ? 'Open' : 'Closed' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Path Finding -->
      <div class="bg-white p-4 rounded shadow md:col-span-2">
        <h3 class="text-xl mb-4">Find Shortest Path</h3>
        <div class="flex gap-4 mb-4">
          <select v-model="startIntersection" class="border rounded px-2 py-1">
            <option value="">Select Start Point</option>
            <option v-for="int in intersections" :key="int.id" :value="int.id">
              {{ int.name }}
            </option>
          </select>
          <select v-model="endIntersection" class="border rounded px-2 py-1">
            <option value="">Select End Point</option>
            <option v-for="int in intersections" :key="int.id" :value="int.id">
              {{ int.name }}
            </option>
          </select>
          <button 
            @click="calculatePath"
            class="bg-green-500 text-white px-4 py-2 rounded"
            :disabled="!startIntersection || !endIntersection"
          >
            Calculate Path
          </button>
        </div>
        
        <!-- Path Results -->
        <div v-if="shortestPath" class="mt-4">
          <h4 class="font-bold">Shortest Path:</h4>
          <div class="flex flex-wrap gap-2 mt-2">
            <span 
              v-for="(point, index) in shortestPath" 
              :key="index"
              class="bg-gray-100 px-2 py-1 rounded"
            >
              {{ point.name }}
              <span v-if="index < shortestPath.length - 1">→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>