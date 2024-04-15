import kjv from '../bibles/kjv.json'; // default
let bible = kjv;

export function bibleSelector() {

    let version = 'kjv';

    function changeVersion(ver) {
        version = versions.find(v => v.name === ver);
        if (version) {
            // Dynamically import the JSON file based on the path
            import(version.path).then(newBible => {
                bible = newBible.default; // Assuming JSON file is ES module
                console.log(bible);
            }).catch(err => {
                console.error("Error loading Bible version:", err);
            });
        } else {
            console.error("Invalid Bible version:", ver);
        }
    }

    return { bible, changeVersion };
}

const versions = [
    { name: 'kjv', path: '../bibles/kjv.json' },
    { name: 'asv', path: '../bibles/asv.json' },
    { name: 'drb', path: '../bibles/drb.json' },
    { name: 'ylt', path: '../bibles/ylt.json' }
];