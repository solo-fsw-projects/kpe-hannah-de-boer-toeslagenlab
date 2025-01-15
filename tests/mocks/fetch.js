module.exports = function (data) {
    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            text: () => Promise.resolve(data),
        }),
    );
}