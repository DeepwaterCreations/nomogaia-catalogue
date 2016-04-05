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

    this.toString = function () {
        var res = "";
        if (this.catalog !== null) {
            res+=this.catalog;
        }
        if (this.category !== null) {
            res += this.category;
        }
        if (this.subCategory !== null) {
            res += this.subCategory;
        }
        if (this.topic !== null) {
            res += this.topic;
        }
        return res;
    }

    this.rollBackTo = function (str) {
        if (this.topic !== str) {
            this.topic = null;
            if (this.subCategory !== str) {
                this.subCategory = null;
                if (this.category !== str) {
                    this.category = null;
                    if (this.catalog !== str) {
                        this.catalog = null;
                    }
                }
            }
        }
    }
}