import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ConfirmDeleteDialog } from '../base/ConfirmDeleteDialog';
import { useGetPlantsQuery, useDeletePlantMutation } from '../../graphql/graphql.types';
import type { Plant } from '../../graphql/graphql.types';
import { CreatePlantDialog } from './CreatePlantDialog';

interface PlantManagerProps {
	selectedPlantId?: string;
	onPlantSelect: (plant: Plant | null) => void;
}

export function PlantManager({ selectedPlantId, onPlantSelect }: PlantManagerProps) {
	const { data, loading, error, refetch } = useGetPlantsQuery();
	const plants = data?.plants || [];
	const [deletePlantMutation, { loading: deleteLoading }] = useDeletePlantMutation({
		refetchQueries: ['GetPlants'],
	});

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);

	const selectedPlant = plants.find((p) => p.id === selectedPlantId);

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

	const handleDeleteClick = (plant: Plant) => {
		setPlantToDelete(plant);
		setDeleteConfirmOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!plantToDelete) return;

		try {
			await deletePlantMutation({
				variables: { id: plantToDelete.id },
			});

			if (selectedPlantId === plantToDelete.id) {
				onPlantSelect(null);
			}

			setPlantToDelete(null);
		} catch (error) {
			console.error('Error deleting plant:', error);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center p-4'>
				<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
				<span className='ml-2'>Cargando plantas...</span>
			</div>
		);
	}

	if (error) {
		return <div className='text-red-600 p-4'>Error al cargar las plantas: {error.message}</div>;
	}

	return (
		<>
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<Label htmlFor='plant-select'>Seleccionar Planta</Label>
					<Button
						onClick={() => setIsCreateDialogOpen(true)}
						size='sm'
						className='flex items-center gap-2'
					>
						<Plus className='h-4 w-4' />
						Nueva Planta
					</Button>
				</div>

				<div className='flex gap-2'>
					<Select value={selectedPlantId || 'none'} onValueChange={handlePlantChange}>
						<SelectTrigger className='flex-1'>
							<SelectValue placeholder='Selecciona una planta...' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='none'>Sin seleccionar</SelectItem>
							{plants.map((plant: Plant) => (
								<SelectItem key={plant.id} value={plant.id}>
									{plant.name} ({plant.code})
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{selectedPlant && (
						<Button
							variant='destructive'
							size='sm'
							onClick={() => handleDeleteClick(selectedPlant)}
							disabled={deleteLoading}
							className='flex items-center gap-2'
						>
							<Trash2 className='h-4 w-4' />
							Eliminar
						</Button>
					)}
				</div>

				{plants.length === 0 && (
					<div className='text-center py-8 text-gray-500'>
						<p>No hay plantas creadas.</p>
						<p className='text-sm mt-1'>Crea tu primera planta para comenzar.</p>
					</div>
				)}
			</div>

			<CreatePlantDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onPlantCreated={handlePlantCreated}
			/>

			<ConfirmDeleteDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
				title='Eliminar Planta'
				description='¿Estás seguro de que deseas eliminar esta planta? Se eliminarán también todas sus operaciones y costos asociados.'
				itemName={plantToDelete?.name || ''}
				isLoading={deleteLoading}
				onConfirm={handleDeleteConfirm}
			/>
		</>
	);
}
