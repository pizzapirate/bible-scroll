<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { bibleVerseArray, bibleHelper } from '../composables/bible-entry';

const bva = bibleVerseArray();
const bh = bibleHelper();

bva.addNewVerse();

// Calculate the maximum number of verses to fill the screen
const maxVerses = Math.floor(window.innerHeight / 200); // each card is approximately 200px

// Generate additional verses
for (let i = bva.verses.value.length; i < maxVerses; i++) {
  bva.addNewVerse();
}

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
  window.addEventListener('scroll', loadMoreVerses);
});

onUnmounted(()=>{
  window.removeEventListener('scroll', loadMoreVerses);
});

</script>

<template>

  <div class="container p-3 d-flex flex-column gap-5">

    <div v-for="verse in bva.verses.value" class="card shadow-sm">
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
</style>

