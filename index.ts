import { Handler, Types, ObjectID, Context, PRIV, param, 
    CreateError as Err, NotFoundError, RecordNotFoundError, ForbiddenError, ValidationError } from 'hydrooj';

const record = global.Hydro.model.record;
const user = global.Hydro.model.user;
const pastebin = global.Hydro.model.pastebin;

export const PasteAuthorMismatchError = Err('PasteAuthorMismatchError', ForbiddenError, 'You are not the author of this paste.');
export const PasteNotFoundError = Err('PasteNotFoundError', NotFoundError, 'Paste {1} not found.');
export const RecordAuthorMismatchError = Err('RecordAuthorMismatchError', ForbiddenError, 'You are not the author of this record.');


class PasteCreateHandler extends Handler {

    @param('rid', Types.ObjectId, true)
    async get(domainId: string, rid: ObjectID) {
        this.response.template = 'paste_create.html';
        this.response.body = {udoc: {}, rdoc: {_id: "-1"}};

        if (!rid) return;

        const rdoc = await record.get(domainId, rid);
        if (!rdoc) throw new RecordNotFoundError(rid);
        if (rdoc.uid !== this.user._id) throw new RecordAuthorMismatchError(rid);  // 防止本功能成为偷看代码的漏洞

        let [udoc] = await Promise.all([
            user.getById(domainId, rdoc.uid),
        ]);

        this.response.body.udoc = udoc;
        this.response.body.rdoc = rdoc;
    }

    @param('title', Types.String)
    @param('content', Types.Content)
    @param('isprivate', Types.Boolean)
    async post(_: string, title: string, content: string, isprivate: boolean) {
        if (content.length == 0) {
            throw new ValidationError('content');
        }
        var pasteid = await pastebin.add(this.ctx, this.user._id, title, content, isprivate);
        // 重定向到创建完成的url
        this.response.redirect = this.url('paste_detail', { id: pasteid });
    }
}

class PasteEditHandler extends Handler {

    @param('id', Types.String)
    async get(_: string, id: string) {
        const ddoc = await pastebin.get(this.ctx, id);
        if (!ddoc) throw new PasteNotFoundError(id);
        if (this.user._id != ddoc.owner) {
            if (ddoc.isprivate) throw new PasteNotFoundError(id);
            else throw new PasteAuthorMismatchError();
        }
        this.response.body = {ddoc};
        this.response.template = 'paste_edit.html';
    }

    @param('pasteid', Types.String)
    @param('title', Types.String)
    @param('content', Types.Content)
    @param('isprivate', Types.Boolean)
    async post(_: string, pasteid: string, title: string, content: string, isprivate: boolean) {
        if (content.length == 0){
            throw new ValidationError('content');
        }
        await pastebin.edit(this.ctx, pasteid, this.user._id, title, content, isprivate);
        this.response.redirect = this.url('paste_detail', { id: pasteid });
    }
}

class PasteDeleteHandler extends Handler {

    @param('id', Types.String)
    async get(_: string, id: string) {
        const ddoc = await pastebin.get(this.ctx, id);
        if (!ddoc) throw new PasteNotFoundError(id);
        if (this.user._id != ddoc.owner) {
            if (ddoc.isprivate) throw new PasteNotFoundError(id);
            else throw new PasteAuthorMismatchError();
        }
        this.response.body = {ddoc};
        this.response.template = 'paste_delete.html';
    }

    @param('pasteid', Types.String)
    async post(_: string, pasteid: string) {
        await pastebin.del(this.ctx, pasteid);
        this.response.redirect = this.url('paste_manage');
    }
}

class PasteDetailHandler extends Handler {

    @param('id', Types.String)
    async get(domainId: string, id: string) {
        const ddoc = await pastebin.get(this.ctx, id);
        if (!ddoc) throw new PasteNotFoundError(id);
        if (ddoc.isprivate) {
            if(!this.user || this.user._id != ddoc.owner) throw new PasteNotFoundError(id);
        }
        const udict = await user.getList(domainId, [ddoc.owner]);
        this.response.body = { ddoc, udict };
        this.response.template = 'paste_detail.html';
    }
}

class PasteManageHandler extends Handler {

    async get() {
        const ddoc = await pastebin.getUserPaste(this.ctx, this.user._id);
        this.response.body = { ddoc };
        this.response.template = 'paste_manage.html';
    }
}

export async function apply(ctx: Context) {
    ctx.Route('paste_create', '/paste/create', PasteCreateHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_manage', '/paste/manage', PasteManageHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_detail', '/paste/detail/:id', PasteDetailHandler);
    ctx.Route('paste_edit', '/paste/detail/:id/edit', PasteEditHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_delete', '/paste/detail/:id/delete', PasteDeleteHandler, PRIV.PRIV_USER_PROFILE);
}