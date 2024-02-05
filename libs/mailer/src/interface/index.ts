export interface IMailerPayload {
  to: string
  content: { subject: string; text: string }
}

export interface IMailerProvider {
  send(payload: IMailerPayload): Promise<void>
}

export type MailerType = 'gmail'
