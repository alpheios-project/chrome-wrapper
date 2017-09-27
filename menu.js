/**
 * Created by Elijah Cooke on 1/9/2017.
 */

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("activateGreek").addEventListener("click", function() {
        chrome.tabs.executeScript(null, {file: "alpheios-morphlib.js", allFrames: true}, function() { var lib = new morphlibrary('grc-lsj-defs.json'); lib.activate('grc',null); })
    })
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("activateLatin").addEventListener("click", function() {
        chrome.tabs.executeScript(null, {file: "alpheiosmorphliblat.js"});
    })
});


