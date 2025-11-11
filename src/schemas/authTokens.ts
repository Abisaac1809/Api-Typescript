import { z } from "zod";

export const AccessTokenPayload = z.object({
    userId: z.string(),
})
export type AccessTokenPayloadType = z.infer<typeof AccessTokenPayload>;

export const RefreshTokenPayload = z.object({
    userId: z.string(),
    jti: z.string(),
})
export type RefreshTokenPayloadType = z.infer<typeof RefreshTokenPayload>;