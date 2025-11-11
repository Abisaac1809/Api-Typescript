import { z } from "zod";

export const AccessTokenPayload = z.object({
    userId: z.string(),
    iat: z.string(),
    exp: z.number().positive
})
export type AccessTokenPayloadType = z.infer<typeof AccessTokenPayload>;

export const RefreshTokenPayload = z.object({
    userId: z.string(),
    jti: z.string(),
    exp: z.number().positive()
})
export type RefreshTokenPayloadType = z.infer<typeof RefreshTokenPayload>;