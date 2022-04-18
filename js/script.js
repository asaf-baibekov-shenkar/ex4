window.onload = function() {
	text();
}

function readStringFromFileAtPath(pathOfFileToReadFrom) {
	var request = new XMLHttpRequest();
	request.open("GET", pathOfFileToReadFrom, false);
	request.send(null);
	var returnValue = request.responseText;
	return returnValue;
}

function handleInput(string) {
	let innerTag = string.substring(string.indexOf("&lt;") + 4, string.indexOf("&gt;"));
	if (!innerTag.includes("input")) return null;
	let attributes = innerTag.split(" ").reduce(
		(previousValue, currentValue, currentIndex) => previousValue + " " + (currentIndex != 0 ? currentValue : ""),
		""
	);
	let innerHTML = `&lt;input ${attributes} style="width: 150px;"&gt;&lt;/input&gt;`
	return string.substring(0, string.indexOf("&gt;") + 4) + innerHTML + string.substring(string.indexOf("&gt;") + 4, string.length)
}

function handleSelect(string, strings) {
	let innerTag = string.substring(string.indexOf("&lt;") + 4, string.indexOf("&gt;"));
	if (!innerTag.includes("select") && !innerTag.includes("option")) return null;
	let attributes = innerTag.split(" ").reduce(
		(previousValue, currentValue, currentIndex) => previousValue + " " + (currentIndex != 0 ? currentValue : ""),
		""
	).slice(1);
	let inside = "";
	if (string.indexOf("&gt;") != -1 && string.indexOf("&lt;/") != -1 && string.indexOf("&gt;") < string.indexOf("&lt;/")) {
		inside = string.substring(string.indexOf("&gt;") + 4, string.indexOf("&lt;/"));
	}


	let indentations = string.substring(0, string.indexOf("&lt;"));
	let startTagName = innerTag.substring(0, innerTag.indexOf(" "));
	if (startTagName != "")
		startTagName = `&lt;${startTagName}${attributes}&gt;`
	let endTagName = "";
	if (string.lastIndexOf("&lt;/") != -1) {
		endTagName = "&lt;/" + string.substring(string.lastIndexOf("&lt;/") + 5, string.lastIndexOf("&gt;")) + "&gt;";
	}

	
	let innerHTML = `${indentations}${startTagName}${inside}${endTagName}`
	strings.push(innerHTML)
	return strings;
}

function text() {
	let text = readStringFromFileAtPath("./js/html.txt");
	let elements = [];
	let element = "";
	for (let i = 0; i < text.length; i++) {
		const char = text.charAt(i);
		switch(char) {
			case "<": element += "&lt;"; break;
			case ">": element += "&gt;"; break;
			case "\t": element += "&#09;"; break;
			case "\n": {
				elements.push(element);
				element = "";
				break;
			}
			default: element += char; break;
		}
	}
	let textElement = document.getElementById("text");
	let numbersElement = document.getElementById("numbers");
	let selectArray = []
	for (let i = 0; i < elements.length; i++) {
		let numberDiv = document.createElement("div");
		numberDiv.innerHTML =
			`<svg style="visibility: hidden;" width="16" height="16" viewBox="4 4 8 8" fill="#E51400" xmlns="http://www.w3.org/2000/svg">
				<path d="M10.0002 7.99988C10.0002 8.39544 9.88296 8.78206 9.6632 9.11096C9.44343 9.43986 9.13107 9.69628 8.76561 9.84766C8.40016 9.99903 7.99806 10.0386 7.6101 9.96143C7.22213 9.88426 6.86575 9.69377 6.58605 9.41406C6.30634 9.13436 6.11586 8.77798 6.03869 8.39001C5.96151 8.00205 6.00108 7.59995 6.15245 7.2345C6.30383 6.86904 6.56025 6.55668 6.88915 6.33691C7.21805 6.11715 7.60467 5.99988 8.00023 5.99988C8.53067 5.99988 9.03934 6.21062 9.41442 6.58569C9.78949 6.96077 10.0002 7.46944 10.0002 7.99988Z"/>
			</svg>
			<div>
				<span>${i}</span>
				<svg style="visibility: hidden;" width="18" height="18" viewBox="0 0 16 16" fill="#424242" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M10.0722 8.02397L5.71484 3.66666L6.33356 3.04794L11.0002 7.71461V8.33333L6.33356 13L5.71484 12.3813L10.0722 8.02397Z"/>
				</svg>
			</div>`;
		numbersElement.append(numberDiv);

		let openTag = elements[i].substring(elements[i].indexOf("&lt;"), elements[i].indexOf("&gt;") + 4);
		let closeTag = elements[i].substring(elements[i].indexOf("&lt;/"), elements[i].indexOf("&gt;") + 4);

		if (openTag.includes("&lt;select") || openTag.includes("&lt;option")) {
			selectArray = handleSelect(elements[i], selectArray);
		} else if (closeTag.includes("&lt;/select")) {
			selectArray = handleSelect(elements[i], selectArray);
			for (let j = 0; j < selectArray.length; j++) {
				const text = selectArray[j];
				let div = document.createElement("div");
				let startHighlightedSpan = document.createElement("span");
				startHighlightedSpan.innerHTML = text.substring(0, text.lastIndexOf("&gt;") + 4)
				highlight(startHighlightedSpan);
				div.appendChild(startHighlightedSpan);
				textElement.appendChild(div);
			}
			let selectAge = selectArray
								.reduce((previousValue, currentValue) => previousValue + currentValue, "")
								.replaceAll("&lt;", "<")
								.replaceAll("&gt;", ">");
			let div = document.createElement("div");
			let innerSpan = document.createElement("span");
			innerSpan.innerHTML = selectAge;
			innerSpan.firstElementChild.style.width = "150px";
			div.appendChild(innerSpan);
			textElement.appendChild(div);
		} else {
			let text = handleInput(elements[i]);
			if (text == null) {
				let div = document.createElement("div");
				let span = document.createElement("span");
				span.innerHTML = elements[i];
				highlight(span);
				div.appendChild(span);
				textElement.appendChild(div);
			} else {
				let div = document.createElement("div");
				let startHighlightedSpan = document.createElement("span");
				startHighlightedSpan.innerHTML = text.substring(0, text.indexOf("&gt;") + 4)
				highlight(startHighlightedSpan);
				div.appendChild(startHighlightedSpan);
				let inputText = text.substring(text.indexOf("&gt;") + 4, text.lastIndexOf("&lt;"));
				let innerSpan = document.createElement("span");
				inputText = inputText.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
				innerSpan.innerHTML = inputText;
				div.appendChild(innerSpan);
				textElement.appendChild(div);
			}
		}
	}
}