export function rgbAt(ctx, x, y) {
    const { data } = ctx.getImageData(Math.round(x), Math.round(y), 1, 1);
    return [data[0], data[1], data[2]]; // ignore alpha
}