import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'nakilnet.tr@gmail.com',
    pass: 'yzkBTMbWQODXtcF9',
  },
})

const mailOptions = {
  from: 'nakilnet.tr@gmail.com',
  to: 'nakilnet.tr@gmail.com',
  subject: 'Nakilnet Online Talep Formu',
  text: 'That was easy!',
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  mailOptions.text = req.body.email
  mailOptions.subject = req.body.name + ' - kargonet Online Talep Formu'
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      res.status(200).json({ message: 'OK' })

      console.log('Email sent: ' + info.response)
    }
  })
}
