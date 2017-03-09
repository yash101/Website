;var to = null;
(function init() {
	var danger = null;
	$(document).ready(function ready() {
		$.ajax({
			dataType: "json",
			url: "res/danger.json",
			data: null,
			success: function(success) {
				danger = success;
				danger.pic = danger.pic.replace(danger.esep, "/");
				danger.email = danger.email.replace(danger.esep, "@");

				setTimeout(function setVars() {
					var pic = document.querySelectorAll("body > #home #details #picture")[0];
					pic.style.backgroundImage = "url(../" + danger.pic + ")";
				}, 100);
			}
		});
	});

	var max = function max(a, b) {
		if(a > b) return a;
		return b;
	};

	to = function to(location, skip) {
		scrollElement = $("#" + location);
		if(scrollElement.length) {
			if(skip == null || skip) {
				$("html, body").animate({
					scrollTop: max(0, scrollElement.offset().top - 64)
				}, 1000);
			}
		} else {
			$("#body").html("<h1>Loading Content...</h1>");
			$.ajax({
				dataType: "html",
				url: "views/" + location + ".html",
				data: null,
				success: function(success) {
					$("#body").html(success);
					if(skip == null || skip) {
						$("html, body").animate({
							scrollTop: max(0, $("#body").offset().top - 64)
						}, 1000);
					}
				}
			});
		}
	};

	to("projects", false);
})();