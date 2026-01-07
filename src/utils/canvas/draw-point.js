export function drawPoint(ctx, x, y, color = 'red') {
    return;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}