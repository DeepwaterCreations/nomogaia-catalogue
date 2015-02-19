function makeSelect2(select,backingList){
    select.select2({
        data: backingList,
        tags: true
    });
}


function initFields(dataOptions) {
    makeSelect2($("#catalogSelect"), dataOptions.getColumnOptions("Catalog"));
    makeSelect2($("#categorySelect"), dataOptions.getColumnOptions("Category"));
    makeSelect2($("#subcategorySelect"), dataOptions.getColumnOptions("Sub-Category"));
    makeSelect2($("#moduleSelect"), dataOptions.getColumnOptions("Module"));
}