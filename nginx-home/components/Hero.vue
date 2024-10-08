<template>
    <div class="h-screen w-screen relative pt-16">
        <div class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
        <div class="flex flex-col items-center justify-center h-full text-white">
            <h1 class="text-5xl font-bold ">Distributed systems</h1>
            <p> Master 2 Computer Science Project</p>
            <div class="m-4 flex flex-col justify-center gap-4 min-w-xl">
                <p>Manneken Data</p>
                <Nuxt-link to="/nuxt-app/" class="text-white bg-blue-500 px-4 py-2 rounded-md w-full">Manneken Data </Nuxt-link>
                <APITest endpoint="http://nuxt-app-service/api/hello/message"/>
                <p>BB-APP</p>
                <Nuxt-link to="/bb-app/" class="text-white bg-blue-500 px-4 py-2 rounded-md w-full">BB-APP </Nuxt-link>
                <p>hello-k8s</p>
                <APITest endpoint="http://hello-k8s-service/"/>
            </div>
        </div>
    </div>
</template>

