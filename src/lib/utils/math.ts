export function generateInterpolatedArray(count:number, maxValue:number): number[] {
    if (count <= 0 || maxValue <= 0) {
        throw new Error("Both count and maxValue must be greater than 0");
    }
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push((maxValue * i) / (count - 1));
    }
    return result;
}