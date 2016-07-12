SaveLoad = function () {
}

var fs = require('fs');
var gui = require('nw.gui');
var path = require('path');
require('events').EventEmitter;

//Should be true if the file has been saved, (properly, not auto,) or if the file was loaded from the fs,
//which pretty strongly implies that it just maybe was saved at some point in the past.
SaveLoad.hasBeenSaved = false;

//Check if we have an existing filename to save to.
//If so, save directly. Otherwise, call saveAs.
SaveLoad.checkSave = function(){
    filename = RecentFiles.getPath();
    if (SaveLoad.hasBeenSaved && filename) {
        //If we already have a filename, save to the existing file.
        SaveLoad.save(filename, function (error) {
            if (error)
                console.log("ERROR: ", error.message);
            else {
                RecentFiles.setClean();
                console.log("Finished saving");
            }
        });
    }
    else {
        //Otherwise, open the dialog to select a new filename.
        SaveLoad.saveAs();
    }
};

//Enabling ctrl-s to save
var keyboardCommand = new gui.Shortcut({
    key: "Ctrl+S",
    active: SaveLoad.checkSave,
    failed: function(message){
        console.log("KEYBOARD SHORTCUT ERROR: " + message);
    }
});
gui.App.registerGlobalHotKey(keyboardCommand);

//We need to bind and unbind the shortcut when the window loses and gains focus, otherwise
//we'll steal Ctrl-S from other programs!
var win = gui.Window.get();
win.on('focus', function () {
    gui.App.registerGlobalHotKey(keyboardCommand);
});
win.on('blur', function () {
    gui.App.unregisterGlobalHotKey(keyboardCommand);
});


//What we're basically doing with these is using the button's onClick to trigger the (hidden) file input's onClick. That way, we get the dialog but not the
//standard filepath-and-"choose-file"-button UI element from the file input. See https://github.com/nwjs/nw.js/wiki/File-dialogs
SaveLoad.saveAs = function(isCSV){
    var file_extension = isCSV ? ".csv" : ".json";
    var fileDialog = $("#saveFileDialog");
    //Set the default filepath for the next save to match the current document
    fileDialog.attr({
        nwsaveas: RecentFiles.getCurrentFileName() + file_extension,
        nwworkingdir: RecentFiles.getCurrentFileAddress()
    });


    //Add an event handler that will trigger when the form's value is changed, which should happen
    //when a file path is chosen.
    //The event should only trigger once, so that we can reset the filename without triggering it again.
    fileDialog.one("change", function (event) {
        event.stopPropagation();

        var filename = $(this).val();
        //Reset the filename. Otherwise, the change event won't fire if we try to save to the same filename again.
        $(this).val("");
        
        if(filename === "")
            return;

        if(path.extname(filename) !== file_extension){
            filename = filename + file_extension;
            //Warn the user that we're appending a file extension.
            $("#saveFileTypeWarningDialog").dialog({
                autoOpen: false,
                buttons: [
                    {
                        text: "Ok",
                        click: function(){
                            $(this).dialog("close");
                        }
                    }
                ]
            });
            $("#saveFileTypeWarningDialog span").append("<span>" + path.basename(filename) + "</span>");
            $(".ui-dialog").find("button").addClass("blueButton");
            $("#saveFileTypeWarningDialog").dialog("open");
        }
        
        SaveLoad.save(filename, function (error) {
            if (error)
                console.log("ERROR: ", error);
            else {
                RecentFiles.setClean();
                SaveLoad.hasBeenSaved = true;
                console.log("Finished saving");
            }
        });
    });
    fileDialog.trigger("click");
};

