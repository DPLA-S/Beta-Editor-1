"use strict";
$('#menu').load('components/menu.html');
let indentSize = Number(localStorage.getItem("DPLA_EDITOR_INDENT_SIZE")) || 2;
$('#editor-file-input').on('change', function(e) {
  const file = $(this).files[0];
  const fileReader = new FileReader();
  fileReader.onload = function() {
    codeArea.val(fr.result);
  }
  fileReader.readAsText(file);
});
function loadCodeFromLocalStorage() {
  if(!localStorage.getItem('DPLA_EDITOR_SAVED_CODE')) {
    window.alert('You do not have any code stored in your local storage.');
  } else {
    codeArea.val(localStorage.getItem('DPLA_EDITOR_SAVED_CODE'));
  }
}
function saveCodeToLocalStorage() {
  if(localStorage.getItem('DPLA_EDITOR_SAVED_CODE')) {
    if(window.confirm("There is already a program stored in your local storage. Do you want to override it?")) {
      localStorage.setItem('DPLA_EDITOR_SAVED_CODE', codeArea.val())
    }
  } else {
    localStorage.setItem('DPLA_EDITOR_SAVED_CODE', codeArea.val());
  }
}
function saveCodeToFile() {
  const link = document.createElement('a');
  link.href = 'data:text/plain;charset=utf-8,'+encodeURIComponent(codeArea.val());
  link.download = (window.prompt("Program Name") || 'program') + '.dpla';
  link.click();
}
function replaceAll() {
  codeArea.val(
    codeArea.val()
    .replaceAll(
      window.prompt("What do you want to replace?"),
      window.prompt("What do you want to replace it with?")
    )
  );
}
function setIndentSize() {
  localStorage.setItem("DPLA_EDITOR_INDENT_SIZE", window.prompt("Indent size (the default is 2 spaces, and 2 spaces or 4 are recommended)") || 2);
  indentSize = Number(localStorage.getItem("DPLA_EDITOR_INDENT_SIZE"));
}
(function() {
  function handleShortcuts(e) {
    if(e.ctrlKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveCode();
    }
  }
  window.codeArea = $('#codearea');
  let edited = false
  window.addEventListener('keydown', handleShortcuts);
  window.addEventListener('keydown', function(e) {
    if(e.key === 'Tab' && codeArea.is(":focus")) {
      e.preventDefault();
      const curPosStart = codeArea[0].selectionStart;
      const curPosEnd = codeArea[0].selectionEnd;
      const currentCode = codeArea.val();
      codeArea.val(currentCode.slice(0,curPosStart)+' '.repeat(indentSize)+currentCode.slice(curPosStart));
      codeArea[0].setSelectionRange(curPosStart + indentSize, curPosEnd + indentSize);
    }
  });
  codeArea.on('input', function(e) {
    if(!edited) {
      edited = true;
      window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '';
      })
    }
  });
})();