export function arrayHash(arr) {
    let h = 0; // 32-bit

    const add = (x) => {
        // дешёвое смешивание (быстрее, чем нормальные хэши)
        h = (h * 31 + x) | 0;
    };

    const addStr = (s) => {
        for (let i = 0; i < s.length; i++) add(s.charCodeAt(i));
    };

    const walk = (v) => {
        if (Array.isArray(v)) {
            add(91); // '['
            for (let i = 0; i < v.length; i++) walk(v[i]);
            add(93); // ']'
            return;
        }

        // как join: null/undefined считаем пустотой, но границу обозначим
        if (v == null) { add(0); add(44); return; } // 0 + ','

        // суперпросто: строковое представление
        addStr(String(v));
        add(44); // ',' как граница
    };

    walk(arr);

    // 5–7 символов
    return (h >>> 0).toString(36);
}