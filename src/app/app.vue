<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { bibleVerseArray, bibleHelper, expandVerse } from '../composables/bible-entry';
import { bibleSelector } from '../composables/bible-selector';

const bs = bibleSelector();
const bva = bibleVerseArray();
const bh = bibleHelper();
const ev = expandVerse();
const mode = ref(0); // 0 : randomnly generate verses; 1 : generate verses that follow search params; 2: no results for param

const displayExpandedVerse = ref(false);
const displaySearchInput = ref(false);
const searchQuery = ref(null);


function searchHandler(){
  if (searchQuery.value !== null && searchQuery.value.trim() !== "") {
    mode.value = 1;
    bva.resetVerses();
    getVerses();
  } else { 
    mode.value = 0;
    bva.resetVerses();
    getVerses();
  };
};

function searchButtonHandler(){
  displaySearchInput.value = true;
};
function closeButtonHandler() {
  if (displayExpandedVerse.value) {displayExpandedVerse.value = false}
  else if ((mode.value === 1 || mode.value === 2 ) && searchQuery.value !== null) {
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
  if (mode.value === 0 && scrollPosition + windowHeight >= documentHeight - 300) {
    for (let i = 0; i < 4; i++) {
      bva.addNewVerse();
    }
  }
  else  if (mode.value === 1 && scrollPosition + windowHeight >= documentHeight - 300) {
    for (let i = 0; i < 4; i++) {
      bva.addNewVersesWithSearchQuery(searchQuery.value);
    }
  }
};
function getVerses(){
  // Calculate the maximum number of verses to fill the screen
  const maxVerses = Math.floor(window.innerHeight / 200); // each card is approximately 200px

  for (let i = bva.verses.value.length; i < maxVerses; i++) {
    if (mode.value === 0) {bva.addNewVerse(); }
    else if (mode.value === 1) { bva.addNewVersesWithSearchQuery(searchQuery.value); }
  }

  setTimeout(() => {
      if (bva.verses.value <= 0) { mode.value = 2;}
    }, 1);
}

function expandVerseHandler(verse){
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

  <!-- NAVBAR -->
  <div class="px-2 py-3 sticky-top bg-white ">
    <div class="container d-flex flex-row gap-2 justify-content-between">

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

      <button type="button" class="btn btn-outline-secondary btn-circle shadow-sm" name="Menu" data-bs-toggle="offcanvas" data-bs-target="#offcanvas">
        <svg width="24" height="24" fill="currentColor">
          <use href="/src/assets/bootstrap-icons.svg#three-dots-vertical"/>
        </svg>
      </button>

      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
        <div class="offcanvas-header justify-content-between">
          <img src="/src/assets/bible-scroll-logo.svg" height="60">
          <button type="button" class="btn btn-circle btn-outline-secondary shadow-sm" data-bs-dismiss="offcanvas" aria-label="Close">
            <svg width="24" height="24" fill="currentColor">
              <use href="/src/assets/bootstrap-icons.svg#chevron-right"/>
            </svg>
          </button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav flex-grow-1 justify-content-between">
                <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="/about.html">About</a></li>
                <li class="nav-item"><a class="nav-link" href="/donate.html">Donate</a></li>
                <li class="nav-item"><a class="nav-link" href="/contact.html">Contact</a></li>
          </ul>

          <div class="d-flex flex-column gap-2 rounded shadow-sm p-3 position-relative">
            <svg class="position-absolute top-0 end-0 m-3" width="24" height="24" fill="grey">
                      <use href="/src/assets/bootstrap-icons.svg#gear"/>
            </svg>
            <span>Bible version selector</span>

            <div class="form-check">
              <input class="form-check-input" type="radio" name="Bible Version Selector" id="kjvSelector" @input="bs.changeVersion('kjv'); searchHandler()" checked>
              <label class="form-check-label" for="kjvSelector">
                King James Version (KJV)
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="radio" name="Bible Version Selector" id="asvSelector" @input="bs.changeVersion('asv'); searchHandler()">
              <label class="form-check-label" for="asvSelector">
                American Standard Version (ASV)
              </label>
            </div>

          </div>

          <div class="rounded shadow-sm p-3">
            <p class="flex-wrap">Support by <span class="pacifico">Buying me a Coffee!</span></p>
            <a class="btn btn-dark" href="/donate">Learn more</a>
          </div>



          <hr>
          <p class="fs-6 lead">
            Jesus loves and forgives you, and everyone else including those that don't believe.
          </p>
        </div>
      </div>

    </div>
  </div>

  <!-- VERSE CONTAINER -->
  <div class="container py-5">
    <div class="row justify-content-center">
      
      <div class="col col-lg-9 d-flex flex-column gap-5 position-relative ">
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
      </div>

    </div>
  </div>

  <!-- EXPANDED VERSE CONTAINER -->
  <div v-if="displayExpandedVerse" class="d-flex justify-content-center flex-column gap-2 position-fixed start-0 top-0 end-0 bottom-0 bg-dark bg-opacity-25 bg-blur">

    <div class="container">
      <div class="row justify-content-center">
        
        <div class="col col-lg-10 card shadow-sm mx-2">
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
        
      </div>
    </div>
    
    <div class="position-absolute bottom-0 w-100 pb-3 pb-lg-5">
      <div class="container d-flex justify-content-between">
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

  <div v-if="(mode === 0 || mode === 1) && bva.verses.value.length <= 0" class="py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col col-lg-9 text-center">
          <p class="fs-1 mb-5">Searching the <strong>Holy Bible</strong> for your query...</p>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="mode === 1 && bva.verses.value.length > 0" class="py-5 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col col-lg-9 text-center">
          <p class="fs-2">No more verses can be found within the <strong>Holy Bible</strong> that contain your query.</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="mode === 2" class="py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col col-lg-9 text-center">
          <p class="fs-2 mb-5">No verses can be found within the <strong>Holy Bible</strong> that contain your query.</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.card {
  cursor: pointer;
}
.card-body {
  min-height: 200px;
}
.bg-blur {
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}
</style>

