import {Context, Handler, DocumentNotFoundError} from 'hydrooj' // 注册路由所用工具
const { PRIV } = global.Hydro.model.builtin; // 内置 Privilege 权限节点
const pastebin = global.Hydro.model.pastebin; // 刚刚编写的pastebin模型
import {
    CreateError as Err, NotFoundError, ForbiddenError, ValidationError
} from '@hydrooj/framework';

export const AuthorMismatchError = Err('AuthorMismatchError', ForbiddenError, 'You are not the author of this paste.');
export const PasteNotFoundError = Err('PasteNotFoundError', ForbiddenError, 'Paste {1} not found.');


class PasteCreateHandler extends Handler {
    async get() {
        this.response.template = 'paste_create.html';
    }

    async post({
        title , 
        content , 
        isprivate,
    }) {
        if(content.length == 0){
            throw new ValidationError('content')
        }
        var p;
        if(isprivate==="on"){
            p=true;
        }
        else{
            p=false;
        }
        var pasteid = await pastebin.add(this.user._id, this.user.uname, title, content, p);
        // 将用户重定向到创建完成的url
        this.response.redirect = this.url('paste_show', { id: pasteid });
    }
}

class PasteEditHandler extends Handler {
    async get({ id }) {
        const doc = await pastebin.get(id);
        if(!doc) throw new PasteNotFoundError(id);
        if(this.user._id!=doc.owner){
            if(doc.isprivate) throw new PasteNotFoundError(id);
            else throw new AuthorMismatchError();
        }
        this.response.body = {doc};
        this.response.template = 'paste_edit.html';
    }

    async post({
        pasteid ,
        title , 
        content , 
        isprivate ,
    }) {
        if(content.length == 0){
            throw new ValidationError('content')
        }
        var p;
        if(isprivate==="on"){
            p=true;
        }
        else{
            p=false;
        }
        await pastebin.edit(pasteid,this.user._id, title, content, p);
        this.response.redirect = this.url('paste_show', { id: pasteid });
    }
}

class PasteDeleteHandler extends Handler {
    async get({ id }) {
        const doc = await pastebin.get(id);
        if(!doc) throw new PasteNotFoundError(id);
        if(this.user._id!=doc.owner){
            if(doc.isprivate) throw new PasteNotFoundError(id);
            else throw new AuthorMismatchError();
        }
        this.response.body = {doc};
        this.response.template = 'paste_delete.html';
    }

    async post({
        pasteid ,
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

export async function apply(ctx: Context) {
    ctx.Route('paste_create', '/paste/create', PasteCreateHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_manage', '/paste/manage', PasteManageHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_show', '/paste/show/:id', PasteShowHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_edit', '/paste/show/:id/edit', PasteEditHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_delete', '/paste/show/:id/delete', PasteDeleteHandler, PRIV.PRIV_USER_PROFILE);
}