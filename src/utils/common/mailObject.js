import { APP_LINK,MAIL_ADD } from "../../config/serverConfig.js";

export const workspaceJoinMail = (workspace) => {
  return {
    from: MAIL_ADD,
    subject: "You have been added to workspace",
    text: `Congratulations! You have been added to ${workspace.name}`,
  };
};

export const verifyEmailMail = (verificationToken) => {
  return {
    from: MAIL_ADD,
    subject: "Welcome to the app. Please verify your email",
    text: `
    Welcome to the app. Please verify you mail by clicking the link below:

    ${APP_LINK}/verify/${verificationToken}
    `,
  };
};
