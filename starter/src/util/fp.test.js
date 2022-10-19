import { unique } from "./fp";

describe(`removing duplicates from an array`, () => {
    it(`remove duplicates numbers`, () => {
        const arr = [1, 2, 2, 3, 5, 5, 5];
        expect([...new Set(arr)]).toStrictEqual([1, 2, 3, 5]);
    });

    it(`removes duplicate objects`, () => {
        const arr = [{ id: 1 }, { id: 1 }, { id: 3 }];
        expect(unique(arr, (a, b) => a.id === b.id)).toStrictEqual([{ id: 1 }, { id: 3 }]);
    });
});


// https://dev.to/rokuem/managing-and-removing-duplicated-values-with-javascript-sets-bb1