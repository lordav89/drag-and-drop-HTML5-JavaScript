	var borderOnDrag = "1px dotted grey";
	var borderOnOver = "thin dashed grey";
	var borderBasic = "1px solid #aaaaaa";
	var oldWidth = 0;
	var current_dragged;
	var current_dragged_width;
	var reachable_divs = [];
	var prev_resp = "";
	var templ_sing_ans_cont_id = "single_ans_container";
	var templ_ans_id = "ans";
	var templ_scored_ans_id = "scored_answer";
	var templ_input_scored_ans_id = "input_answer_value_by_drag_drop";
	var previous;
	var previous_width;

	function isEmpty(element_id) {
		return (document.getElementById(element_id).children.length == 0);
	}

	function numberAtEnd(str, template) {
		return str.substring(template.length, str.length);
	}

	function getElementsStartsWithId(id) {
		var children = document.body.getElementsByTagName('div');
		var elements = [], child;
		for (var i = 0, length = children.length; i < length; i++) {
			child = children[i];
			if (child.id.substr(0, id.length) == id)
				elements.push(child);
		}
		return elements;
	}

	function getEmptyElementsStartsWithId(id) {

		var elements = getElementsStartsWithId(id);
		var empty_elements = [];
		for (i in elements) {
			//console.log(i+"     "+elements[i].id+"        "+elements[i].children.length);
			if (elements[i].children.length == 0)
				empty_elements.push(elements[i]);
		}
		return empty_elements;
	}

	function getElementsStartsWithIdUnlessOne(id, one) {
		var children = document.body.getElementsByTagName('div');
		var elements = [], child;
		for (var i = 0, length = children.length; i < length; i++) {
			child = children[i];
			if ((child.id.substr(0, id.length) == id) && (child != one))
				elements.push(child);
		}
		return elements;
	}

	function containsElement(array, element) {
		var response = false;
		for (i in array) {
			if (array[i] == element)
				response = true;
		}

		return response;

	}

	function adjustWidth(contained, parent) {
		var contained_width = contained.offsetWidth;
		if (contained_width < parent.offsetWidth)
			parent.style.minWidth = contained_width + "px";
	}

	function setInputScoredAnswer() {
		var elements = getElementsStartsWithId(templ_scored_ans_id);
		for (i in elements) {
			input_ans_id = templ_input_scored_ans_id
					+ numberAtEnd(elements[i].id, templ_scored_ans_id);
			var r = "";
			if (!isEmpty(elements[i].id))
				r = elements[i].children[0].id;

			document.getElementById(input_ans_id).value = r;

		}
	}

	function getHiddenDiv() {
		var className = "hiddenDiv";
		var elements = document.getElementsByClassName(className);
		if (elements.length == 0) {
			var div = document.createElement("div");
			document.body.appendChild(div);
			div.style.display = "none";
			div.className = "hiddenDiv";
			return div;
		} else
			return document.getElementsByClassName(className)[0];
	}

	function setWidth(item) {

		if (oldWidth == 0)
			oldWidth = item.offsetWidth - 2;

		item.style.border = borderOnOver;
		var w = current_dragged_width;

		if (w > item.offsetWidth)
			item.style.minWidth = w + "px";

	}

	function setBorderDivToGet(borderStyle) {
		for (i in reachable_divs) {
			reachable_divs[i].style.border = borderStyle;
		}

	}

	function drag(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
		ev.dataTransfer.effectsAllowed = "move";

		current_dragged = ev.target;

		if (current_dragged.parentNode.id.indexOf(templ_sing_ans_cont_id) == 0)
			reachable_divs = getElementsStartsWithId(templ_scored_ans_id);

		if (current_dragged.parentNode.id.indexOf(templ_scored_ans_id) == 0) {
			reachable_divs = getEmptyElementsStartsWithId(templ_sing_ans_cont_id).concat(getElementsStartsWithIdUnlessOne(templ_scored_ans_id,current_dragged.parentNode));
		}

		setBorderDivToGet(borderOnDrag);
		oldWidth = 0;

		current_dragged_width = current_dragged.offsetWidth;

	}

	function overScoredAnswer(ev, item) {
		
		if (containsElement(reachable_divs, item)) {
			ev.preventDefault();
			if (!isEmpty(item.id)) {
				input_ans_id = templ_input_scored_ans_id
						+ numberAtEnd(item.id, templ_scored_ans_id);
				prev_resp = document.getElementById(input_ans_id).value;
				if (current_dragged.id != prev_resp) {

					var prev_resp_element = document.getElementById(prev_resp);
					var newParent = current_dragged.parentNode;

					var hidden_div = getHiddenDiv();

					hidden_div.appendChild(current_dragged);

					if (current_dragged_width > item.offsetWidth)
						item.style.minWidth = current_dragged_width + "px";
					else
						item.style.minWidth = (item.offsetWidth - 2) + "px";

					adjustWidth(prev_resp_element, newParent);
					newParent.appendChild(prev_resp_element);

					setInputScoredAnswer();

					if (!previous) {
						previous = prev_resp_element;
						previous_width = previous.offsetWidth - 2;
					}

				}
			} else {
				item.style.border = borderOnOver;
				setWidth(item);

				var ans_cont = current_dragged.parentNode;
				if (ans_cont.id.indexOf(templ_sing_ans_cont_id) == 0)
					if (isEmpty(ans_cont.id))
						ans_cont.style.minWidth = w + "px";

			}
		}

	}

	function dropScoredAnswer(ev, item) {
		ev.preventDefault();

		if (isEmpty(item.id)) {
			adjustWidth(current_dragged, item);
			item.appendChild(current_dragged);
		}

	}

	function leaveScoredAnswer(ev, item) {

		if (containsElement(reachable_divs, item)) {

			setBorderDivToGet(borderOnDrag);
			if (previous) {
				previous.parentNode.appendChild(current_dragged);
				adjustWidth(current_dragged, previous.parentNode);

				item.appendChild(previous);
				adjustWidth(previous, item);

				setInputScoredAnswer();

				item.style.border = borderBasic;
			}

			if (isEmpty(item.id))
				item.style.minWidth = oldWidth + "px";

			previous = "";

		}

	}

	function allowDrop(ev, item) {

		if (containsElement(reachable_divs, item))
			{
			setWidth(item);
			ev.preventDefault();
			}

	}

	function drop(ev, container) {

		ev.preventDefault();

		if (containsElement(reachable_divs, container)) {
			container.appendChild(current_dragged);
			adjustWidth(current_dragged, container);
		}

	}

	function leaveDrag(ev, item) {

		setBorderDivToGet(borderOnDrag);

		if (containsElement(reachable_divs, item)) {
			item.style.minWidth = oldWidth + "px";
		}

	}

	function dragEnd(item) {

		var elements = getElementsStartsWithId(templ_scored_ans_id);
		for (i in elements) {
			elements[i].style.border = borderBasic;
		}

		var elements = getElementsStartsWithId(templ_sing_ans_cont_id)
		for (i in elements) {
			elements[i].style.border = borderBasic;
		}

		previous = "";

		var hidden_div = getHiddenDiv();

		if (hidden_div.children.length > 0) {
			console.log("Sometime the browser misses some work :)");
			console.log("There are some hidden div not properly managed.");
			console.log("I move it (or them) into a single container of the answers.");
			while (hidden_div.children.length > 0)
				getEmptyElementsStartsWithId(templ_sing_ans_cont_id)[0].appendChild(hidden_div.children[0]);
		}

		if (current_dragged_width < item.parentNode.offsetWidth)
			item.parentNode.style.minWidth = (current_dragged_width - 2) + "px";

		var elements = getElementsStartsWithId(templ_ans_id)
		for (i in elements)
			elements[i].style.width = elements[i].style.minWidth;

		setInputScoredAnswer();

	}

	function prepareEnvironment() {

		var elements = getElementsStartsWithId(templ_scored_ans_id)
		for (i in elements) {
			var input = document.createElement("INPUT");
			var x = i;
			x++;
			input.id = templ_input_scored_ans_id + x;
			input.type = "hidden";
			input.name = "answer_value";
			input.value = "";
			document.body.appendChild(input);

			elements[i].addEventListener("drop", function(event) {
				dropScoredAnswer(event, this);
			});
			elements[i].addEventListener("dragover", function(event) {
				overScoredAnswer(event, this);
			});
			elements[i].addEventListener("dragleave", function(event) {
				leaveScoredAnswer(event, this);
			});
		}

		var elements = getElementsStartsWithId(templ_ans_id)
		for (i in elements) {
			elements[i].style.minWidth = (elements[i].offsetWidth) + "px";
			elements[i].draggable = true;
			elements[i].addEventListener("dragstart", function(event) {
				drag(event);
			});
			elements[i].addEventListener("dragend", function(event) {
				dragEnd(this);
			});
		}

		var elements = getElementsStartsWithId(templ_sing_ans_cont_id)
		for (i in elements) {
			elements[i].addEventListener("drop", function(event) {
				drop(event, this);
			});
			elements[i].addEventListener("dragover", function(event) {
				allowDrop(event, this);
			});
			elements[i].addEventListener("dragleave", function(event) {
				leaveDrag(event, this);
			});
		}

	}

	window.onload = prepareEnvironment;
