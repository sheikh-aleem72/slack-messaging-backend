import mailQueue from "../queues/mailQueue.js";
import "../processors/mailProcessor.js";

export const addMailToMailQueue = async (emailData) => {
  try {
    await mailQueue.add(emailData);
    console.log("Mail added to mail queue");
  } catch (error) {
    console.log("Error from mail queue producer", error);
    throw error;
  }
};
