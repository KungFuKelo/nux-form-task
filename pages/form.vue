<script setup>
import { SelectBox } from 'tedir-select'

let idSearchToken = ref()
let selectedMain = ref('')
let selectedSub = ref('')
let selectedOpt = ref([])
let optProps = ref([])
let userInput = ref([])
let selectedIndex = ref(null)
let selectedSubIndex = ref(null)
let resMain = ref([])
let mainCats = ref([])
let subCats = ref([])
let subCatsIds = ref([])
let resProps = ref([])
let namesProps = ref([])
let isSubmit = ref(false)


// get all cats from api
onMounted(async () => {
    const response = await fetch('https://staging.mazaady.com/api/get_all_cats');
    const data = await response.json();
    resMain.value = data;
    resMap()
});

// map on every cat to create array of cat names
function resMap() {
    for (let i = 0; i < resMain.value.data.categories.length; i++) {
        mainCats.value.push(resMain.value.data.categories[i].name)
    }
}

// set sub cats
function findSubs() {
    namesProps.value = []
    selectedIndex.value = mainCats.value.indexOf(`${selectedMain.value}`)
    if (selectedIndex.value >= 0) {
        subCats.value = []
        subCatsIds.value = []
        selectedSub.value = ''
        for (let i = 0; i < resMain.value.data.categories[selectedIndex.value].children.length; i++) {
            subCats.value.push(resMain.value.data.categories[selectedIndex.value].children[i].name)
            subCatsIds.value.push(resMain.value.data.categories[selectedIndex.value].children[i].id)
        }
    }
}

//sub cats properties 
async function findProps() {
    selectedOpt.value = []
    namesProps.value = []
    selectedSubIndex.value = subCats.value.indexOf(`${selectedSub.value}`)
    if (selectedSubIndex.value >= 0) {
        idSearchToken.value = subCatsIds.value[selectedSubIndex.value]
        const response = await fetch(`https://staging.mazaady.com/api/properties?cat=${idSearchToken.value}`);
        const datasub = await response.json();
        resProps.value = datasub
        resPropMap()
    }
}

// map on every prop to create array of prop names 
function resPropMap() {
    namesProps.value = []

    for (let i = 0; i < resProps.value.data.length; i++) {
        namesProps.value.push(resProps.value.data[i].name)
        optProps.value[i] = []
        if (resProps.value.data[i].options.length > 0) {
            optProps.value[i] = ["-- other --"]
            selectedOpt[i]
            userInput.value[i] = []
            userInput[i]
            for (let n = 0; n < resProps.value.data[i].options.length; n++) {
                optProps.value[i].push(resProps.value.data[i].options[n].name)
            }
        }
    }
}

// result table creation 
function resultTable() {
    if ((selectedMain.value !== '') && (selectedSub.value !== '')) {
        isSubmit.value = true
    }
}

useHead({
    title: "Form"
})


</script>


<template>
    <ClientOnly>
        <div class=" mb-20">
            <div class=" p-4 w-[40rem] m-auto mt-10">
                <p class="mb-4">Main category</p>
                <SelectBox @click="findSubs()" v-model="selectedMain" :options="mainCats" placeholder=" Please Select"
                    :size="5" />
            </div>
            <div class="p-4  w-[40rem] m-auto">
                <p class="mb-4">Sub category</p>
                <SelectBox @click="findProps()" v-model="selectedSub" :options="subCats" placeholder=" Please Select"
                    :size="5" />
            </div>
            <div class="p-4 w-[40rem] m-auto" v-for="prop, i in namesProps" :key="i">
                <p class="mb-3">{{ prop }}</p>
                <SelectBox v-if="optProps[i].length !== 0" v-model="selectedOpt[i]" :options="optProps[i]"
                    placeholder=" Please Select" :size="5" />
                <input v-model="userInput[i]" v-if="(selectedOpt[i] === '-- other --' || optProps[i].length === 0)"
                    type="text" class="p-2 mt-2 w-full border rounded" placeholder="Enter your value">
            </div>
            <div class="w-full flex justify-center mt-8 mb-10">
                <button @click="resultTable" class="bg-slate-600 border rounded-lg p-4 m-auto">Submit</button>
            </div>
        </div>
        <div v-if="isSubmit" class="mt-20 w-full flex justify-center ">
            <div class="w-[40rem] p-4">
                <h1 class=" text-xl mb-6 font-semibold"># selected values:</h1>
                <div class="p-4 border rounded-lg bg-slate-700/25 mt-4 flex justify-between items-center">
                    <p class="mb-0">Main Category:</p>
                    <p class="font-medium mb-0">{{ selectedMain }}</p>
                </div>
                <div class="p-6 border rounded-lg bg-slate-700/25 mt-4 flex justify-between items-center">
                    <p class="mb-0">Sub Category:</p>
                    <p class="font-medium mb-0">{{ selectedSub }}</p>
                </div>
                <div v-for="prop, i in namesProps" :key="i"
                    class="p-6 border rounded-lg bg-slate-700/25 mt-4 flex justify-between items-center">
                    <p class="mb-0">{{ prop }}: </p>
                    <p v-if="optProps[i].length !== 0" class="font-medium mb-0"> {{ selectedOpt[i] }}</p>
                    <p v-if="(selectedOpt[i] === '-- other --' || optProps[i].length === 0)" class="font-medium mb-0"> {{
                        userInput[i] }}</p>
                </div>
            </div>
        </div>
    </ClientOnly>
</template> 

<style>
@use picker;

@use form {
    field: input;
}

.active {
    background-color: #1f1f1f !important;
    border-color: #000000 !important;
}
</style> 