<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { bibleVerseArray, bibleHelper } from '../composables/bible-entry';


const bva = bibleVerseArray();
const bh = bibleHelper();

const displaySearchInput = ref(false);
const searchQuery = ref(null);

function searchHandler(){
  console.log(searchQuery.value);
};

// Function to load more verses when user scrolls
const loadMoreVerses = () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (scrollPosition + windowHeight >= documentHeight - 200) {
    for (let i = 0; i < 4; i++) {
      bva.addNewVerse();
    }
  }
};

// Attach scroll event listener
onMounted(() => {
  // Calculate the maximum number of verses to fill the screen
  const maxVerses = Math.floor(window.innerHeight / 200); // each card is approximately 200px

  // Generate additional verses
  for (let i = bva.verses.value.length; i < maxVerses; i++) {
    bva.addNewVerse();
  }
  window.addEventListener('scroll', loadMoreVerses);
});

onUnmounted(()=>{
  window.removeEventListener('scroll', loadMoreVerses);
});

</script>

<template>

  
<div class="px-2 py-3 sticky-top d-flex flex-row gap-2 justify-content-between bg-white">

  <button v-if="!displaySearchInput" @click="displaySearchInput = true" type="button" class="btn btn-outline-dark btn-circle shadow-sm" name="Search">
    <svg width="24" height="24" fill="currentColor">
      <use href="/src/assets/bootstrap-icons.svg#search"/>
    </svg>
  </button>

  <button v-if="displaySearchInput" @click="displaySearchInput = false" type="button" class="btn btn-dark btn-circle shadow-sm" name="Close Search">
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

