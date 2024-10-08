<script lang="ts" setup>
const props = defineProps({
  endpoint: {
    type: String,
    required: true
  }
})

// Use the endpoint prop directly
const { data, pending, error } = await useFetch(props.endpoint)
</script>

<template>
  <div class="container bg-gray-700 text-white">
    <h2 class="text-2xl">API Test</h2>

    <p>Endpoint: {{ endpoint }}</p>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <p>Data: {{ data }}</p>
    </div>
  </div>
</template>