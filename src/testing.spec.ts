import { Datum } from '.';

export interface ExpectedPosition {
	id: string;
	x: number;
	y: number;
}

export interface TestData {
	data: Datum[];
	expectedPositions: ExpectedPosition[];
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function isDatum(value: unknown): value is Datum {
	if (!isObject(value)) {
		return false;
	}

	const record = value as Partial<Datum>;
	return (
		typeof record.id === 'string' &&
		typeof record.name === 'string' &&
		(typeof record.parentId === 'string' ||
			typeof record.parentId === 'undefined')
	);
}

export function isExpectedPosition(value: unknown): value is ExpectedPosition {
	if (!isObject(value)) {
		return false;
	}

	const record = value as Partial<ExpectedPosition>;
	return (
		typeof record.id === 'string' &&
		typeof record.x === 'number' &&
		typeof record.y === 'number'
	);
}

export function isTestData(value: unknown): value is TestData {
	if (!isObject(value)) {
		return false;
	}

	const record = value as Partial<TestData>;
	return (
		Array.isArray(record.data) &&
		record.data.every(isDatum) &&
		Array.isArray(record.expectedPositions) &&
		record.expectedPositions.every(isExpectedPosition)
	);
}
