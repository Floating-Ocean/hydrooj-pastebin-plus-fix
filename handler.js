import {Handler, param, Types, RecordNotFoundError} from 'hydrooj' // 注册路由所用工具
import {
    CreateError as Err, NotFoundError, ForbiddenError, ValidationError
} from '@hydrooj/framework';

const record = global.Hydro.model.record;
const user = global.Hydro.model.user;
const { PRIV } = global.Hydro.model.builtin; // 内置 Privilege 权限节点
const pastebin = global.Hydro.model.pastebin; // 刚刚编写的pastebin模型

export const PasteAuthorMismatchError = Err('PasteAuthorMismatchError', ForbiddenError, 'You are not the author of this paste.');
export const PasteNotFoundError = Err('PasteNotFoundError', NotFoundError, 'Paste {1} not found.');
export const RecordAuthorMismatchError = Err('RecordAuthorMismatchError', ForbiddenError, 'You are not the author of this record.');


class PasteCreateHandler extends Handler {

    @param('rid', Types.ObjectId, true)
    async get(domainId, rid = -1) {
        this.response.template = 'paste_create.html';
        this.response.body = {udoc: {}, rdoc: {_id: "-1"}};

        if(rid === -1) return;

        const rdoc = await record.get(domainId, rid);
        if (!rdoc) throw new RecordNotFoundError(rid);
        if (rdoc.uid !== this.user._id) throw new RecordAuthorMismatchError(rid);  // 防止本功能成为偷看代码的漏洞

        let [udoc] = await Promise.all([
            user.getById(domainId, rdoc.uid),
        ]);

        this.response.body.udoc = udoc;
        this.response.body.rdoc = rdoc;
    }

    async post({
        title, 
        content, 
        isprivate,
    }) {
        if(content.length == 0){
            throw new ValidationError('content');
        }
        const p = isprivate === "on" ? true : false;
        var pasteid = await pastebin.add(this.user._id, this.user.uname, title, content, p);
        // 将用户重定向到创建完成的url
        this.response.redirect = this.url('paste_show', { id: pasteid });
    }
}

class PasteEditHandler extends Handler {

    async get({ id }) {
        const doc = await pastebin.get(id);
        if(!doc) throw new PasteNotFoundError(id);
        if(this.user._id != doc.owner){
            if(doc.isprivate) throw new PasteNotFoundError(id);
            else throw new AuthorMismatchError();
        }
        this.response.body = {doc};
        this.response.template = 'paste_edit.html';
    }

    async post({
        pasteid,
        title, 
        content, 
        isprivate,
    }) {
        if(content.length == 0){
            throw new ValidationError('content');
        }
        const p = isprivate === "on" ? true : false;
        await pastebin.edit(pasteid,this.user._id, title, content, p);
        this.response.redirect = this.url('paste_show', { id: pasteid });
    }
}

class PasteDeleteHandler extends Handler {

    async get({ id }) {
        const doc = await pastebin.get(id);
        if(!doc) throw new PasteNotFoundError(id);
        if(this.user._id != doc.owner){
            if(doc.isprivate) throw new PasteNotFoundError(id);
            else throw new AuthorMismatchError();
        }
        this.response.body = {doc};
        this.response.template = 'paste_delete.html';
    }

    async post({
        pasteid,
    }) {
        await pastebin.del(pasteid);
        this.response.redirect = this.url('paste_manage');
    }
}

class PasteShowHandler extends Handler {

    async get({ id }) {
        const doc = await pastebin.get(id);
        if (!doc) throw new PasteNotFoundError(id);
        if(doc.isprivate){
            if(this.user._id!=doc.owner)throw new PasteNotFoundError(id);
        }
        this.response.body = { doc };
        this.response.template = 'paste_show.html';
    }
}

class PasteManageHandler extends Handler {

    async get() {
        const doc = await pastebin.getUserPaste(this.user._id);
        this.response.body = { doc };
        this.response.template = 'paste_manage.html';
    }
}

export async function apply(ctx) {
    ctx.Route('paste_create', '/paste/create', PasteCreateHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_manage', '/paste/manage', PasteManageHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_show', '/paste/show/:id', PasteShowHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_edit', '/paste/show/:id/edit', PasteEditHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_delete', '/paste/show/:id/delete', PasteDeleteHandler, PRIV.PRIV_USER_PROFILE);
}