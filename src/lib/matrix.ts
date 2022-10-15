export type Matrix = number[][];

type ReadonlyMatrix = ReadonlyArray<ReadonlyArray<number>>;

// Internal Operations

/**
 * Copies a matrix
 * @param matrix The matrix to copy
 * @returns A copy of the matrix
 */
export function copy(matrix: ReadonlyMatrix): Matrix {
	return matrix.map(row => row.slice());
}

/**
 * Resizes a matrix
 * @param matrix The matrix to resize
 * @param rows The new number of rows
 * @param cols The new number of columns
 * @returns The resized matrix with 0s in the new cells
 */
export function resize(
	matrix: ReadonlyMatrix,
	rows: number,
	cols: number
): Matrix {
	const result: Matrix = [];

	for (let row = 0; row < rows; row++) {
		result.push([]);
		for (let col = 0; col < cols; col++) {
			result[row][col] = matrix[row]?.[col] ?? 0;
		}
	}

	return result;
}

/**
 * Creates an identity matrix with the given dimensions
 * @param n The number of rows and columns
 * @returns An identity matrix
 */
export function identity(n: number): Matrix {
	const result = resize([], n, n);

	for (let i = 0; i < n; i++) {
		result[i][i] = 1;
	}

	return result;
}

// Unary Operations

/**
 * Puts a matrix into row echelon form without reducing
 * @param matrix The matrix to put into row echelon form
 * @returns A copy of the matrix in row echelon form
 */
export function ref(matrix: ReadonlyMatrix): Matrix {
	const result = copy(matrix);

	for (let row = 0; row < result.length; row++) {
		// Find the first non-zero element in the row
		const pivot = result[row].findIndex(x => x !== 0);

		// If there is no non-zero element, skip this row
		if (pivot === -1) continue;

		// Through all rows below this one, subtract the pivot row
		for (let i = row + 1; i < result.length; i++) {
			// Find the factor to multiply the pivot row by
			const factor = result[i][pivot] / result[row][pivot];

			// Subtract the scaled pivot row from the current row
			for (let j = pivot; j < result[i].length; j++) {
				result[i][j] -= result[row][j] * factor;
			}
		}
	}

	return result;
}

/**
 * Performs RREF on a matrix
 * @param matrix The matrix to row reduce
 * @returns A row-reduced copy of the matrix
 */
export function rref(matrix: ReadonlyMatrix): Matrix {
	const result = copy(matrix);

	for (let row = 0; row < result.length; row++) {
		// Find the first non-zero element in the row
		const pivot = result[row].findIndex(x => x !== 0);

		// If there is no non-zero element, skip this row
		if (pivot === -1) continue;

		// Subtract the pivot row from all other rows
		for (let i = 0; i < result.length; i++) {
			// Don't subtract the pivot row from itself
			if (i === row) continue;

			// Find the factor to multiply the pivot row by
			const factor = result[i][pivot] / result[row][pivot];

			// Subtract the scaled pivot row from the current row
			for (let j = pivot; j < result[i].length; j++) {
				result[i][j] -= result[row][j] * factor;
			}
		}

		// Divide the pivot row by the pivot element
		for (let i = 0; i < result[row].length; i++) {
			result[row][i] /= result[row][pivot];
		}
	}

	return result;
}

/**
 * Finds the determinant of a matrix
 * @param matrix The matrix to find the determinant of
 * @returns The determinant of the matrix
 */
export function det(matrix: ReadonlyMatrix): number {
	if (matrix.length !== matrix[0].length) {
		throw new Error('Matrix must be square');
	}

	if (matrix.length === 1) {
		return matrix[0][0];
	}

	if (matrix.length === 2) {
		return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
	}

	// Place the matrix in row echelon form
	const rowEchelon = ref(matrix);

	// The determinant is the product of the main diagonal
	let result = 1;
	for (let i = 0; i < rowEchelon.length; i++) {
		result *= rowEchelon[i][i];
	}

	return result;
}

