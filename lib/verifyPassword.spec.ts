import { verifyPassword } from './verifyPassword';
import { hash } from 'argon2';

describe('Verify Password functionality', () => {
    test('No original password, no candidate, return false', async () => {
        const originalPassword = '';
        const passwordCandidate = '';
        const result = await verifyPassword(
            originalPassword,
            passwordCandidate,
        );

        expect(result).toStrictEqual([
            false,
            '',
        ]);
    });

    test('Original password, no candidate, return false', async () => {
        const originalPassword = '1234Password';
        const passwordCandidate = '';
        const hashedPassword = await hash(originalPassword);
        const result = await verifyPassword(hashedPassword, passwordCandidate);
        expect(result).toStrictEqual([false, '']);
    });
});
