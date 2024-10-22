<script setup lang="ts">

import { ref, computed} from 'vue'
import { useMouseInElement } from '@vueuse/core';

const target = ref(null);

const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(target);

const cardTransform = computed(() => {
  const MAX_ROTATION = 6;
  const rX = (MAX_ROTATION/2 - (elementY.value / elementHeight.value) * MAX_ROTATION);
  const rY = (-(MAX_ROTATION/2 - (elementX.value / elementWidth.value) * MAX_ROTATION));
  return isOutside.value ? '' : `perspective(${elementWidth.value}) rotateX(${rX}deg) rotateY(${rY}deg)`;
});
</script>


<style scoped>
.hero {
  transform : v-bind(cardTransform);
  transition: transform 0.1s ease-in-out;
}
</style>



<template>
    <div class="h-[50vh] w-screen relative pt-16 hero " ref="target">
        <div class="absolute top-0 -z-10 w-full h-full  bg-gray-700">
            <div class="absolute bottom-auto left-auto right-0 top-0 h-1/2 w-1/2 -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(66,158,72,0.9)] opacity-50 blur-[80px]">
            </div>
        </div>
        <div class="flex flex-col items-center justify-center h-full text-white">
            <h1 class="text-4xl font-bold ">Manneken Data</h1>
            <p>A data science tool</p>
        </div>
    </div>
</template>

