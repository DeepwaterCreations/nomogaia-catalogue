//Returns a row UI object with a pleasant interface for editing row data.
var rowinputUIGen = function(rowData){
    var rowinput = {};
    
    // var input = data.input || '';
    // var source = data.source || '';
    // var rights = data.rights || [];
    // var rightsholders = data.rightsholders || [];
    // var score = data.score || undefined;

    //Private functions
    var getValue = function(val_name){
        return rowData.getData(val_name);
    };
    var setValue = function(val_name, value){
        return rowData.setData(val_name, value);
    };
    
    return rowinput;
};
