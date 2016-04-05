function Adress() {
    this.catalog = null;
    this.category = null;
    this.subCategory = null;
    this.topic = null;

    this.append = function (str) {
        if (this.catalog === null) {
            this.catalog = str;
        } else if (this.category === null) {
            this.category = str;
        } else if (this.subCategory === null){
            this.subCategory = str;
        } else if (this.topic === null) {
            this.topic = str;
        }
    }

    this.up = function () {
        if (this.topic !== null) {
            this.topic = null
        } else if (this.subCategory !== null) {
            this.subCategory = null
        } else if (this.category !== null) {
            this.category = null
        } else if (this.catalog !== null) {
            this.catalog = null
        }
    }

    this.home = function () {
        this.catalog = null;
        this.category = null;
        this.subCategory = null;
        this.topic = null;
    }
}