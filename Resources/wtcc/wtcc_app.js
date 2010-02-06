var WTCC = {

    loadDataXml: function(xml) {
        WTCC.config = xml;
        WTCC.jconfig = $(xml);
        WTCC.jconfig.find('config-choice').each(function() {
            var type = $(this).attr('type');
            var link = $(this).attr('link');
            WTCC.appendMessage(type + ': ' + link);
        });
        // TODO data validation

        WTCC.initPage();
    },
    
    appendMessage: function(msg) {
      $('<p>' + msg + '</p>').appendTo('#wtcc_tab_messages');
    },

    loadCharacterXml: function(xml) {

        },

    documentReady: function() {
        $.ajax({
            type: "GET",
            url: "wtcc/xml/WildTalentsCharacterCreatorData.xml",
            dataType: "xml",
            success: WTCC.loadDataXml
        });
    },

    initPage: function() {
        $('<p>hello</p>').appendTo('#wtcc_tab_info');
        $('#wtcc_config_textarea').text(WTCC.serializeXML(WTCC.config));
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