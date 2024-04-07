<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { bibleVerseArray, bibleHelper } from '../composables/bible-entry';

const bva = bibleVerseArray();
const bh = bibleHelper();
var mode = 0; // 0 : randomnly generate verses; 1 : generate verses that follow search params

const displaySearchInput = ref(false);
const searchQuery = ref(null);

function searchHandler(){
  if (searchQuery.value !== null && searchQuery.value.trim() !== "") {
    mode = 1;
    bva.resetVerses();
    getVerses();
  } else { 
    mode = 0;
    bva.resetVerses();
    getVerses();
  };
};

function searchButtonHandler(display){
  if (mode === 1 && searchQuery.value !== null && display === false) {
    searchQuery.value = null;
    searchHandler();
  };
  displaySearchInput.value = display;
};

// Function to load more verses when user scrolls
const loadMoreVerses = () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (mode === 0 && scrollPosition + windowHeight >= documentHeight - 200) {
    for (let i = 0; i < 4; i++) {
      bva.addNewVerse();
    }
  }
  else  if (mode === 1 && scrollPosition + windowHeight >= documentHeight - 200) {
    for (let i = 0; i < 4; i++) {
      bva.addNewVersesWithSearchQuery(searchQuery.value);
    }
  }
};
function getVerses(){
  // Calculate the maximum number of verses to fill the screen
  const maxVerses = Math.floor(window.innerHeight / 200); // each card is approximately 200px

  for (let i = bva.verses.value.length; i < maxVerses; i++) {
    if (mode === 0) {bva.addNewVerse(); }
    else if (mode === 1) { bva.addNewVersesWithSearchQuery(searchQuery.value); }
  }
}
onMounted(() => {
  getVerses();
  window.addEventListener('scroll', loadMoreVerses);
});

onUnmounted(()=>{
  window.removeEventListener('scroll', loadMoreVerses);
});

</script>

<template>

  
<div class="px-2 py-3 sticky-top d-flex flex-row gap-2 justify-content-between bg-white">

  <button v-if="!displaySearchInput" @click="searchButtonHandler(true)" type="button" class="btn btn-outline-dark btn-circle shadow-sm" name="Search">
    <svg width="24" height="24" fill="currentColor">
      <use href="/src/assets/bootstrap-icons.svg#search"/>
    </svg>
  </button>

  <button v-if="displaySearchInput" @click="searchButtonHandler(false)" type="button" class="btn btn-dark btn-circle shadow-sm" name="Close Search">
    <svg width="24" height="24" fill="currentColor">
      <use href="/src/assets/bootstrap-icons.svg#x-lg"/>
    </svg>
  </button>

  <input v-if="displaySearchInput" @input="searchHandler" v-model="searchQuery" type="text" class="form-control shadow-sm" placeholder="Search" aria-label="Search" name="Search input">

  <button type="button" class="btn btn-outline-secondary btn-circle shadow-sm" name="Menu">
    <svg width="24" height="24" fill="currentColor">
      <use href="/src/assets/bootstrap-icons.svg#three-dots-vertical"/>
    </svg>
  </button>

</div>


  <div class="container d-flex flex-column gap-5">

    <div v-for="verse in bva.verses.value" class="card shadow-sm mx-2">
      <div class="card-body">
        <blockquote class="blockquote mb-0">
          <p>{{ verse.Text ? verse.Text : 'Something went wrong :(' }}</p>
          <footer class="blockquote-footer mt-4">
            {{ bh.getBookName(verse.Book) }}
            <cite title="Source Title">{{verse.Chapter ? verse.Chapter : 'Unknown'}} : {{ verse.Verse ? verse.Verse : 'Unknown' }}</cite>
          </footer>
        </blockquote>
      </div>
    </div>

  </div>



</template>

<style scoped>
.card-body {
  min-height: 200px;
}
.btn-circle {
  border-radius: 100%;
  min-width: 45px;
  max-width: 45px;
  min-height: 45px;
  max-height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: unset;
}
</style>

