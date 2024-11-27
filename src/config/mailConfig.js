import nodemailer from "nodemailer";

import { MAIL_ADD, MAIL_PASS } from "./serverConfig.js";

export default nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: MAIL_ADD,
    pass: MAIL_PASS,
  },
});
