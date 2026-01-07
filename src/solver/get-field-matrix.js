import {fieldGetCellValue} from "../utils/analyze/field-get-cell-value.js";
import {FILED_GRID_SIZE} from "../share/config.js";

export function getFieldMatrix(ctx) {
    const matrix = [];
    for (let row = 0; row < FILED_GRID_SIZE; row++) {
        matrix[row] = [];
        for (let col = 0; col < FILED_GRID_SIZE; col++) {
            matrix[row][col] = fieldGetCellValue(ctx, row, col);
            // console.log(`${row}:${col} = ${matrix[row][col]}`);
        }
    }

    console.log(matrix)
    return matrix;
}