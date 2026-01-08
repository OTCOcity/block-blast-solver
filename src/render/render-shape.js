/**
 * Рисует фигуру (матрица 0/1) как div-квадраты с прозрачностью.
 *
 * @param {HTMLElement} root   - контейнер (должен быть position: relative/absolute контейнером)
 * @param {number} x          - px, левый верх фигуры
 * @param {number} y          - px, левый верх фигуры
 * @param {string} color      - цвет (например '#a855f7' или 'rgba(...)')
 * @param {number[][]} shape  - матрица 0/1
 * @param {number} cellSize   - размер одного блока в px
 * @param {number|string} order - номер фигуры (в кружочке)
 * @param {object} [opts]
 * @param {number} [opts.opacity=0.45] - прозрачность блоков фигуры
 * @param {number} [opts.gap=0]        - зазор между клетками в px
 * @param {string} [opts.className]    - доп. класс на обёртку
 * @returns {HTMLDivElement} обёртка фигуры (можно удалить позже)
 */
export function renderShape(
    root,
    x,
    y,
    color,
    shape,
    cellSize,
    order,
) {
    const opacity = 0.95;
    const gap = 0;
    console.log('renderShape', color);

    // Wrapper for the whole shape
    const wrap = document.createElement('div');
    wrap.className = 'shape-overlay';
    wrap.style.position = 'absolute';
    wrap.style.left = `${x}px`;
    wrap.style.top = `${y}px`;
    wrap.style.pointerEvents = 'none';
    wrap.style.zIndex = '10';

    // Determine shape bounds (optional but helps wrapper sizing)
    const rows = shape?.length ?? 0;
    const cols = Math.max(0, ...((shape || []).map(r => r?.length ?? 0)));

    wrap.style.width = `${cols * (cellSize + gap) - (cols ? gap : 0)}px`;
    wrap.style.height = `${rows * (cellSize + gap) - (rows ? gap : 0)}px`;

    // Order badge
    const badge = document.createElement('div');
    badge.className = 'shape-order-badge';
    badge.textContent = String(order);
    badge.style.position = 'absolute';
    badge.style.left = '0px';
    badge.style.top = `-${Math.round(cellSize * 0.6)}px`; // над фигурой
    badge.style.transform = 'translateY(-2px)';
    badge.style.width = `${Math.round(cellSize * 0.55)}px`;
    badge.style.height = `${Math.round(cellSize * 0.55)}px`;
    badge.style.borderRadius = '999px';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.fontSize = `${Math.max(10, Math.round(cellSize * 0.28))}px`;
    badge.style.fontWeight = '700';
    badge.style.lineHeight = '1';
    badge.style.color = '#fff';
    badge.style.background = 'rgba(0,0,0,0.65)';
    badge.style.boxShadow = '0 2px 10px rgba(0,0,0,0.25)';
    badge.style.border = '1px solid rgba(255,255,255,0.25)';
    wrap.appendChild(badge);

    // Cells
    for (let r = 0; r < rows; r++) {
        const row = shape[r] || [];
        for (let c = 0; c < row.length; c++) {
            if (row[c] !== 1) continue;

            const cell = document.createElement('div');
            cell.className = 'shape-cell';
            cell.style.position = 'absolute';
            cell.style.left = `${c * (cellSize + gap)}px`;
            cell.style.top = `${r * (cellSize + gap)}px`;
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.background = color;
            cell.style.opacity = String(opacity);
            cell.style.borderRadius = `${Math.max(2, Math.round(cellSize * 0.12))}px`;
            cell.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.25)';
            wrap.appendChild(cell);
        }
    }

    root.appendChild(wrap);
    return wrap;
}
