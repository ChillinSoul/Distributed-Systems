<!-- app/pages/formulas.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const formula = ref('');
const formulas = ref([]);
const results = ref({});
const loading = ref(false);
const showInfo = ref(false);
const editingFormulaId = ref(null);
const editingFormulaContent = ref('');

// Fetch existing formulas
async function fetchFormulas() {
  const { data } = await useFetch('/api/formulas');
  formulas.value = data.value || [];
}

// Add a new formula
async function addFormula() {
  if (!formula.value) return;

  const { data, error } = await useFetch('/api/formulas', {
    method: 'POST',
    body: { formula: formula.value }
  });

  if (!error.value) {
    formulas.value.push(data.value.formula);
    formula.value = '';
  }
}

// Delete a formula
async function deleteFormula(id) {
  await useFetch(`/api/formulas/${id}`, {
    method: 'DELETE',
  });

  formulas.value = formulas.value.filter(f => f.id !== id);
}

// Execute a formula
async function executeFormula(formulaObj) {
  const { data, error } = await useFetch('/api/executeFormula', {
    method: 'POST',
    body: { formula: formulaObj.formula }
  });
  if (!error.value) {
    results.value[formulaObj.id] = data.value.result;
  } else {
    results.value[formulaObj.id] = `Error: ${error.value.message}`;
  }
}

// Execute all formulas
async function executeAllFormulas() {
  for (const formulaObj of formulas.value) {
    await executeFormula(formulaObj);
  }
}

// Edit a formula
function editFormula(formulaObj) {
  editingFormulaId.value = formulaObj.id;
  editingFormulaContent.value = formulaObj.formula;
}

// Save edited formula
async function saveEditedFormula() {
  if (!editingFormulaContent.value) return;

  const { data, error } = await useFetch(`/api/formulas/${editingFormulaId.value}`, {
    method: 'PUT',
    body: { formula: editingFormulaContent.value }
  });

  if (!error.value) {
    const index = formulas.value.findIndex(f => f.id === editingFormulaId.value);
    if (index !== -1) {
      formulas.value[index] = data.value.formula;
    }
    editingFormulaId.value = null;
    editingFormulaContent.value = '';
  }
}

// Cancel editing
function cancelEditing() {
  editingFormulaId.value = null;
  editingFormulaContent.value = '';
}

// On mounted, fetch formulas
onMounted(fetchFormulas);

// Toggle formula help info
function toggleInfo() {
  showInfo.value = !showInfo.value;
}

// Refresh data (refetch formulas and execute them)
async function refreshData() {
  await fetchFormulas();
  await executeAllFormulas();
}
</script>

<template>
  <div class="container mx-auto p-6">
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


    <!-- Formula Input -->
    <textarea v-model="formula" rows="3" class="w-full p-2 mt-4 border rounded" placeholder="Enter your formula here..."></textarea>
    <button @click="addFormula" class="bg-blue-500 text-white px-4 py-2 mt-4">Add Formula</button>

    <!-- Formulas List -->
    <div class="mt-6">
      <h3 class="text-2xl">Your Formulas</h3>
      <button @click="refreshData" class="bg-green-500 text-white px-4 py-2 mt-4">Refresh and Execute All</button>
      <ul>
        <li v-for="formulaObj in formulas" :key="formulaObj.id" class="mt-4 bg-gray-100 p-4 border rounded">
          <div class="flex justify-between items-center">
            <div v-if="editingFormulaId !== formulaObj.id">
              <p class="font-mono">{{ formulaObj.formula }}</p>
            </div>
            <div v-else>
              <textarea v-model="editingFormulaContent" rows="2" class="w-full p-2 border rounded"></textarea>
            </div>
            <div class="flex gap-2">
              <button v-if="editingFormulaId !== formulaObj.id" @click="editFormula(formulaObj)" class="bg-yellow-500 text-white px-2 py-1">Edit</button>
              <button v-else @click="saveEditedFormula" class="bg-blue-500 text-white px-2 py-1">Save</button>
              <button v-if="editingFormulaId === formulaObj.id" @click="cancelEditing" class="bg-gray-500 text-white px-2 py-1">Cancel</button>
              <button @click="deleteFormula(formulaObj.id)" class="bg-red-500 text-white px-2 py-1">Delete</button>
            </div>
          </div>
          <button @click="executeFormula(formulaObj)" class="bg-blue-500 text-white px-2 py-1 mt-2">Run Formula</button>
          <div v-if="results[formulaObj.id]" class="mt-2">
            <strong>Result:</strong> {{ results[formulaObj.id] }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
