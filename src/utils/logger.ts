export const logger = {
  info: (message: string, meta?: unknown) => {
    if (meta) {
      console.log(message, meta);
      return;
    }
    console.log(message);
  },
  error: (message: string, meta?: unknown) => {
    if (meta) {
      console.error(message, meta);
      return;
    }
    console.error(message);
  },
};
