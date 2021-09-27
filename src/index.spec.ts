import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { isTestData } from './testing.spec';
import { computeHierarchy, Hierarchy } from '.';
import { expect } from 'chai';

describe('Hierarchy computation', function () {
	describe('Detects invalid data', function () {
		it('detects cycles', function () {
			const computeHierarchyPayload = computeHierarchy([
				{
					id: 'foo',
					name: 'Foo',
					parentId: 'bar',
				},
				{
					id: 'bar',
					name: 'Bar',
					parentId: 'foo',
				},
			]);
			expect(computeHierarchyPayload).to.have.property(
				'kind',
				'has-cycle',
				'Wrong payload kind'
			);
		});

		it('detects unknown parent', function () {
			const computeHierarchyPayload = computeHierarchy([
				{
					id: 'foo',
					name: 'Foo',
					parentId: 'bar',
				},
			]);
			expect(computeHierarchyPayload).to.have.property(
				'kind',
				'unknown-parent',
				'Wrong payload kind'
			);
			expect(computeHierarchyPayload).to.include({
				id: 'foo',
				parentId: 'bar',
			});
		});
	});

	describe('Only known data have position', function () {
		let hierarchy: Hierarchy;

		before(function () {
			const computeHierarchyPayload = computeHierarchy([
				{
					id: 'root',
					name: 'Root',
				},
			]);
			assert(computeHierarchyPayload.kind === 'hierarchy');
			hierarchy = computeHierarchyPayload.hierarchy;
		});

		it(`gets position for known datum`, async function () {
			const getPositionPayload = hierarchy.getPosition('root');
			expect(getPositionPayload).to.have.property(
				'kind',
				'position',
				'Wrong payload kind'
			);
		});

		it(`cannot get position for unknown datum`, async function () {
			const getPositionPayload = hierarchy.getPosition('foobar');
			expect(getPositionPayload).to.have.property(
				'kind',
				'unknown-datum',
				'Wrong payload kind'
			);
		});
	});

	describe('Computes position', function () {
		const fixturesPath = path.join(__dirname, '..', 'fixtures');

		const fileNames = [
			'test-data-0.json',
			'test-data-1.json',
			'test-data-2.json',
		];

		for (const fileName of fileNames) {
			it(`works with test data from ${fileName}`, async function () {
				const testDataContents = await fs.promises.readFile(
					path.join(fixturesPath, fileName),
					'utf-8'
				);
				const testData = JSON.parse(testDataContents) as unknown;
				assert(isTestData(testData));

				const computeHierarchyPayload = computeHierarchy(testData.data);
				assert(computeHierarchyPayload.kind === 'hierarchy');
				const hierarchy = computeHierarchyPayload.hierarchy;

				testData.expectedPositions.forEach(({ id, x, y }, positionIndex) => {
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
			});
		}
	});
});
