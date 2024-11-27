import mailQueue from "../queues/mailQueue.js";
import mailer from "../config/mailConfig.js";
import { response } from "express";

mailQueue.process(async (job) => {
  const emailData = job.data;
  console.log("Processing mail", emailData);
  try {
    const resonse = await mailer.sendMail(emailData);
    console.log("Email sent", response);
  } catch (error) {
    console.log("Error while sending email from email processor", error);
  }
});
