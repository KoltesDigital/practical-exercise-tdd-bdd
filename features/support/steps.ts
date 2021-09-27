import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

Given(
	'a datum with id {string}, name {string}',
	function (id: string, name: string) {
		this.addDatum({
			id,
			name,
		});
	}
);

Given(
	'a datum with id {string}, name {string}, parentId {string}',
	function (id: string, name: string, parentId: string) {
		this.addDatum({
			id,
			name,
			parentId,
		});
	}
);

Given('test data from {string}', async function (fileName: string) {
	await this.loadTestData(fileName);
});

When('I compute the hierarchy', function () {
	this.computeHierarchy();
});

When('I try to get position of datum {string}', function (id: string) {
	this.getPosition(id);
});

Then('the computation should detect cycles', function () {
	expect(this.computeHierarchyPayload).to.have.property(
		'kind',
		'has-cycle',
		'Wrong payload kind'
	);
});

Then(
	'the computation should detect a datum with id {string} has unknown parent with id {string}',
	function (id: string, parentId: string) {
		expect(this.computeHierarchyPayload).to.have.property(
			'kind',
			'unknown-parent',
			'Wrong payload kind'
		);
		expect(this.computeHierarchyPayload).to.include({
			id,
			parentId,
		});
	}
);

Then('I should actually get a position', function () {
	expect(this.getPositionPayload).to.have.property(
		'kind',
		'position',
		'Wrong payload kind'
	);
});

Then("I can't get position because datum is unknown", function () {
	expect(this.getPositionPayload).to.have.property(
		'kind',
		'unknown-datum',
		'Wrong payload kind'
	);
});

Then('the computed positions should match the expected positions', function () {
	this.assertMatchExpectedPositions();
});
