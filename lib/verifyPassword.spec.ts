import { verifyPassword } from './verifyPassword';
import { hash } from 'argon2';

describe('Verify Password functionality', () => {
    test('No original password and no password candidate, return false', () => {
        const originalPassword = '';
        const passwordCandidate = '';

        expect(verifyPassword(originalPassword, passwordCandidate)).toBe([false, '']);
    });

    test('With original password and no password candidate, return false', async () => {
        const originalPassword = '1234Password';
        const passwordCandidate = '';
        const hashedPassword = await hash(originalPassword);
        const result = await verifyPassword(hashedPassword, passwordCandidate);
        expect(result).toBe([false, '']);
    });
});
