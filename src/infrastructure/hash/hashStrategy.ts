export interface IHashStrategy {
    hash(data: string): Promise<string>;
    verify(data: string, hash: string): Promise<boolean>;
}