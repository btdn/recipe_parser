(function() {
	var RenderClosed = {};

	RenderClosed.render = function() {
		var htmlBlocks = [];

		var RenderClosed = {};

		console.log("INSIDE RENDER CLOSED");

		$(".parent-closed").each(function() {
		  var html = $(this).html();
		  if (html.length > 0) {
		  	htmlBlocks.push(html);
		  }
		});

		var counter = 0;
		for(var i = 1; i < 4; i++) {
			if(counter > htmlBlocks.length-1) return;
			var selectRow = $("#row"+i);
			selectRow.html('');
			for(var j = 0; j < 3; j++) {
				if (counter > htmlBlocks.length-1) {
					return;
				}
				var column = $("<div class='col-md-4 parent-closed'></div>");
				var id = $(htmlBlocks[counter]).find('input[type=checkbox]')[0].id;
				var numberPattern = /\d+/g;
				id = id.match(numberPattern)[0];
				GraphRenderer.render(parseInt(id));
				column.html(htmlBlocks[counter]);
				selectRow.append(column);
				counter += 1;
			}
		}
		$(document).ready(function(){
		  $(".panel-tools .closed-tool").click(function(event){
		  	$(this).parents(".parent-closed").html('');
		  	render();
		  });
		}); 

	}

	window.RenderClosed = RenderClosed;

})();
