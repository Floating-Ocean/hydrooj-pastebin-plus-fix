const { db } = global.Hydro.service; // 数据库连接
const coll = db.collection('paste');

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function toUTC8Date(utc){
    const utcDate = new Date(utc + " UTC");
    const utc8Date = new Date(utcDate.toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false }));
    return utc8Date;
}

async function add(userId, username, title, content, isprivate) {
    const pasteId = String.random(32); // Hydro提供了此方法，创建一个长度为32的随机字符串
    // 使用 mongodb 为数据库驱动，相关操作参照其文档
    var d = new Date(),	str = '';
    str = dateFormat("YYYY-mm-dd HH:MM:SS", d);
    const result = await coll.insertOne({
        _id: pasteId,
        title,
        owner: userId,
        user: username,
        time: str,
        content,
        isprivate,
    });
    return result.insertedId; // 返回插入的文档ID
}

async function edit(pasteID, userId, title, content, isprivate) {
    await coll.updateOne({
            _id: pasteID,
        },
        {
            $set:{
                "title": title,
                "owner": userId,
                "content": content,
                "isprivate": isprivate,
            }
        }
    );
}

async function get(pasteId) {
    const result = await coll.findOne({ _id: pasteId });
    if (result === undefined){
        return result;
    }
    result.date = toUTC8Date(result.time);
    result.time = dateFormat("YYYY-mm-dd HH:MM:SS", result.date);
    return result;
}

async function getUserPaste(userId) {
    var result = await coll.find({ "owner": Number.parseInt(userId) }).sort({ time: -1 }).toArray();
    result.forEach((item, index, array) => {
        array[index].date = toUTC8Date(array[index].time);
        array[index].time = dateFormat("YYYY-mm-dd HH:MM:SS", array[index].date);
    });
    return result;
}


async function del(_Id) {
    return await coll.deleteOne({ _id: _Id });
}

global.Hydro.model.pastebin = module.exports = { add, get, getUserPaste, del, edit };
