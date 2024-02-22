export class StepProcessHandledException extends Error {
  constructor(
    message: string,
    private stepName: string,
  ) {
    super(message);
    this.name = 'StepProcessHandledException';
    this.stepName = stepName;
  }

  getErrorMessage(): string {
    return `Error in ${this.stepName}: ${this.message} 
            Stack : ${this.stack}`;
  }
}
