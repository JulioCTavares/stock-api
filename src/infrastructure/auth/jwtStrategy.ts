export interface IJWTStrategy {
    sign(payload: any): Promise<string>;
    verify(token: string): Promise<any>;
    decode(token: string): Promise<any>;
}