import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useGetPlantsQuery } from '../../graphql/graphql.types';
import type { Plant } from '../../graphql/graphql.types';
import { CreatePlantDialog } from './CreatePlantDialog';

interface PlantSelectorProps {
	selectedPlantId?: string;
	onPlantSelect: (plant: Plant | null) => void;
}

export function PlantSelector({ selectedPlantId, onPlantSelect }: PlantSelectorProps) {
	const { data, loading, error, refetch } = useGetPlantsQuery();
	const plants = data?.plants || [];
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const handlePlantChange = (value: string) => {
		if (value === 'none') {
			onPlantSelect(null);
		} else {
			const plant = plants.find((p: Plant) => p.id === value);
			onPlantSelect(plant || null);
		}
	};

	const handlePlantCreated = () => {
		refetch();
		setIsCreateDialogOpen(false);
	};

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Seleccionar Planta</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='animate-pulse'>
						<div className='h-10 bg-gray-200 rounded'></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Seleccionar Planta</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-red-500'>Error al cargar plantas: {error.message}</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Seleccionar Planta
					<Button
						onClick={() => setIsCreateDialogOpen(true)}
						size='sm'
						className='flex items-center gap-2'
					>
						<Plus className='h-4 w-4' />
						Nueva Planta
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Select value={selectedPlantId || 'none'} onValueChange={handlePlantChange}>
					<SelectTrigger>
						<SelectValue placeholder='Selecciona una planta...' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='none'>-- Ninguna planta seleccionada --</SelectItem>
						{plants.map((plant: Plant) => (
							<SelectItem key={plant.id} value={plant.id}>
								{plant.name} ({plant.code})
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{plants.length === 0 && (
					<p className='text-sm text-gray-500 mt-2'>
						No hay plantas disponibles. Crea una nueva planta para comenzar.
					</p>
				)}
			</CardContent>

			<CreatePlantDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onPlantCreated={handlePlantCreated}
			/>
		</Card>
	);
}
