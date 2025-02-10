import { jest } from '@jest/globals';

export default function (data) {
    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            text: () => Promise.resolve(data),
        }),
    );
}