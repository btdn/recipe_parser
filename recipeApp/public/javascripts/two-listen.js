(function() {
	var AddListeners = {};

	var indexes = [];

	function modal(index1) {
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		var modalTemplate = Handlebars.compile($("#modal_template").html());
		console.log(currGraph);
		var title1 = currGraph[index1][3];
		$("#portfolioModal1").html(modalTemplate({title: title1}));
		$(".portfolio-link").trigger('click');
		UpgradeListener.listen(index1);	
	}

	AddListeners.listenNow = function() { $(".clickPanel").click(function() {
			var numberPattern = /\d+/g;
			var id = this.id.match(numberPattern);
			modal(id);
	//		UpgradeListener.initialize(id);
	//		$( "#downgrade" ).trigger( "click" );
			GraphRenderer.render(id, null, null, "#graphA");
		});
	};

	window.AddListeners = AddListeners;
})();