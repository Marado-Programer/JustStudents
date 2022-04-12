// ==UserScript==
// @name        JustStudents
// @namespace   https://github.com/Marado-Programer/
// @match       http*://oghma.epcc.pt/courses/*/subscriptions
// @grant       none
// @version     1.0
// @author      al220007@epcc.pt
// @description Remove students that aren't students anymore
// ==/UserScript==

document.querySelectorAll("li.student").forEach( student => {
		if (!student.classList.contains("active"))
			student.remove() 
} );

