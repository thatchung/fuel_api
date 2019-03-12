class My_queue {
    static init() {
        this.instance = [];
    }

 	get instance() {
        return this._instance;
    };

    static getData() {
        return this.instance;
    }

    static getSize() {
        return this.instance.length;
    }

    static async push(obj) {
        this.instance.push(obj);
        return this.instance;
    }

    static async get(number){
    	let kqarr = [];
       	if(number > 0 && number <= this.instance.length)
       	{
       		for(let i=0;i<number;i++){
       			// kqarr.push(this.instance.shift());
       			let item = this.instance.shift();
       			kqarr.push({"index": {
	                "_index": "log",
	                "_type": "log",
	                "_id": item.id
	            }});
	            kqarr.push(item)
       		}
       	}
        return kqarr;
    }

}

module.exports = My_queue;