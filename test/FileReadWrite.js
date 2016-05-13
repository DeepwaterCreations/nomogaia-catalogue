SaveLoad = function () {
}

var fs = require('fs');
var gui = require('nw.gui');
var path = require('path');
require('events').EventEmitter;

//Keep track of the current file.
var FilenameRememberer = (function () {
    var title = "NomoGaia Catalog";

    var filename = "";
    var dirty = false;

    return {
        setFilename: function (newFilename) {
            if (filename !== newFilename) {
                filename = newFilename;
                $("title").empty();
                var newTitle = title + " - " + filename;
                $("title").append(newTitle);
            }

        },

        getFilename: function () {
            return filename;
        },

        setDirty: function () {
            if (filename) {
                dirty = true;
                $("title").empty();
                var newTitle = title + " - " + filename + "*";
                $("title").append(newTitle);
            }
        },

        setClean: function () {
            if (filename) {
                dirty = false;
                $("title").empty();
                var newTitle = title + " - " + filename;
                $("title").append(newTitle);
            }
        },

        getIsDirty: function () {
            return dirty;
        }
    };
}());

//Enabling ctrl-s to save
var keyboardCommand = new gui.Shortcut({
    key: "Ctrl+S",
    active: function () {
        filename = FilenameRememberer.getFilename();
        if (filename) {
            //If we already have a filename, save to the existing file.
            save(filename, function (error) {
                if (error)
                    console.log("ERROR: ", error);
                else {
                    FilenameRememberer.setClean();
                    console.log("Finished saving");
                }
            });
        }
        else {
            //Otherwise, open the dialog to select a new filename.
            $('#save').click();
        }
    }
});
gui.App.registerGlobalHotKey(keyboardCommand);

//We need to bind and unbind the shortcut when the window loses and gains focus, otherwise
//we'll steal Ctrl-S from other programs!
var win = gui.Window.get();
win.on('focus', function(){
    gui.App.registerGlobalHotKey(keyboardCommand);
});
win.on('blur', function () {
    gui.App.unregisterGlobalHotKey(keyboardCommand);
});


//What we're basically doing with these is using the button's onClick to trigger the (hidden) file input's onClick. That way, we get the dialog but not the
//standard filepath-and-"choose-file"-button UI element from the file input. See https://github.com/nwjs/nw.js/wiki/File-dialogs
$('#save').click(function () {
    var fileDialog = $("#saveFileDialog");
    fileDialog.on("change", function (event) {
        var filename = $(this).val();
        SaveLoad.save(filename, function (error) {
            if (error)
                console.log("ERROR: ", error);
            else {
                console.log("Finished saving");
                FilenameRememberer.setFilename(filename);
                FilenameRememberer.setClean();
            }
        });
    });
    fileDialog.trigger("click");
});

var forceLoad = false;
$('#load').click(function () {
    //First, warn the user about unsaved changes.
    if (FilenameRememberer.getIsDirty() && !forceLoad) {
        $("#loadConfirmationDialog").dialog({
            buttons: [
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Load",
                    click: function () {
                        forceLoad = true;
                        $('#load').click();
                        $(this).dialog("close");
                    }
                }
            ]
        });
        $(".ui-dialog").find("button").addClass("blueButton");

        return; //We'll call this function again and bypass this condition if we want to load after all. 
    }

    forceLoad = false;
    var fileDialog = $("#loadFileDialog");
    fileDialog.on("change", function (event) {
        var filename = $(this).val();
        if (!filename) return; //Maybe the user didn't specify a value.


        SaveLoad.load(filename);

        $(this).val(""); //Reset the filepath so that the event will be called again.
    });

    fileDialog.trigger("click");
});


SaveLoad.autosave = function (interval) {
    window.setTimeout(function () {
        console.log("Autosave Triggered!");
        SaveLoad.save(RecentFiles.getAutoSaveName());
        SaveLoad.autosave(interval);
    }, interval);
}

SaveLoad.save= function(filename, callback) {
    var saveobj = {};
    saveobj.monitortables = monitorTables.toOut();
    saveobj.dataoptions = DataOptions.toOut();
    fs.writeFile(filename, JSON.stringify(saveobj), callback);
    RecentFiles.push(filename);
}

SaveLoad.load = function (filename, callback) {
    //Make a loading bar dialog
    $("#loadingBarDialog").dialog({
        dialogClass: "no-close",
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false
    });
    $("#loadingBar").progressbar({
        value: false //It should be an indeterminate progress bar until a file is loaded.
    });


    fs.readFile(filename, function (error, chunk) {
        if (error) {
            console.out("ERROR: ", error);
            return;
        }

        //TODO: We need to test this thoroughly! I'm not convinced that this will work properly for all valid data inputs.
        var obj = jQuery.parseJSON(chunk);
        var barMax = 0;//obj.length * obj[obj.length - 1].backingData.length; //The number of monitors times the number of rows in the last monitor.
        for (var i = 0; i < obj.monitortables.monitors.length; i++) {
            barMax += obj.monitortables.monitors[i].backingData.length;
        }

        $("#loadingBar").progressbar("option", "max", barMax);
        $("#loadingBar").progressbar("value", 0);

        DataOptions.loadCustom(obj.dataoptions)
        monitorTables.loadFile(obj.monitortables);
        //$("#loadingBarDialog").dialog("destroy");

        //Update the current filename to the loaded file's name.
        FilenameRememberer.setFilename(filename);
        FilenameRememberer.setClean();

    });
}