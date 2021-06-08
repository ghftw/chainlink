/* INCLUDE THIS BIT OF JS IN YOUR BASE FILE HEAD ELEMENT */
const pn = window.location.pathname;

const languages_available = [
    'ur',
    'de',
    'es',
    'fr',
    'ru',
    'pt',
    'cs',
    'ko',
    'zh-tw',
    'zh-cn',
    'da',
    'it',
    'no',
    'bn',
    'hi',
    'ar',
    'nl',
]
function languageData() {
    var language = 'en'; // the default language
    const languages = window.navigator.userLanguages || window.navigator.languages; //returns list of languages
    if (languages.length > 0)
        {
            // Loop through each language to check if it is in the translations list
            for (let i = 0; i < languages.length; i++) {
                var this_lang = languages[i].toLowerCase();
                // production note: if deploying account for all combinations like zh, zh-hk, zh-Hans, etc
                if (this_lang == 'zh-cn') {
                    language = 'zh-cn';
                }
                else if (this_lang == 'zh-tw') {
                    language = 'zh-tw';
                }
                else if (this_lang.match(/\-/)) {
                    // If there is a dash split the string so we can isolate the language code
                    language = this_lang.split('-', 1)[0];
                    }
                else {
                    language = this_lang;
                }
                if (languages_available.includes(language) == true)
                    {
                        // console.log('Found Language ' + language);
                        break
                    }
                }
        }
    return language
}
language_pref = languageData();

function loadLanguage(language_pref, pn) {
    if (language_pref == 'en'){return} // No translation necessary
    /*
        IMPORTANT CONFIGURATION STEPS
        1. COPY THE TRANSLATIONS DIRECTORY WHEREVER YOU HOUSE YOUR JS
        2. REPLACE THE EMPTY STRING IN path_to_js_directory WITH THE JS DIRECTORY PATH
    */
    // local testing: static/js/chainlink
    let path_to_js_directory = '';
    let requestURL = path_to_js_directory + '/translations/' + language_pref + '.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        const translations = request.response[pn];
        if (translations === undefined){
            // console.log('no translation available');
            return
        } else {
            var currentNode, ni = document.createNodeIterator(
                document.body,
                NodeFilter.SHOW_TEXT
            );
            n = 0;
            let title = document.getElementsByTagName('title')[0];
            title.textContent = translations['title'];
            while(currentNode = ni.nextNode()) {
                try {
                    currentNode.textContent = translations[n];
                }
                catch (error) {
                    continue
                }
                n ++;
            }
            var inputs = document.getElementsByTagName('input');
            for (i = 0; i < inputs.length; i++){
                if (translations['input' + i + 'placeholder']){inputs[i].setAttribute('placeholder', translations['input' + i + 'placeholder']);}
                if (translations['input' + i + 'value']){inputs[i].setAttribute('value', translations['input' + i + 'value']);}
                if (translations['input' + i + 'data-wait']){inputs[i].setAttribute('data-wait', translations['input' + i + 'data-wait']);}
            }
        }
    }
}
loadLanguage(language_pref, pn)
