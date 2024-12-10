<script setup>
import { ref, onMounted } from 'vue';

const formula = ref('');
const formulas = ref([]);
const results = ref({});
const showInfo = ref(false);

// Fetch existing formulas
async function fetchFormulas() {
  const { data } = await useFetch('api/formulas');
  formulas.value = data.value || [];
}

// Add a new formula
async function addFormula() {
  if (!formula.value) return;

  const { data, error } = await useFetch('api/formulas', {
    method: 'POST',
    body: { formula: formula.value },
  });

  if (!error.value) {
    formulas.value.push(data.value);
    formula.value = '';
  }
}

// Delete a formula by shardKey
async function deleteFormula(shardKey) {
  await useFetch('api/formulas', {
    method: 'DELETE',
    body: { shardKey },
  });

  formulas.value = formulas.value.filter(f => f.shardKey !== shardKey);
}

// Execute a formula
async function executeFormula(formulaObj) {
  const { data, error } = await useFetch('api/formulas', {
    method: 'POST',
    body: { formula: formulaObj.formula, execute: true },
  });

  if (!error.value) {
    results.value[formulaObj.shardKey] = data.value.result;
  } else {
    results.value[formulaObj.shardKey] = `Error: ${error.value.message}`;
  }
}

// Execute all formulas
async function executeAllFormulas() {
  for (const formulaObj of formulas.value) {
    await executeFormula(formulaObj);
  }
}

// Toggle formula help info
function toggleInfo() {
  showInfo.value = !showInfo.value;
}

// Fetch formulas on mounted
onMounted(fetchFormulas);
</script>

<template>
  <div class="container mx-auto p-6 pb-20">
    <h2 class="text-3xl">Traffic Data Formulas</h2>

        <!-- Info Button -->
        <button @click="toggleInfo" class="bg-yellow-400 text-white px-4 py-2 mt-2">ℹ️ Info</button>

<!-- Info Modal -->
<div v-if="showInfo" class="bg-gray-100 p-4 mt-4 border rounded">
  <h3 class="text-xl">How to Write a Formula</h3>
  <p>Use the following methods and functions in your formulas:</p>
  <ul>
    <li>
      <code>map.getSpeed(roadId)</code>:
      <br />
      Returns an array of average speeds for the specified road.
      <br />
      <strong>Example:</strong> <code>avg(map.getSpeed('R1'))</code>
    </li>
    <li>
      <code>map.getAccidents(roadId)</code>:
      <br />
      Returns an array of accident counts for the specified road.
      <br />
      <strong>Example:</strong> <code>sum(map.getAccidents('R2'))</code>
    </li>
    <li>
      <code>anpr.getVehicleCount(criteria)</code>:
      <br />
      Returns the count of vehicles matching the criteria.
      <br />
      <strong>Example:</strong>
      <code>anpr.getVehicleCount(data => data.vehicleType === 'Car')</code>
    </li>
    <li>
      <code>anpr.getAverageSpeed(criteria)</code>:
      <br />
      Returns an array of speeds for vehicles matching the criteria.
      <br />
      <strong>Example:</strong>
      <code>avg(anpr.getAverageSpeed(data => data.speed > 50))</code>
    </li>
    <li>
      <code>avg(array)</code>: Calculates the average of an array of numbers.
    </li>
    <li>
      <code>sum(array)</code>: Calculates the sum of an array of numbers.
    </li>
    <li>
      <code>count(array)</code>: Returns the number of elements in an array.
    </li>
  </ul>
  <p>You can combine these functions to create complex formulas.</p>
</div>


    <textarea
      v-model="formula"
      rows="3"
      class="w-full p-2 mt-4 border rounded"
      placeholder="Enter your formula here..."
    ></textarea>
    <button @click="addFormula" class="bg-blue-500 text-white px-4 py-2 mt-4">
      Add Formula
    </button>

    <div class="mt-6">
      <h3 class="text-2xl">Your Formulas</h3>
      <div class="flex">
      <button @click="executeAllFormulas" class="bg-green-500 text-white px-4 py-2 mt-4">
        Execute All
      </button>
      <button @click="fetchFormulas" class="bg-blue-500 text-white px-4 py-2 mt-4 ml-4">
        Refresh
      </button>
    </div>
    <ul>
        <li v-for="formulaObj in formulas" :key="formulaObj.shardKey" class="mt-4 bg-gray-100 p-4 border rounded">
          <p class="font-mono">{{ formulaObj.formula }}</p>
          <div class="flex gap-4">
            <button @click="executeFormula(formulaObj)" class="bg-blue-500 text-white px-2 py-1">Execute</button>
            <button @click="deleteFormula(formulaObj.shardKey)" class="bg-red-500 text-white px-2 py-1">Delete</button>
          </div>
          <div v-if="results[formulaObj.shardKey]" class="mt-2">
            <strong>Result:</strong> {{ results[formulaObj.shardKey] }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>