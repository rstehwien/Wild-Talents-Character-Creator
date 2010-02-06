var WTCC = {
    config: {},

    documentReady: function() {
        // TODO try website first, then local
        $.ajax({
            type: "GET",
            url: "wtcc/xml/WildTalentsCharacterCreatorData.xml",
            dataType: "xml",
            success: WTCC.loadDataXml
        });
    },

    loadDataXml: function(xml) {
        // TODO data validation
        WTCC.config.xml = xml;
        WTCC.config.jquery = $(xml);
        WTCC.getSelectedConfig();

        WTCC.initPage();
    },

    getSelectedConfig: function() {
        var chosen_set_str = WTCC.config.jquery.find('config-sets').attr('chosen');
        WTCC.config.chosen_set = WTCC.config.jquery.find('config-sets config-set[ref="' + chosen_set_str + '"] config-choice');

        WTCC.config.effects = WTCC.getChosenConfig('effects');
        WTCC.config.capacities = WTCC.getChosenConfig('capacities');
        WTCC.config.stats = WTCC.getChosenConfig('stats');
        WTCC.config.skills = WTCC.getChosenConfig('skills');
        WTCC.config.meta_qualities = WTCC.getChosenConfig('meta-qualities');
        WTCC.config.archetypes = WTCC.getChosenConfig('archetypes');
        WTCC.config.modifiers = WTCC.getChosenConfig('modifiers');
        WTCC.config.powers = WTCC.getChosenConfig('powers');
        WTCC.config.tables = WTCC.getChosenConfig('tables');

        WTCC.createDefaultCharacter();
    },

    createDefaultCharacter: function() {
        // TODO build WTCC.config.character
        },

    getChosenConfig: function(type) {
        var links = [];
        (WTCC.config.chosen_set.filter('[type="' + type + '"]')).each(function() {
            links.push($(this).attr("link"))
        });

        var found;
        if (links.indexOf("_ALL_") < 0 && links.length > 0) {
            var selector = "";
            $(links).each(function() {
                if (selector.length != 0) selector += ",";
                selector += 'config-chooser[type="' + type + '"] > [ref="' + this + '"] > *'
            });
            found = WTCC.config.jquery.find(selector);
        }

        if (found === undefined || found.length <= 0) {
            found = WTCC.config.jquery.find('config-chooser[type="' + type + '"] > * > *');
        }

        WTCC.appendMessage('"' + type + '" config length: ' + found.length);

        return found;
    },

    appendMessage: function(msg) {
        $('<li>' + msg + '</li>').appendTo('#wtcc_messages');
    },

    loadCharacterXml: function(xml) {

        },

    initPage: function() {
        $('#wtcc_config_textarea').text(WTCC.serializeXML(WTCC.config.xml));
    },

    serializeXML: function(node) {
        if (typeof XMLSerializer != "undefined") return (new XMLSerializer()).serializeToString(node);
        else if (node.xml) return node.xml;
        else throw "XML.serialize is not supported or can't serialize " + node;
    },

    createXMLDocument: function(string)
    {
        var browserName = navigator.appName;
        var doc;
        if (browserName == 'Microsoft Internet Explorer')
        {
            doc = new ActiveXObject('Microsoft.XMLDOM');
            doc.async = 'false'
            doc.loadXML(string);
        } else {
            doc = (new DOMParser()).parseFromString(string, 'text/xml');
        }
        return doc;
    },
}

$(function() {
    WTCC.documentReady();
});