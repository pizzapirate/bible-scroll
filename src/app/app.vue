<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { bibleVerseArray, bibleHelper, expandVerse } from '../composables/bible-entry';

const bva = bibleVerseArray();
const bh = bibleHelper();
const ev = expandVerse();
var mode = 0; // 0 : randomnly generate verses; 1 : generate verses that follow search params

const displayExpandedVerse = ref(false);
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

function searchButtonHandler(){
  displaySearchInput.value = true;
};
function closeButtonHandler() {
  if (displayExpandedVerse.value) {displayExpandedVerse.value = false}
  else if (mode === 1 && searchQuery.value !== null) {
    searchQuery.value = null;
    searchHandler();
  };
  displaySearchInput.value = false;
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

function expandVerseHandler(verse){
  console.log(verse);
  ev.initVerse(verse);
  displayExpandedVerse.value = true;
};

onMounted(() => {
  getVerses();
  window.addEventListener('scroll', loadMoreVerses);
});

onUnmounted(()=>{
  window.removeEventListener('scroll', loadMoreVerses);
});

</script>

<template>

  <div class="px-2 py-3 sticky-top d-flex flex-row gap-2 justify-content-between bg-white ">

    <button v-if="!displaySearchInput && !displayExpandedVerse" @click="searchButtonHandler()" type="button" class="btn btn-outline-dark btn-circle shadow-sm" name="Search">
      <svg width="24" height="24" fill="currentColor">
        <use href="/src/assets/bootstrap-icons.svg#search"/>
      </svg>
    </button>

    <button v-if="displaySearchInput || displayExpandedVerse" @click="closeButtonHandler()" type="button" class="btn btn-dark btn-circle shadow-sm" name="Close Search">
      <svg width="24" height="24" fill="currentColor">
        <use href="/src/assets/bootstrap-icons.svg#x-lg"/>
      </svg>
    </button>

    <input v-if="displaySearchInput" @input="searchHandler" v-model="searchQuery" type="text" class="form-control shadow-sm" placeholder="Search" aria-label="Search" name="Search input">

    <button type="button" class="btn btn-outline-secondary btn-circle shadow-sm" name="Menu" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">
      <svg width="24" height="24" fill="currentColor">
        <use href="/src/assets/bootstrap-icons.svg#three-dots-vertical"/>
      </svg>
    </button>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menu</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <p>About</p>
        <p>Home</p>
        <p>Donate</p>
      </div>
    </div>

  </div>

  <div class="container d-flex flex-column gap-5 position-relative">

    <div v-for="verse in bva.verses.value" class="card shadow-sm mx-2" @click="expandVerseHandler(verse)">
      <div class="card-body">
        <blockquote class="blockquote mb-0">
          <p>{{ verse.Text ? verse.Text : 'Something went wrong :(' }}</p>
          <footer class="blockquote-footer mt-4">
            {{ bh.getBookName(verse.Book) }}
            <cite title="Location">{{verse.Chapter ? verse.Chapter : 'Unknown'}} : {{ verse.Verse ? verse.Verse : 'Unknown' }}</cite>
          </footer>
        </blockquote>
      </div>
    </div>

    <div v-if="displayExpandedVerse" class="expanded-verse-container d-flex justify-content-center flex-column gap-2
     position-fixed start-0 top-0 end-0 bottom-0 bg-dark bg-opacity-25 bg-blur">

      <div class="card shadow-sm mx-2">
        <div class="card-body">
          <blockquote class="blockquote mb-0">
            <p>{{ev.verse.value.Text ? ev.verse.value.Text : "Something went wrong :("}}</p>
            <footer class="blockquote-footer mt-4">
              {{ bh.getBookName(ev.verse.value.Book) }}
              <cite title="Location">{{ev.verse.value.Chapter ? ev.verse.value.Chapter : 'Unknown'}} : {{ ev.verse.value.Verse ? ev.verse.value.Verse : 'Unknown' }}</cite>
            </footer>
          </blockquote>
        </div>
      </div>

      <div class="container d-flex justify-content-between position-absolute bottom-0 mb-5">
        <button class="btn btn-circle btn-dark shadow-sm" type="button" name="Previous Verse" title="Previous Verse" @click="ev.previousVerse()">
          <svg width="24" height="24" fill="currentColor">
            <use href="/src/assets/bootstrap-icons.svg#arrow-left"/>
          </svg>
        </button>
        <button class="btn btn-circle btn-dark shadow-sm" type="button" name="Next Verse" title="Next Verse" @click="ev.nextVerse()">
          <svg width="24" height="24" fill="currentColor">
            <use href="/src/assets/bootstrap-icons.svg#arrow-right"/>
          </svg>
        </button>
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
.bg-blur {
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}
</style>