//Check if the file is dirty + warn the user, then call the load functionality if they
//still want to go ahead.
SaveLoad.forceLoad = false;
SaveLoad.checkLoad = function(isCSV){
// $('#load').click(function () {
    //First, warn the user about unsaved changes.
    if (RecentFiles.getIsDirty() && !SaveLoad.forceLoad) {
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
                        SaveLoad.forceLoad = true;
                        SaveLoad.checkLoad(isCSV);
                        $(this).dialog("close");
                    }
                }
            ]
        });
        $(".ui-dialog").find("button").addClass("blueButton");

        return; //We'll call this function again and bypass this condition if we want to load after all. 
    }

    SaveLoad.forceLoad = false;

    var file_extension = isCSV ? ".csv" : ".json";
    var fileDialog = $("#loadFileDialog");
    //Set the dialog's file extension
    fileDialog.attr({
        accept: file_extension
    });

    fileDialog.on("change", function (event) {
        var filename = $(this).val();
        if (!filename) return; //Maybe the user didn't specify a value.


        SaveLoad.load(filename);

        $(this).val(""); //Reset the filepath so that the event will be called again.
    });

    fileDialog.trigger("click");
};

gui.Window.get().on('close', function () {
    var that = this;
    if (RecentFiles.getIsDirty() && !($("#splash").is(":visible"))) {
        $("#exitConfirmationDialog").dialog({
            buttons: [
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Exit",
                    click: function () {
                        forceLoad = true;
                        $('#load').click();
                        $(this).dialog("close");
                        that.close(true);
                    }
                }
            ]
        });
        $(".ui-dialog").find("button").addClass("blueButton");
    } else {
        that.close(true);
    }
});


SaveLoad.autosave = function (interval) {
    window.setTimeout(function () {
        if (RecentFiles.getIsDirty() && !($("#splash").is(":visible"))) {
            console.log("Autosave Triggered!");
            SaveLoad.save(RecentFiles.getAutoSaveName());
        }
        SaveLoad.autosave(interval);
    }, interval);
}

//Saves the file.
//Callback is necessary because we might not want the same behavior for
//autosaving as for when the user deliberately saves.
SaveLoad.save = function (filename, callback) {
    if (path.extname(filename) === ".json") {
        var saveobj = {};
        saveobj.monitortables = monitorTables.toOut();
        saveobj.dataoptions = DataOptions.toOut();
        fs.writeFile(filename, JSON.stringify(saveobj), callback);
        RecentFiles.push(filename, false);
    } else if (path.extname(filename) === ".csv") {
        var str = monitorTables.toCSV();
        fs.writeFile(filename, str, callback);
    } else {
        console.log("errror! save must be .json or .csv");
    }
}

// checks if the file exists and can be read/written
SaveLoad.checkFile = function (filename, onTrue, onFalse) {
    onTrue = onTrue || function () { };
    onFalse = onFalse || function () { };

    fs.access(filename, fs.R_OK | fs.W_OK, function (err) {
        if (!err) {
            onTrue();
        } else {
            onFalse();
        }
    });
}

SaveLoad.load = function (filename, callback) {
    //Make a loading bar dialog
    //$("#loadingBarDialog").dialog({
    //    dialogClass: "no-close",
    //    closeOnEscape: false,
    //    draggable: false,
    //    modal: true,
    //    resizable: false
    //});
    //$("#loadingBar").progressbar({
    //    value: false //It should be an indeterminate progress bar until a file is loaded.
    //});

    callback = callback || function () { }
    if (path.extname(filename) === ".json") {
        fs.readFile(filename, function (error, chunk) {
            if (error) {
                console.out("ERROR: ", error);
                return;
            }

            //TODO: We need to test this thoroughly! I'm not convinced that this will work properly for all valid data inputs.
            var obj = jQuery.parseJSON(chunk);

            DataOptions.loadCustom(obj.dataoptions)
            monitorTables.loadFile(obj.monitortables);
            RecentFiles.push(filename, true);
            SaveLoad.hasBeenSaved = true;
            callback();
        });
    } else if (path.extname(filename) === ".csv") {
        fs.readFile(filename, function (error, chunk) {
            if (error) {
                console.out("ERROR: ", error);
                return;
            }


            DataOptions.reset();
            monitorTables.loadCSV(chunk + "");
            RecentFiles.push(filename, true);
            callback();
        });
    } else {
        console.log("errror! load must be .json or .csv");
    }
    
   
}
