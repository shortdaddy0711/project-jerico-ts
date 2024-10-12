import { Student } from '@/hooks/useStudentsBy';

export const capitalizeFirstLetter = (string: string): string => {
    return string
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
};

export const truncateString = (str: string, maxLength: number): string => {
    if (str.length > maxLength) {
        return str.slice(0, maxLength - 3) + '...';
    }
    return str;
};

export const getRandomItems = (arr: Student[], n: number) => {
    if (n > arr.length) {
        throw new RangeError('getRandomItems: more elements taken than available');
    }

    const result = [];
    const usedIndices = new Set();

    while (result.length < n) {
        const randomIndex = Math.floor(Math.random() * arr.length);

        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            result.push(arr[randomIndex]);
        }
    }

    return result;
};