/**
 * Finds the cofactor of a matrix at a given row and column
 * @param matrix The matrix to find the cofactor of
 * @param row The row of the cofactor
 * @param col The column of the cofactor
 * @returns The cofactor of the matrix at the given row and column
 */
export function cofactor(
	matrix: ReadonlyMatrix,
	row: number,
	col: number
): number {
	const sign = (row + col) % 2 === 0 ? 1 : -1;
	return sign * det(minor(matrix, row, col));
}

/**
 * Finds the minor of a matrix at a given row and column
 * @param matrix The matrix to find the minor of
 * @param row The row of the minor
 * @param col The column of the minor
 * @returns The minor of the matrix at the given row and column
 */
export function minor(
	matrix: ReadonlyMatrix,
	row: number,
	col: number
): Matrix {
	return matrix
		.filter((_, i) => i !== row)
		.map(r => r.filter((_, i) => i !== col));
}

/**
 * Transposes a matrix
 * @param matrix The matrix to transpose
 * @returns The transpose of the matrix
 */
export function transpose(matrix: ReadonlyMatrix): Matrix {
	const result: Matrix = [];

	for (let row = 0; row < matrix.length; row++) {
		for (let col = 0; col < matrix[row].length; col++) {
			result[col] ??= [];
			result[col][row] = matrix[row][col];
		}
	}

	return result;
}

/**
 * Finds the inverse of a matrix
 * @param matrix The matrix to find the inverse of
 * @returns The inverse of the matrix
 */
export function inverse(matrix: ReadonlyMatrix): Matrix | string {
	const determinant = det(matrix);

	if (determinant === 0) {
		return 'Matrix is not invertible';
	}

	const result: Matrix = [];

	for (let row = 0; row < matrix.length; row++) {
		result.push([]);

		for (let col = 0; col < matrix[row].length; col++) {
			result[row][col] = cofactor(matrix, row, col) / determinant;
		}
	}

	return transpose(result);
}

/**
 * The LU decomposition of a matrix
 */
interface LU {
	/**
	 * The lower triangular matrix (always square)
	 */
	l: Matrix;
	/**
	 * The upper triangular matrix (may be rectangular)
	 */
	u: Matrix;
}

/**
 * Creates the LU decomposition of a matrix
 * @param matrix The matrix to decompose - may be rectangular
 */
export function lu(matrix: ReadonlyMatrix): LU {
	const l: Matrix = identity(matrix.length);
	const u: Matrix = copy(matrix);

	// For all elements under the main diagonal
	for (let row = 0; row < matrix.length; row++) {
		for (let col = row + 1; col < matrix.length; col++) {
			// Find the factor to multiply the pivot row by
			const factor = u[col][row] / u[row][row];

			// Set the corresponding entry in the lower triangular matrix
			l[col][row] = factor;

			// Subtract the scaled pivot row from the current row
			for (let i = row; i < matrix[col].length; i++) {
				u[col][i] -= factor * u[row][i];
			}
		}
	}

	return { l, u };
}

// Binary Operations

/**
 * Adds two matrices together
 * @param a The first matrix
 * @param b The second matrix
 * @returns The sum of the two matrices
 */
export function add(a: ReadonlyMatrix, b: ReadonlyMatrix): Matrix | string {
	if (a.length !== b.length || a[0].length !== b[0].length) {
		return 'Matrices must be the same dimensions';
	}

	return a.map((row, i) => row.map((n, j) => n + b[i][j]));
}

/**
 * Multiplies two matrices together
 * @param a The first matrix
 * @param b The second matrix
 * @returns The product of the two matrices
 */
export function multiply(
	a: ReadonlyMatrix,
	b: ReadonlyMatrix
): Matrix | string {
	if (a[0].length !== b.length) {
		return 'Matrix a columns must match matrix b rows';
	}

	const result: Matrix = [];

	// For each row in a
	for (let row = 0; row < a.length; row++) {
		result[row] = [];

		// For each column in b
		for (let col = 0; col < b[0].length; col++) {
			let sum = 0;

			for (let i = 0; i < a[0].length; i++) {
				sum += a[row][i] * b[i][col];
			}

			result[row][col] = sum;
		}
	}

	return result;
}
