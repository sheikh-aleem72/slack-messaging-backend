import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1),
});

export const addMemberWorkspaceSchema = z.object({
  memberId: z.string(),
});

export const addChannelToWorkspaceSchema = z.object({
  channelName: z.string(),
});
