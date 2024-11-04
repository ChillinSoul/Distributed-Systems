<template>
    <header>
      <nav class="flex fixed w-full justify-between p-4 text-white bg-black border-b z-50">
        <div class="relative w-full flex">
          <h2 class="text-2xl absolute w-full text-center pointer-events-none">Manneken Data</h2>
          <ul class="flex gap-4">
            <li>
              <NuxtLink to="/">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about">About</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/formulas">Formulas</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/traffic-data">Traffic Data</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/data-view">Data View</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/api-docs">API Docs</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  </template>
  