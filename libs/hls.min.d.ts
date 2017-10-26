/**
 * Created by yangfan on 2016/9/12.
 */
// Type definitions for hls.js 0.6.2-6
// Project: LivePlayer
// Definitions by: yangfan

export = HLS;
declare class HLS {
    public static Events: any;
    public static ErrorTypes: any;
    public static isSupported();//ms不声明亦不影响运行，只是在使用时tslint会提示错误。

    constructor(someParam?: string);
    public attachMedia(video: HTMLVideoElement): void;
    public on(type: string, handler: any): void;
    public loadSource(url: string): void;
    public startLoad(): void;
    public recoverMediaError(): void;
    public destroy(): void;
}