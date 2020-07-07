import { compose } from './compose';

type x = (str: string) => string;

test('compose', () => {
    const func1: x = (value) => `Hello, ${value}`;
    const func2: x = (value) => `${value}\nI am a program`;
    const test = func2(
        func1('world !'),
    );

    expect(compose(
        'world !',
        func1,
        func2,
    )).toBe(test);
});
