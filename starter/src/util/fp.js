export const __unique__ = (arr, key) => {
    return arr.reduce((prevArr, entry) => {
        if (!prevArr.find(prevEntry => prevEntry[key] === entry[key]))
            return [...prevArr, entry];
        else
            return prevArr;
    }, []);
};

/**
 * @param {any[]} arr 
 * @param {(a,b)=>boolean} fn 
 * @returns {any[]}
 */
export const unique = (arr, fn) => arr.reduce((prevArr, entry) => {
    if (!prevArr.find(prevEntry => fn(prevEntry, entry)))
        return [...prevArr, entry];
    else
        return prevArr;
}, []);