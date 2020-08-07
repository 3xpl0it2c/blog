export const retry = <T>(
    toRetry: () => T,
    times: number,
    baseCase?: (x: T) => boolean,
): T | false => {
    if (!baseCase) baseCase = (x) => !(x instanceof Error) && !!x;

    try {
        const check = toRetry();

        if (baseCase(check)) {
            return check;
        }

        throw new Error('');
    } catch (why) {
        return times > 0
            ? retry(toRetry, times - 1, baseCase)
            : false;
    }
};

