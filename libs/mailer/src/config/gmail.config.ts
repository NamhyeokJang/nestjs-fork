import { get } from 'env-var'

export class GmailConfig {
  static readonly USER = get('MAILER_GMAIL_USER').asString()
  static readonly PASS = get('MAILER_GMAIL_PASS').asString()
}
