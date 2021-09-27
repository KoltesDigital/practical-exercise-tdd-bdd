import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
	computeHierarchy,
	ComputeHierarchyPayload,
	Datum,
	GetPositionPayload,
} from '../../src/index';
import { isTestData, ExpectedPosition } from '../../src/testing.spec';
import { IWorld, setWorldConstructor, World } from '@cucumber/cucumber';
import { expect } from 'chai';

const fixturesPath = path.join(__dirname, '..', '..', 'fixtures');

declare module '@cucumber/cucumber' {
	export interface IWorld {
		readonly computeHierarchyPayload: ComputeHierarchyPayload | undefined;
		readonly getPositionPayload: GetPositionPayload | undefined;

		addDatum(datum: Datum): void;

		computeHierarchy(): void;
		getPosition(id: string): void;

		loadTestData(fileName: string): Promise<void>;
		assertMatchExpectedPositions(): void;
	}
}

class CustomWorld extends World implements IWorld {
	[key: string]: unknown;

	private data: Datum[] = [];
	private expectedPositions: ExpectedPosition[] | undefined = undefined;

	private _computeHierarchyPayload: ComputeHierarchyPayload | undefined =
		undefined;
	get computeHierarchyPayload() {
		return this._computeHierarchyPayload;
	}

	private _getPositionPayload: GetPositionPayload | undefined = undefined;
	get getPositionPayload() {
		return this._getPositionPayload;
	}

	addDatum(datum: Datum) {
		this.data.push(datum);
	}

	computeHierarchy() {
		this._computeHierarchyPayload = computeHierarchy(this.data);
	}

	getPosition(id: string) {
		const computeHierarchyPayload = this._computeHierarchyPayload;
		assert(computeHierarchyPayload);
		assert(computeHierarchyPayload.kind === 'hierarchy');
		const hierarchy = computeHierarchyPayload.hierarchy;
		this._getPositionPayload = hierarchy.getPosition(id);
	}

	async loadTestData(fileName: string) {
		const testDataContents = await fs.promises.readFile(
			path.join(fixturesPath, fileName),
			'utf-8'
		);
		const testData = JSON.parse(testDataContents) as unknown;
		assert(isTestData(testData));

		this.data = testData.data;
		this.expectedPositions = testData.expectedPositions;
	}

	assertMatchExpectedPositions(): void {
		const computeHierarchyPayload = this._computeHierarchyPayload;
		assert(computeHierarchyPayload);
		assert(computeHierarchyPayload.kind === 'hierarchy');
		const hierarchy = computeHierarchyPayload.hierarchy;

		assert(this.expectedPositions);
		this.expectedPositions.forEach(({ id, x, y }, positionIndex) => {
			const getPositionPayload = hierarchy.getPosition(id);
			assert(getPositionPayload.kind === 'position');
			const position = getPositionPayload.position;

			expect(position).to.have.property(
				'x',
				x,
				`Wrong x for position #${positionIndex} (id: '${id}')`
			);
			expect(position).to.have.property(
				'y',
				y,
				`Wrong y for position #${positionIndex} (id: '${id}')`
			);
		});
	}
}

setWorldConstructor(CustomWorld);
