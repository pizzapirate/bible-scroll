import { ref } from 'vue'
import kjv from '../bibles/kjv.json'

let bible = kjv; // default to KJV

export function bibleVerseArray() {
    let verseIndex;
    let verses = ref([]);

    function resetVerses(){
        verses.value = [];
    }
    function addNewVerse() {
        verseIndex = Math.floor(Math.random() * (bible.length - 0 + 1));
        verses.value.push(bible[verseIndex]);
    }
    function addNewVersesWithSearchQuery(query){
        const bh = bibleHelper();
        bible.some((verse) => {
            if (verses.value.includes(verse)) {
                return false;
            }
            let stringifyVerseIdentifier = [
                // BOOK(STR) CHAPTER:VERSE
            `${bh.getBookName(verse.Book).toLowerCase()} ${verse.Chapter}:${verse.Verse}`,
                // BOOK(STR) CHAPTER
            `${bh.getBookName(verse.Book).toLowerCase()} ${verse.Chapter}`
            ]
            if (
                verse.Text.toLowerCase().includes(query.toLowerCase()) ||
                verse.Chapter.toString().includes(query) ||
                verse.Verse.toString().includes(query) || 
                bh.getBookName(verse.Book).toLowerCase().includes(query.toLowerCase()) ||
                stringifyVerseIdentifier.includes(query.toLowerCase())
            ) { 
                verses.value.push(verse);
                return true; // Stops the loop
            }
            return false; // Continues to the next iteration
        });
    }

    return { verses, addNewVerse, addNewVersesWithSearchQuery, resetVerses };
}
export function bibleHelper(){
    function getBookName(bookNum){
        if (bookNum === null || bookNum === "") {
            return 'Unknown';
        }

        const bookNames = {
            1: "Genesis",
            2: "Exodus",
            3: "Leviticus",
            4: "Numbers",
            5: "Deuteronomy",
            6: "Joshua",
            7: "Judges",
            8: "Ruth",
            9: "1 Samuel",
            10: "2 Samuel",
            11: "1 Kings",
            12: "2 Kings",
            13: "1 Chronicles",
            14: "2 Chronicles",
            15: "Ezra",
            16: "Nehemiah",
            17: "Esther",
            18: "Job",
            19: "Psalms",
            20: "Proverbs",
            21: "Ecclesiastes",
            22: "Song of Solomon",
            23: "Isaiah",
            24: "Jeremiah",
            25: "Lamentations",
            26: "Ezekiel",
            27: "Daniel",
            28: "Hosea",
            29: "Joel",
            30: "Amos",
            31: "Obadiah",
            32: "Jonah",
            33: "Micah",
            34: "Nahum",
            35: "Habakkuk",
            36: "Zephaniah",
            37: "Haggai",
            38: "Zechariah",
            39: "Malachi",
            40: "Matthew",
            41: "Mark",
            42: "Luke",
            43: "John",
            44: "Acts",
            45: "Romans",
            46: "1 Corinthians",
            47: "2 Corinthians",
            48: "Galatians",
            49: "Ephesians",
            50: "Philippians",
            51: "Colossians",
            52: "1 Thessalonians",
            53: "2 Thessalonians",
            54: "1 Timothy",
            55: "2 Timothy",
            56: "Titus",
            57: "Philemon",
            58: "Hebrews",
            59: "James",
            60: "1 Peter",
            61: "2 Peter",
            62: "1 John",
            63: "2 John",
            64: "3 John",
            65: "Jude",
            66: "Revelation"
          };

        const bookname = bookNames[bookNum] || "Unknown";
        return bookname;
    }

    return{ getBookName };
}
export function expandVerse(){
    let ver = ref(null);
    let verseIndex;
    let verse = ref(null);

    function initVerse(_verse, bsVer){
        // HERE LIES THY PROBLEM - WE ARE INSTANTIATING A NEW BS, WHICH DEFAULTS TO KJV. 
        // AND THEN WE ARE CALLING BIBLE, WHICH IS POSSIBLY ANOTHER VERSION ALTOGETHER...

        // INIT DEFAULT VERSION - WHICH IS BS.VER
        ver.value = bsVer.value;
        // console.log(bsVer.value);

        verseIndex = bible.findIndex((obj) => obj.Book === _verse.Book && obj.Chapter === _verse.Chapter && obj.Verse === _verse.Verse);
        verse.value = bible[verseIndex];
    };
    async function getAnotherVersion(){
        let b = await import(`../bibles/${ver.value}.json`);
        verse.value = b.default[verseIndex];
    }
    function previousVerse(){
        // RESET EXPANDVERSE.VER
        const bs = bibleSelector();
        ver.value = bs.ver.value;

        verseIndex--;
        verse.value = bible[verseIndex];
    }
    function nextVerse(){
        // RESET EXPANDVERSE.VER
        const bs = bibleSelector();
        ver.value = bs.ver.value;

        verseIndex++;
        verse.value = bible[verseIndex];
    }

    return { verse, initVerse, previousVerse, nextVerse, ver, getAnotherVersion }
}
export function bibleSelector(){
    const ver = ref('kjv');

    const versions = [
        {ver: 'kjv', label: 'King James Version (KJV)'},
        {ver: 'esv', label: 'English Standard Version (ESV)'},
        {ver: 'niv', label: 'New International Version (NIV)'},
        {ver: 'web', label: 'World English Bible (WEB)'},
    ]

    async function changeVersion() {
        // const version = ver.value;
        let bibleModule = await import(`../bibles/${ver.value}.json`);
        bible = bibleModule.default;
    }

    return { changeVersion, ver, versions }
}
