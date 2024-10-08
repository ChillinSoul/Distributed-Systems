<script lang="ts" setup>
useHead({
  title: 'Manneken Data',
  meta: [
    {
      name: 'description',
      content: 'Manneken Data is a data science tool'
    }
  ],
})
</script>

<template>
    <div>
        <Navbar/> 
        <slot/>
        <Footer/>
    </div>
</template>

