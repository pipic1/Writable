var turndownService = new TurndownService({ headingStyle: "atx"});
var classbadge = $("#classBadge").hide();
var btnEdit = $("#edit_all");
var validBtn = $("#validModification").hide();
var printBtn = $('#printBtn')

function editNode(node) {
	$(node).toggleClass("edited");
	var markdown = turndownService.turndown(node.outerHTML)
	var content = node.innerHTML;
	$(node).attr('contenteditable', 'true');
	$(node).text(markdown);
	console.log("markdown", markdown);
	$(node).focus();
	$(node).before(classbadge.text(node.localName).show());
	//$(node).after(toolbox.show());
	$(node).select(function() {
		console.log("selection");
	});
}

function validNode(node) {
	var markdown_Text = node.innerText;
	html_content = markdown.toHTML(markdown_Text);
	console.log(html_content);
	//replace old node by new node
	$(node).replaceWith($(html_content))
	//initEventMDNode();
	classbadge.hide();
}

function initEventMDNode() {
	$("h1,h2,h3,h4,h5,h6,p,a").off();
	$("h1,h2,h3,h4,h5,h6,p,a").on("click", function (e) {
		$(e.target).off().focusout(function(){
			validNode(e.target);
			initEventMDNode();
		})
		editNode(e.target)
		$(e.target).keypress(function (e) {
			var key = e.which;
			if (key == 13) {
				$(e.target).blur();
				validNode(e.target);
				initEventMDNode();
			}
		});
	})
}

function editWholePage(node){
	$(node).wrap( "<div id='markdownFull'>" );
	btnEdit.hide();
	$(node).find("h1,h2,h3,h4,h5,h6,p,a").off()
	$(node).toggleClass("edited");
	$(node).attr('contenteditable', 'true');
	$(node).find("h1,h2,h3,h4,h5,h6,p,a").each(function(idx, value) {
		$(value).text(turndownService.turndown(value.outerHTML));
	});
	validBtn.click(function(){
		$(node).toggleClass("edited");	
		validNode(node);
		initEventMDNode();
		validBtn.hide("fast");
		btnEdit.show("fast");
	})
}

function addChildLayer(container, child){
	child.append($(container).childNodes);
	$(container).empty();
	$(container).append(child);
}

function btnListener(){
	btnEdit.click(function(e){
		var pageNode = $("#markdownFull")[0];
		editWholePage(pageNode);
		validBtn.show("fast");
	})
}

function startApp() {
	initEventMDNode();
	btnListener();
}

$(document).ready(function() {
	printBtn.click(function(e){
		window.print();
	});
})


startApp();