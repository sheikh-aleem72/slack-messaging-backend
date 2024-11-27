import { MAIL_ADD } from "../../config/serverConfig.js";

export const workspaceJoinMail = (workspace) => {
  return {
    from: MAIL_ADD,
    subject: "You have been added to workspace",
    text: `Congratulations! You have been added to ${workspace.name}`,
  };
};
