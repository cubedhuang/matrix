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

// Unary Operations

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

	let result = 0;

	for (let row = 0; row < matrix.length; row++) {
		result += matrix[row][0] * cofactor(matrix, row, 0);
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

export function rref(matrix: ReadonlyMatrix): Matrix {
	const result = copy(matrix);

	let lead = 0;

	for (let row = 0; row < result.length; row++) {
		if (lead >= result[row].length) {
			continue;
		}

		let i = row;

		while (result[i][lead] === 0) {
			i++;

			if (i === result.length) {
				i = row;
				lead++;

				if (lead === result[row].length) {
					return result;
				}
			}
		}

		[result[i], result[row]] = [result[row], result[i]];

		const div = result[row][lead];
		result[row] = result[row].map(x => x / div);

		for (let i = 0; i < result.length; i++) {
			if (i !== row) {
				const sub = result[i][lead];
				result[i] = result[i].map((x, j) => x - sub * result[row][j]);
			}
		}

		lead++;
	}

	return result;
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
