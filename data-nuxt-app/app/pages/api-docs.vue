<script setup>
import { onMounted } from 'vue';
import SwaggerUI from 'swagger-ui-dist/swagger-ui-es-bundle';
import 'swagger-ui-dist/swagger-ui.css';

onMounted(() => {
  SwaggerUI({
    dom_id: '#swagger-ui',
    url: 'openapi.yaml', // Updated path
  });
});
</script>

<template>
  <div class="container mx-auto p-6">
    <h2 class="text-3xl mb-4">API Documentation</h2>
    <div id="swagger-ui"></div>
  </div>
</template>

<style scoped>
/* Optional: Customize Swagger UI styles */
.swagger-ui .topbar {
  display: none;
}
</style>
