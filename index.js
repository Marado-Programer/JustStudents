// ==UserScript==
// @name        Just Students
// @namespace   https://github.com/Marado-Programer/
// @match       http*://oghma.epcc.pt/*
// @grant       none
// @version     1.0
// @author      al220007@epcc.pt
// @description Remove students that aren't students anymore
// ==/UserScript==

document.querySelectorAll("li.student, tr.student").forEach(student => {
  if (!student.classList.contains("active"))
    student.remove();
});

document.querySelectorAll("table.evaluations tr").forEach((student, i) => {
  if (i != 0 && !student.classList.contains("active"))
    student.remove();
});
