/**
 * Created by Elijah Cooke on 1/9/2017.
 */

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("activateGreek").addEventListener("click", function() {
        chrome.tabs.executeScript(null, {file: "alpheiosmorphlibgrc.js"});
    })
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("activateLatin").addEventListener("click", function() {
        chrome.tabs.executeScript(null, {file: "alpheiosmorphliblat.js"});
    })
});

