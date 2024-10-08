<template>
    <div class="flex flex-col gap-4">
        <div class="border-2 p-4 border-transparent border-b-gray-700 ">
            <h2 class="text-2xl font-bold text-center">Tools</h2>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mx-4  h-full justify-between">
            <BuiltWithNuxt/>
            <Card title="A" description="this is a description"/>
            <Card title="B" description="this is a description"/>
            <APITest/>
        </div>
    </div>
</template>