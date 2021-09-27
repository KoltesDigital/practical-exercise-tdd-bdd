Feature: Hierarchy computation
	The goal is to display hierarchical data.

	Rule: Detects invalid data
		Scenario: Detects cycles
			Given a datum with id "foo", name "Foo", parentId "bar"
			And a datum with id "bar", name "Bar", parentId "foo"
			When I compute the hierarchy
			Then the computation should detect cycles

		Scenario: Detects unknown parent
			Given a datum with id "foo", name "Foo", parentId "bar"
			When I compute the hierarchy
			Then the computation should detect a datum with id "foo" has unknown parent with id "bar"

	Rule: Only known data have positions
		Background:
			Given a datum with id "root", name "Root"
			And I compute the hierarchy

		Scenario: Known datum
			When I try to get position of datum "root"
			Then I should actually get a position

		Scenario: Unknown datum
			When I try to get position of datum "foobar"
			Then I can't get position because datum is unknown

	Rule: Computes positions
		Scenario Outline: With test data
			Given test data from "<file name>"
			When I compute the hierarchy
			Then the computed positions should match the expected positions

			Examples:
				| file name        |
				| test-data-0.json |
				| test-data-1.json |
				| test-data-2.json |
