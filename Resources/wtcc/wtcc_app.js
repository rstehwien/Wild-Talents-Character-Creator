var WTCC = {
    config: {},
    valid_versions: [1],

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
        WTCC.config.xml = xml;
        WTCC.config.jquery = $(xml);

        WTCC.config.version = parseInt(WTCC.config.jquery.find('data').attr('version'));
        if (WTCC.valid_versions.indexOf(WTCC.config.version) < 0)
        {
            WTCC.appendMessage('Unsupported data version ' + WTCC.config.version);
            return;
        }

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
        WTCC.config.jdefault_character = $(WTCC.config.jquery.find('character')[0]);
        
        var jcharacter = WTCC.config.jdefault_character;
        jcharacter.attr('version', WTCC.config.version);
        var stats = jcharacter.find('pools[type="stats"]');
        stats.append(WTCC.config.stats.clone());
        var native_mod = WTCC.config.modifiers.find('modifier[ref="native"]');
        stats.find('effect').each(function(){
          // TODO needs to be some way to add some elements automatically
          if ($(this).find('modifiers').length === 0) $(this).append($('<modifiers/>'));
          $(this).find('modifiers').append(native_mod.clone());
        });
        
        if (WTCC.config.character === undefined)
          WTCC.loadCharacterXml(WTCC.config.jdefault_character.clone()[0]);
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
                selector += 'config-chooser[type="' + type + '"] > [ref="' + this + '"]'
            });
            found = WTCC.config.jquery.find(selector);
        }

        if (found === undefined || found.length <= 0) {
            found = WTCC.config.jquery.find('config-chooser[type="' + type + '"] > *');
        }

        WTCC.appendMessage('"' + type + '" config length: ' + found.length);

        return found;
    },

    appendMessage: function(msg) {
        $('<li>' + msg + '</li>').appendTo('#wtcc_messages');
    },

    loadCharacterXml: function(xml) {
          WTCC.config.character = xml;
          WTCC.config.jcharacter = $(xml);

          var version = parseInt(WTCC.config.jcharacter.attr('version'));
          if (WTCC.valid_versions.indexOf(version) < 0)
          {
              WTCC.appendMessage('Unsupported character version ' + version);
              return;
          }
        },

    initPage: function() {
        $('#wtcc_config_textarea').text(WTCC.serializeXML(WTCC.config.xml));
        $('#wtcc_character_textarea').text(WTCC.serializeXML(WTCC.config.character));
    },

    serializeXML: function(node) {
      // TODO putting xmlns="http://www.w3.org/1999/xhtml" in code
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
    $("#wtcc_tabs").tabs();
    $("#wtc_list_info").sortable();
    $("#wtc_list_info").disableSelection();
});