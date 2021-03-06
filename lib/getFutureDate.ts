import { default as ms } from 'ms';

export const getFutureDate = (amount: string, from?: Date): number => {
    const now = from
        ? from
        : new Date();
    const amountInMs = ms(amount);
    const futureDate = now.getTime() + amountInMs;

    return new Date().setTime(futureDate);
};
