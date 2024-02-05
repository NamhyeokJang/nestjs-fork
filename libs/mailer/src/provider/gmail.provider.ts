import { Injectable, OnModuleInit } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import { IMailerPayload, IMailerProvider } from '../interface'
import { GmailConfig } from '../config'

@Injectable()
export class GmailProvider implements IMailerProvider, OnModuleInit {
  onModuleInit() {
    if (!GmailConfig.USER || !GmailConfig.PASS) {
      throw new Error(`GmailConfig required!`)
    }
  }

  async send(payload: IMailerPayload) {
    await new Promise((resolve, reject) => {
      createTransport({
        service: 'gmail',
        auth: {
          user: GmailConfig.USER,
          pass: GmailConfig.PASS,
        },
      }).sendMail(
        {
          from: GmailConfig.USER,
          to: payload.to,
          subject: payload.content.subject,
          text: payload.content.text,
        },
        (err, info) => {
          if (err) return reject(err)

          return resolve(info)
        },
      )
    })
  }
}
