RecentFiles = function () {
}

RecentFiles.private = {}
var pathLib = require('path');
RecentFiles.private.currentAddress = pathLib.dirname(process.execPath);
RecentFiles.private.currentName = "untitled"
RecentFiles.private.title = "NomoGaia Catalog";
RecentFiles.private.dirty = false;

RecentFiles.get = function () {
    var recentFiles = localStorage.getItem("recentFiles");
    if (recentFiles == undefined || recentFiles == "") {
        recentFiles = [];
        localStorage.setItem("recentFiles", JSON.stringify(recentFiles));
    } else {
        recentFiles = JSON.parse(localStorage.getItem("recentFiles"));
    }
    return recentFiles;
}

RecentFiles.push = function (path, load) {
    // remove all files with a matching name from the list and autosave with the same file name
    var recentFiles = JSON.parse(localStorage.getItem("recentFiles"));
    for (var i = 0; i < recentFiles.length;) {
        if (pathLib.dirname(recentFiles[i].path) === pathLib.dirname(path) && (
           RecentFiles.getName(recentFiles[i].path) === RecentFiles.getName(path) || (
            RecentFiles.getName(recentFiles[i].path) === RecentFiles.getName(path) + "-autosave"
            ) && !load)) {
            recentFiles.splice(i, 1);
        } else {
            i++
        }
    }
    recentFiles.unshift(
        {
            path: path,
            name: RecentFiles.getName(path)
        }
    );
    if (pathLib.extname(path) === ".json") {
        RecentFiles.private.currentAddress = pathLib.dirname(path);
        RecentFiles.setCurrentFileName(RecentFiles.getName(path));
        $("title").empty();
        var newTitle = RecentFiles.private.title + " - " + RecentFiles.getCurrentFileName();
        $("title").append(newTitle);
        // do we want csv's to count as clean?? for now I think no
        RecentFiles.setClean();
    }
    // we only save the last 10
    localStorage.setItem("recentFiles", JSON.stringify(recentFiles.splice(0, 10)));
}

RecentFiles.getName = function (path) {
    var filename = path.replace(/^.*[\\\/]/, '');
    filename = filename.substr(0, filename.indexOf("."));
    return filename;
}

RecentFiles.getCurrentFileAddress = function () {
    return RecentFiles.private.currentAddress;
}

RecentFiles.getCurrentFileName = function () {
    return RecentFiles.private.currentName;
}

RecentFiles.setCurrentFileName = function (name) {
    if (name.endsWith("-autosave")) {
        name = name.substr(0, name.indexOf("-autosave"));
    }
    RecentFiles.private.currentName = name;
}

RecentFiles.getPath = function () {
    return pathLib.join(RecentFiles.private.currentAddress, RecentFiles.private.currentName + ".json")
}

RecentFiles.getAutoSaveName = function () {
    return pathLib.join(RecentFiles.private.currentAddress, RecentFiles.private.currentName + "-autosave.json")
}

RecentFiles.setDirty = function () {
    if (!RecentFiles.private.dirty) {
        RecentFiles.private.dirty = true;
        $("title").empty();
        var newTitle = RecentFiles.private.title + " - " + RecentFiles.getCurrentFileName() + "*";
        $("title").append(newTitle);
    }
}

RecentFiles.setClean = function () {
    if (filename) {
        RecentFiles.private.dirty = false;
        $("title").empty();
        var newTitle = RecentFiles.private.title + " - " + RecentFiles.getCurrentFileName();
        $("title").append(newTitle);
    }
}
RecentFiles.getIsDirty = function () {
    return RecentFiles.private.dirty;
}

