import {fieldGetCellValue} from "../utils/analyze/field-get-cell-value.js";
import {FILED_GRID_SIZE} from "../share/config.js";

export function getFieldMatrix(ctx) {
    const field = [];
    for (let row = 0; row < FILED_GRID_SIZE; row++) {
        field[row] = [];
        for (let col = 0; col < FILED_GRID_SIZE; col++) {
            field[row][col] = fieldGetCellValue(ctx, row, col);
            // console.log(`${row}:${col} = ${field[row][col]}`);
        }
    }

    // console.log(matrix)
    return {field, isValid: true};
}