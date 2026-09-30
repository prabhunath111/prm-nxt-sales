/**
 * Throws an error indicating that a value is of type never.
 * Use this function to assert that a value is never expected to occur.
 * @param x The value expected to be never.
 * @returns Throws an error indicating the unexpected value.
 * @throws Throws an error with a message indicating the unexpected value.
 */
export const assertNever = (x: never): never => {
  throw new Error(`Unexpected object: ${x}`);
};
