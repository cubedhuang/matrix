import { persistentAtom } from '@nanostores/persistent';

import type { Matrix } from './matrix';

const encoder = {
	encode: JSON.stringify,
	decode: JSON.parse
};

export const savedMatrix = persistentAtom<Matrix>(
	'saved',
	[
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	],
	encoder
);
