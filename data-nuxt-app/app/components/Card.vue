<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
}>();
</script>


<template>
    <div 
    class = "container bg-gray-700 text-white " 
    ref="target" >
        <h2 class="text-2xl ">{{ title }}</h2>
        <div class="">
            <p>{{ description }}</p>
        </div>
        
    </div>
</template>