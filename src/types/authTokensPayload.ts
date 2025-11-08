export type AccessTokenPayload = {
    userId: string,
    iat: string,
    exp: number
};

export type RefreshTokenPayload = {
    jti: string,
    userId: string,
    exp: number
};