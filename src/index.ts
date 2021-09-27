export interface Datum {
	id: string;
	name: string;
	parentId?: string;
}

export interface Vector2 {
	x: number;
	y: number;
}

export type GetPositionPayload =
	| {
			kind: 'position';
			position: Vector2;
	  }
	| {
			kind: 'unknown-datum';
	  };

export interface Hierarchy {
	getPosition: (id: string) => GetPositionPayload;
}

export type ComputeHierarchyPayload =
	| {
			kind: 'hierarchy';
			hierarchy: Hierarchy;
	  }
	| {
			kind: 'has-cycle';
	  }
	| {
			kind: 'unknown-parent';
			id: string;
			parentId: string;
	  };

const TODO_THROW = true;

export function computeHierarchy(data: Datum[]): ComputeHierarchyPayload {
	if (TODO_THROW) {
		throw new Error('TODO');
	}

	const position: Vector2 = {
		x: 0,
		y: 0,
	};

	const hierarchy: Hierarchy = {
		getPosition(id) {
			return {
				kind: 'position',
				position,
			};
		},
	};

	return {
		hierarchy,
		kind: 'hierarchy',
	};
}
