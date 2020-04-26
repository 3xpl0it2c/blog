// If the value exists in the ENV, then use that.
// Otherwise - use what's inside the config.
export default (key: string, value: any): any => {
    if (!!value) return value;

    return !!process.env[`NODE_${key.toUpperCase()}`]
        ? process.env[`NODE_${key.toUpperCase()}`]
        : value;
};
