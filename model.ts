import { moment, randomstring, Context } from 'hydrooj';

interface Paste {
    _id: string;
    content: string;
    owner: number;
    title: string;
    updateAt: Date;
    isprivate: boolean;
    time: string; // @deprecated
}

declare module 'hydrooj' {
    interface Model {
        pastebin: typeof PasteModel;
    }
    interface Collections {
        paste: Paste;
    }
}

const PasteModel = { add, get, getUserPaste, del, edit };
global.Hydro.model.pastebin = PasteModel;

async function add(ctx: Context, owner: number, title: string, content: string, isprivate: boolean) {
    const pasteId = randomstring();
    const updateAt = new Date();
    const result = await ctx.db.collection('paste').insertOne({
        _id: pasteId,
        content: content,
        owner: owner,
        title: title,
        updateAt: updateAt,
        isprivate: isprivate,
        time: moment(updateAt).tz('Asia/Shanghai').format("YYYY-MM-DD HH:mm:ss") // 兼容旧版本数据
    });
    return result.insertedId; // 插入文档的ID
}

async function edit(ctx: Context, _id: string, owner: number, title: string, content: string, isprivate: boolean) {
    await ctx.db.collection('paste').updateOne({ _id }, {
        $set: {
            content: content,
            owner: owner,
            title: title,
            updateAt: new Date(),
            isprivate: isprivate,
        }
    });
}

async function get(ctx: Context, _id: string) {
    const result = await ctx.db.collection('paste').findOne({ _id });
    if (!result) {
        return undefined;
    }
    if (result.updateAt === undefined) {
        result.updateAt = new Date(result.time);
    }
    return result;
}

async function getUserPaste(ctx: Context, owner: number) {
    const result = await ctx.db.collection('paste').find({ owner }).toArray();
    // 兼容老版本
    const fixedResult = result.map(item => {
        if (!item.updateAt) {
            return { ...item, updateAt: new Date(item.time) }
        }
        return { ...item }
    }).sort((a, b) => b.updateAt.getTime() - a.updateAt.getTime());
    return fixedResult;
}

async function del(ctx: Context, _id: string) {
    return await ctx.db.collection('paste').deleteOne({ _id });
}
