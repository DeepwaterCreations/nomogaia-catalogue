var fs = require('fs');

//What we're basically doing with these is using the button's onClick to trigger the (hidden) file input's onClick. That way, we get the dialog but not the
//standard filepath-and-"choose-file"-button UI element from the file input. See https://github.com/nwjs/nw.js/wiki/File-dialogs
$('#save').click(function () {
    var fileDialog = $("#saveFileDialog");
    fileDialog.on("change", function (event) {
        var filew = fs.createWriteStream($(this).val());
        filew.write(JSON.stringify(monitorTables.toOut()));
    });
    fileDialog.trigger("click");
});

$('#load').click(function () {
    var fileDialog = $("#loadFileDialog");
    fileDialog.on("change", function (event) {
        if (!($(this).val())) return; //Maybe the user didn't specify a value.

        var filer = fs.createReadStream($(this).val());
        filer.setEncoding('utf8');
        filer.on('data', function (chunk) {
            //TODO: We need to test this thoroughly! I'm not convinced that this will work properly for all valid data inputs.
            var obj = jQuery.parseJSON(chunk);
            monitorTables.clear();
            for (var i = 0; i < obj.length; i++) {
                monitorTables.push(createTableFromJSON(obj, i, monitorTables));
                $("#monitorNameField").val(obj[i].label) //Ensures the new tab gets the proper label.
                monitorTabs.addTab();
            }
        })

        $(this).val(""); //Reset the filepath so that the event will be called again.
    });

    fileDialog.trigger("click");
});