export interface ILogger {
    info(msg: any): void;
    warn(msg: any): void;
    error(msg: any): void;
  }

export class Logger implements ILogger {

    public info(msg: any) {
      console.info(msg);
    }

    public warn(msg: any) {
      console.warn(msg);
    }

    public error(msg: any) {
      console.error(msg);
    }

  }