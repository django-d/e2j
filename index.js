'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var XLSX = require('xlsx');

/**
 * excel filename or workbook to json
 * @param fileName
 * @param headRow
 * @param valueRow
 * @returns {{}} json
 */
var toJson = function (fileName, headRow, valueRow) {
    var workbook;
    if (typeof fileName === 'string') {
        if (fileName.indexOf('~') >= 0) return
        workbook = XLSX.readFile(fileName);
    } else {
        workbook = fileName;
    }
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // json to return
    var json;
    var curRow = 0;
    var [isKey, keys, content, total] = getExcelColInfo(worksheet);

    console.log(isKey, keys, content);

    // 是一个对象
    if (isKey) {
        json = {};
        keys.forEach((v, i) => {
            json[v] = {};
            var ks = Object.keys(content);
            ks.forEach(k => {
                var obj = content[k];
                var value = getVauleByType(obj.type, obj.value[i]);
                json[v][obj.key] = value
            });

        });
    } else {
        json = [];
        var ks = Object.keys(content);
        for (let i = 0; i < total; i++) {
            var o = {}
            ks.forEach(k => {
                var obj = content[k];
                var value = getVauleByType(obj.type, obj.value[i]);
                o[obj.key] = value
            });
            json.push(o);
        }
    }

    console.log('json:', json);
    return json;
};


function getVauleByType(type, value) {
    var v;
    if (type === 'int') {
        return v = Number(value);
    }

    if (type === 'string') {
        return v = value + '';
    }

    if (type === 'bool') {
        return v = Boolean(value)
    }

    if (type === 'array') {
        var isArray = value[0] === '[' && value[value.length - 1] === ']';
        if (!isArray) throw new Error('错误的array类型')
        if (value === '[]') v = [];
        else {
            v = value.substring(1, value.length - 1).split(',');
            if (v) {
                v = v.map(vv => {
                    var isNumber = /(\d+)/.test(vv)
                    if (isNumber) return Number(vv);
                    return vv;
                })
            }
        }
        return v
    }

    if (type === 'object') {
        var isObj = value[0] === '{' && value[value.length - 1] === '}';
        if (!isObj) throw new Error('错误的object类型');
        if (value === '{}') v = {};
        else {
            v = {};
            var arr = value.substring(1, value.length - 1).split(',');
            for (const a of arr) {
                var kv = a.split(':');
                var isNumber = /(\d+)/.test(kv[1])
                if (isNumber) kv[1] = Number(kv[1]);
                v[kv[0]] = kv[1];
            }
        }
        return v
    }
}


function getExcelColInfo(worksheet) {
    var keys = [];
    var isKey = false;
    var content = {}
    var total = 0;
    for (var key in worksheet) {
        if (worksheet.hasOwnProperty(key)) {
            var cell = worksheet[key];
            var match = /([A-Z]+)(\d+)/.exec(key);
            if (!match) {
                continue;
            }

            var ge = match[0]; // ABCD
            var col = match[1]; // ABCD
            var row = match[2]; // 1234
            var value = cell.v;
            if (ge === 'A3') {
                isKey = value === '$key'
            }

            if (col === 'A' && Number(row) > 3) {
                keys.push(value);
            }

            if (col !== 'A') {
                if (!content[col]) content[col] = {}

                if (row == 1) {
                    content[col]['desc'] = value;
                } else if (row == 2) {
                    content[col]['type'] = value;
                } else if (row == 3) {
                    content[col]['key'] = value;
                } else {
                    if (!content[col]['value']) content[col]['value'] = []
                    content[col]['value'].push(value);
                    if (total < content[col]['value'].length) {
                        total = content[col]['value'].length
                    }
                }
            }
        }
    }
    return [isKey, keys, content, total];
}


module.exports = function (options) {
    options = options || {};
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var arr = [];
        for (var i = 0; i < file.contents.length; ++i) arr[i] = String.fromCharCode(file.contents[i]);
        var bString = arr.join("");

        /* Call XLSX */
        var workbook = XLSX.read(bString, {
            type: "binary"
        });
        file.contents = new Buffer(JSON.stringify(toJson(workbook, options.headRow || 1, options.valueRowStart || 2)));

        if (options.trace) {
            console.log("convert file :" + file.path);
        }
        this.push(file);
        cb();
    });
};