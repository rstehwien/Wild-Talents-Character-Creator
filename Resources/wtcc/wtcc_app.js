$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: "wtcc/xml/WildTalentsCharacterCreatorData.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('config-choice').each(function(){
				var type = $(this).attr('type');
				var link = $(this).attr('link');
				$('<div class="items"></div>').html('<p>'+type+': '+link+'</a>').appendTo('#page-wrap');
			});
		}
	});
});