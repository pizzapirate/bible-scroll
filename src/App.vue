<script setup>
import { ref } from 'vue';

let bible = ref();
let bibleVerseIndex;
let bibleChapterIndex;

import('./kjv-formatted.json').then(data => {
  bible = data.default;
  console.log(bible);
});


let randomVerse = ref();
function GenerateRandomVerse() {
  console.log(bible.length);
  bibleVerseIndex = Math.floor(Math.random() * (bible.length - 0 + 1));
  randomVerse.value = bible[bibleVerseIndex];
}
function PreviousVerse(){
  bibleVerseIndex--;
  randomVerse.value = bible[bibleVerseIndex];
}
function NextVerse(){
  bibleVerseIndex++;
  randomVerse.value = bible[bibleVerseIndex];
}

</script>

<template>

  <button @click="GenerateRandomVerse">
    Generate Random Verse
  </button>

  <button @click="PreviousVerse">
    Previous
  </button>

  <button @click="NextVerse">
    Next
  </button>

  <p>
    {{ randomVerse ? randomVerse : "No verse generated" }}
  </p>

</template>

