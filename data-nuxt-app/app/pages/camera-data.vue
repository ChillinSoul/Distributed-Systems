<!-- app/pages/camera-data.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(false);
const videos = ref([]);
const error = ref(null);

// Fetch camera data
async function fetchVideos() {
  loading.value = true;
  try {
    const { data } = await useFetch('/api/videos');
    videos.value = data.value || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Function to format date
function formatDate(date) {
  return new Date(date).toLocaleString();
}

// Initial fetch
onMounted(fetchVideos);
</script>

<template>
  <div class="container mx-auto p-6 mb-20">
    <h2 class="text-3xl mb-4">Camera Data Analysis</h2>
    <div class="mb-4">
      <button @click="fetchVideos" class="bg-blue-500 text-white px-4 py-2 rounded">
        Refresh Data
      </button>
    </div>

    <div v-if="loading" class="text-center py-4">
      Loading...
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left">Camera</th>
              <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left">License Plate</th>
              <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left">Vehicle Type</th>
              <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="video in videos" :key="video.id" class="hover:bg-gray-100">
              <td class="px-6 py-4 border-b border-gray-200">{{ video.cameranumber }}</td>
              <td class="px-6 py-4 border-b border-gray-200">{{ video.numberplate }}</td>
              <td class="px-6 py-4 border-b border-gray-200">{{ video.typevehicule }}</td>
              <td class="px-6 py-4 border-b border-gray-200">{{ formatDate(video.createat) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>