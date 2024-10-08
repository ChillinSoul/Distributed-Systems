<script lang="ts">
export default {
  name: 'Card',
  props: {
    title: String,
    description: String,
  },
}
</script>


<template>
    <div class = "container bg-gray-700 text-white ">
        <h2 class="text-2xl ">{{ title }}</h2>
        <div class="">
            <p>{{ description }}</p>
        </div>
        
    </div>
</template>