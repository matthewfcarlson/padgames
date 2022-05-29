import sg_mail from '@sendgrid/mail';
import { ApiEndpointRoot, ApiEndpoints } from '../common/endpoints';
import { DbUser } from './db/db_types';
const API_KEY = process.env.SENDGRID_API_KEY || ''
sg_mail.setApiKey(API_KEY)
export async function sendMagicCodeEmail(to:DbUser, code:string) {
    if (API_KEY == '') return false;
    const link = 'padgames.matthewc.dev/'+ApiEndpointRoot+ApiEndpoints.LOGIN_MAGIC+"?code="+code+"&id="+to._id
    const msg = {
        to:to.email,
        from: 'matt@padgames.matthewc.dev',
        subject: 'Your sign-in link for padgames',
        text: 'Sign into padgames with this link: '+link,
        html: `Sign in with <a href='${link}'>this link.</a>`
    }
    await sg_mail.send(msg);
    return true;
}