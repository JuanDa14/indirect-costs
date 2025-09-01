import type { Plant, Operation, IndirectCost } from '@prisma/client';

export type PlantWithOperations = Plant & {
	operations: (Operation & {
		costs: IndirectCost[];
	})[];
};

export type { Plant, Operation, IndirectCost };
