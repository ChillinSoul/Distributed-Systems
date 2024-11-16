<template>
  <div class="h-screen w-screen relative pt-16">
    <div
      class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"
    ></div>
    <div class="flex flex-col items-center justify-center h-full text-white">
      <h1 class="text-5xl font-bold">Distributed systems</h1>
      <p>Master 2 Computer Science Project</p>
      <div class="m-4 flex flex-col justify-center gap-4 min-w-xl">
        <p>Manneken Data</p>
        <a
        href="/data-nuxt-app/"
          class="text-white bg-blue-500 px-4 py-2 rounded-md w-full"
          >Manneken Data
      </a>
      <APITest endpoint="http://data-nuxt-app-service.default.svc.cluster.local/data-nuxt-app/api/mock" />
        <p>camera-app</p>
        <a
        href="/camera-app/"
          class="text-white bg-blue-500 px-4 py-2 rounded-md w-full"
          >camera-app
    </a>
        <APITest endpoint="http://camera-app-service/api/cameras" />
        <p>map-app</p>
        <a
        href="/map-app/"
          class="text-white bg-blue-500 px-4 py-2 rounded-md w-full"
          >map-app
  </a>
        <!-- <APITest endpoint="http://map-app-service/"/> -->
        <p>bb-demo</p>
        <a
          href="/bb-demo/"
          class="text-white bg-blue-500 px-4 py-2 rounded-md w-full"
          >bb-demo
</a>
      </div>
    </div>
  </div>
</template>
