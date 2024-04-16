import {ref} from 'vue';
import kjv from '../bibles/kjv.json';
import asv from '../bibles/asv.json';

const bible = ref(kjv); // default to kjv

export function bibleSelector() {

    let version = 'kjv';

    function changeVersion(ver) {
        version = versions.find(v => v.name === ver);
        if (version) {
            switch(version) {
                case 'kjv':
                    bible.value = kjv;
                    break;
                case 'asv':
                    bible.value = asv;
                    break;
            }
            console.log(ver);
        }
    }

    return { bible, changeVersion };
}

const versions = [
    { name: 'kjv'},
    { name: 'asv'}
];