export interface IndirectCostDto {
	volumeThresholdKg: number;
	costPerKg: number;
}

export interface CreateOperationDto {
	plantId: string;
	name: string;
	costs?: IndirectCostDto[];
}

export interface UpdateOperationDto {
	name?: string;
	costs?: IndirectCostDto[];
}

export interface OperationFilterDto {
	id?: string;
	plantId?: string;
	name?: string;
}

export interface UpsertOperationDto {
	plantId: string;
	name: string;
	costs: IndirectCostDto[];
}
