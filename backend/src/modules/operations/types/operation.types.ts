import type { Operation, IndirectCost, Plant } from '@prisma/client';

export type OperationWithCosts = Operation & {
	costs: IndirectCost[];
	plant: Plant;
};

export type OperationWithCostsOnly = Operation & {
	costs: IndirectCost[];
};

export type VolumeThreshold = number;

export const DEFAULT_THRESHOLDS: VolumeThreshold[] = [
	300, 500, 1000, 3000, 5000, 10000, 20000, 30000,
];

export type { Operation, IndirectCost, Plant };
