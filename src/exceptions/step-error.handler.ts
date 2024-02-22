import { StepProcessHandledException } from './step-process-handled.exception';
import { PROCESS_STEPS } from './steps.constants';

export function handleStepError(error: unknown, step: PROCESS_STEPS): StepProcessHandledException {
  if (!(error instanceof StepProcessHandledException)) {
    const castedError = error as Error;
    const errorMessage = `Unhandled error ${castedError.message}`;
    return new StepProcessHandledException(errorMessage, step);
  }
  return error;
}
