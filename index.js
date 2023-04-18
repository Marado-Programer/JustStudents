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

  const avg = orderedEvaluations.reduce((x, y) => parseInt(typeof x === "number" ? x : x.querySelector("td:nth-child(3)").innerText, 10) + parseInt(typeof y === "number" ? y : y.querySelector("td:nth-child(3)").innerText, 10));

  evaluations.forEach(i => i.remove());

  //orderedEvaluations.reverse().forEach(i => evaluationsTable.append(i));
  orderedEvaluations.forEach(i => evaluationsTable.append(i));
  const avgtr = document.createElement("tr");
avgtr.append(document.createElement("td"));
avgtr.append(document.createElement("td"));
  const avgtd = document.createElement("td");
  const b = document.createElement("b");
b.append(document.createTextNode(`Average: ${avg / orderedEvaluations.length}`));
  avgtd.append(b);
  avgtr.append(avgtd);

avgtr.append(document.createElement("td"));
avgtr.append(document.createElement("td"));

avgtr.append(document.createElement("td"));
avgtr.append(document.createElement("td"));

avgtr.append(document.createElement("td"));
avgtr.append(document.createElement("td"));
  evaluationsTable.append(avgtr);
} else if (url.match(/\/courses\/?$/)) {
  Promise.all([].slice.call(document.querySelectorAll("#main > div > div.span10.main > table > tbody > tr a")).map(i => fetch(`${i.href}/evaluations`).then(res => res.text()).then(course => {
    const you_start = course.indexOf('<tr class="active me">');
      const you = course.substring(you_start, course.indexOf("</tr>", you_start)).trim();
      const rate_start = you.indexOf('<td class="number">');
      const matches = you.substring(rate_start, you.indexOf("</td>", rate_start)).match(/(\d+\.\d+).*\d+\/(\d+)/);
    if (matches == null) {
      return;
    }
    const [ , rate, _modules ] = matches;

    return rate;
  }))).then(rates => rates.filter(i => typeof i === "string")).then(rates =>  rates.reduce((x, y) => parseFloat(x, 10) + parseFloat(y, 10)) / rates.length ).then(avg => console.log(avg));
}
