export interface CreatePlantDto {
	name: string;
	code: string;
}

export interface UpdatePlantDto {
	name?: string;
	code?: string;
}

export interface PlantFilterDto {
	id?: string;
	code?: string;
	name?: string;
}
