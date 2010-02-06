var WTCC = {

    loadConfig: function(xml) {
        $(xml).find('config-choice').each(function() {
            var type = $(this).attr('type');
            var link = $(this).attr('link');
            $('<div class="items"></div>').html('<p>' + type + ': ' + link + '</p>').appendTo('#wtcc_tab_messages');
        });
        // TODO data validation
        WTCC.xml = xml;
        WTCC.initPage();
    },

    documentReady: function() {
        $.ajax({
            type: "GET",
            url: "wtcc/xml/WildTalentsCharacterCreatorData.xml",
            dataType: "xml",
            success: WTCC.loadConfig
        });
    },

    initPage: function() {
        $('<div class="items"></div>').html('<p>hello</p>').appendTo('#wtcc_tab_info');
    },
};

$(function() {
    WTCC.documentReady();
});