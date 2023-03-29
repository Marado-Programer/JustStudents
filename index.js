// ==UserScript==
// @name        Just Students
// @namespace   https://github.com/Marado-Programer/
// @match       http*://oghma.epcc.pt/*
// @grant       none
// @version     1.0
// @author      al220007@epcc.pt
// @description Remove students that aren't students anymore
// ==/UserScript==

const url = window.location.href;

document.querySelectorAll("li.student, tr.student").forEach(student => {
  if (!student.classList.contains("active"))
    student.remove();
});

if (url.match(/units/)) {
  document.querySelectorAll("table.evaluations tr").forEach((student, i) => {
    if (i != 0 && !student.classList.contains("active"))
      student.remove();
  });
  const evaluationsTable = document.getElementsByClassName("evaluations")[1],
    evaluations = document.querySelectorAll("table.evaluations tr.active");
  const orderedEvaluations = [].slice.call(evaluations).sort((x, y) => {
    if (x.querySelector(".number")) {
      return x.querySelector(".number").childNodes[0].nodeValue - y.querySelector(".number").childNodes[0].nodeValue;
    } else {
      return x.querySelector("td:nth-child(4)").innerText - y.querySelector("td:nth-child(4)").innerText;
    }
  });

  evaluations.forEach(i => i.remove());

  orderedEvaluations.forEach(i => evaluationsTable.append(i));
} else if (url.match(/users/)) {
  const evaluationsTable = document.getElementsByClassName("evaluations")[1],
        evaluations = document.querySelectorAll("table.evaluations tr.evaluation");

  const date = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2} UTC)/;

  const orderedEvaluations = [].slice.call(evaluations).sort((x, y) => {

    const xDate = new Date(date.exec(x.childNodes[15].title)[1]);
    const yDate = new Date(date.exec(y.childNodes[15].title)[1]);

    //return xDate - yDate;
    return x.childNodes[5].innerHTML - y.childNodes[5].innerHTML;
  });

  evaluations.forEach(i => i.remove());

  //orderedEvaluations.reverse().forEach(i => evaluationsTable.append(i));
  orderedEvaluations.forEach(i => evaluationsTable.append(i));
}
