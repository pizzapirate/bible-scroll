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
          <h5 class="offcanvas-title" id="offcanvasLabel">Bible Scroll</h5>
          <button type="button" class="btn btn-circle btn-outline-secondary shadow-sm" data-bs-dismiss="offcanvas" aria-label="Close">
            <svg width="24" height="24" fill="currentColor">
              <use href="/src/assets/bootstrap-icons.svg#chevron-right"/>
            </svg>
          </button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav flex-grow-1 justify-content-between">
                <!--LOGO-->
                <!-- <li class="nav-item">
                  <a class="nav-link" href="#">
                    <svg class="bi" width="24" height="24"><use xlink:href="#aperture"></use></svg>
                  </a>
                </li> -->
                <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="/about.html">About</a></li>
                <li class="nav-item"><a class="nav-link" href="/donate.html">Donate</a></li>
                <li class="nav-item"><a class="nav-link" href="/opensource.html">Open-source</a></li>
                <li class="nav-item"><a class="nav-link" href="/contact.html">Contact</a></li>
              </ul>
        </div>
      </div>

    </div>
  </div>

  <!-- VERSE CONTAINER -->
  <div class="container">
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

  <div class="bg-danger">
    <h2>LOADING</h2>
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

