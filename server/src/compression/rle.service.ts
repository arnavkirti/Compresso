export function compressRLE(data: string): string {
    let result = '';
    let i = 0;

    while (i < data.length) {
        let count = 1;
        while (i + 1 < data.length && data[i] === data[i + 1]) {
            count++;
            i++;
        }
        result += data[i] + count;
        i++;
    }

    return result;
}

export function decompressRLE(data: string): string {
    let result = '';
    for (let i = 0; i < data.length; i += 2) {
        const char = data[i];
        const count = parseInt(data[i + 1], 10);
        result += char.repeat(count);
    }
    return result;
}