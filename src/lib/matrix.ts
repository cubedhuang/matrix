export type Matrix = number[][];

type ReadonlyMatrix = ReadonlyArray<ReadonlyArray<number>>;

// Internal Operations

export function copy(matrix: ReadonlyMatrix): Matrix {
	return matrix.map(row => row.slice());
}

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

export function zero(rows: number, cols: number): Matrix {
	return resize([], rows, cols);
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
		const pivot = result[row].findIndex(x => x !== 0);

		if (pivot === -1) {
			continue;
		}

		for (let i = row + 1; i < result.length; i++) {
			const factor = result[i][pivot] / result[row][pivot];

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
		const pivot = result[row].findIndex(x => x !== 0);

		if (pivot === -1) {
			continue;
		}

		for (let i = row + 1; i < result.length; i++) {
			const factor = result[i][pivot] / result[row][pivot];

			for (let j = pivot; j < result[i].length; j++) {
				result[i][j] -= result[row][j] * factor;
			}
		}

		for (let i = 0; i < row; i++) {
			const factor = result[i][pivot] / result[row][pivot];

			for (let j = pivot; j < result[i].length; j++) {
				result[i][j] -= result[row][j] * factor;
			}
		}

		for (let i = 0; i < result[row].length; i++) {
			result[row][i] /= result[row][pivot];
		}
	}

	return result;
}

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

	const rowEchelon = ref(matrix);

	let result = 1;

	for (let i = 0; i < rowEchelon.length; i++) {
		result *= rowEchelon[i][i];
	}

	return result;
}

export function cofactor(
	matrix: ReadonlyMatrix,
	row: number,
	col: number
): number {
	const sign = (row + col) % 2 === 0 ? 1 : -1;
	return sign * det(minor(matrix, row, col));
}

export function minor(
	matrix: ReadonlyMatrix,
	row: number,
	col: number
): Matrix {
	return matrix
		.filter((_, i) => i !== row)
		.map(r => r.filter((_, i) => i !== col));
}

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
 * Create the LU decomposition of a matrix
 * @param matrix The matrix to decompose - may be rectangular
 */
export function lu(matrix: ReadonlyMatrix): LU {
	const l: Matrix = zero(matrix.length, matrix.length);
	const u: Matrix = copy(matrix);

	for (let row = 0; row < matrix.length; row++) {
		l[row][row] = 1;

		for (let col = row + 1; col < matrix.length; col++) {
			l[col][row] = u[col][row] / u[row][row];

			for (let i = row; i < matrix[col].length; i++) {
				u[col][i] -= l[col][row] * u[row][i];
			}
		}
	}

	return { l, u };
}

// Binary Operations

export function add(a: ReadonlyMatrix, b: ReadonlyMatrix): Matrix | string {
	if (a.length !== b.length || a[0].length !== b[0].length) {
		return 'Matrices must be the same dimensions';
	}

	return a.map((row, i) => row.map((n, j) => n + b[i][j]));
}

export function multiply(
	a: ReadonlyMatrix,
	b: ReadonlyMatrix
): Matrix | string {
	if (a[0].length !== b.length) {
		return 'Matrix a columns must match matrix b rows';
	}

	const result: Matrix = [];

	for (let aRow = 0; aRow < a.length; aRow++) {
		result[aRow] = [];

		for (let bCol = 0; bCol < b[0].length; bCol++) {
			let sum = 0;

			for (let i = 0; i < a[0].length; i++) {
				sum += a[aRow][i] * b[i][bCol];
			}

			result[aRow][bCol] = sum;
		}
	}

	return result;
}
