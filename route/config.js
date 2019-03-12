const Route = require('../core/route');
const Types = require('../core/types');
const Elastic = require('../core/elastic');
const Util = require('../core/util');
const My_queue = require('../core/queue');
const moment = require('moment');

Route.get({
    url: '/log_info_fuel',
    summary: 'Lấy thông tin cấu hình',
    parameter: {
        arr:Types.string(),
        // avg: Types.string(),
        // al: Types.string(),
        // door: Types.string(),
        // fuel: Types.string(),
        // fuel_m: Types.string(),
        // fuel_p: Types.string(),
        // pwr: Types.string(),
        // hz: Types.string(),
        // sen: Types.string(),
        // v1: Types.string(),
        // v2: Types.string(),
    },
    response: Types.raw(),
    handle: async (control, route) => {
        let obj = Util.getLogObject(route.args.arr);
        console.log(obj);
        let res = await Elastic.init({"index": 'log_fuel'}).set("2131", obj);
        if (!res)
            throw {code: 'cache_fail', message: "cant set cache"};

        return "data.value";
    }
});

Route.get({
    url: '/add',
    parameter: {
        id:{
            required: true,
            type: Types.string({description: 'id', allowNull: false})
        },
        arr:Types.string(),
    },
    response: Types.raw(),
    handle: async (control, route) => {
        let now = moment.tz('Asia/Ho_Chi_Minh').unix();

        let obj = Util.getLogObject(route.args.arr);
        obj.id = route.args.id + now;
        obj.create_time = now;
        My_queue.push(obj);
        if(My_queue.getSize() >= 3){
            let data_es = await My_queue.get(3);
            let result = await Elastic.esBulk(data_es);
            return result;
        }
        return obj;
    }
});

Route.get({
    url: '/remove',
    parameter: {
        number:{
            required : true,
            type : Types.integer(),
        }
    },
    response: Types.raw(),
    handle: async (control, route) => {
        let ka = await My_queue.get(route.args.number);
        return ka;
    }
});