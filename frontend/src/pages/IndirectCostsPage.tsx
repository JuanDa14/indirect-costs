import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2Icon, Plus } from 'lucide-react';
import { PlantManager } from '../components/plants/PlantManager';
import { CreatePlantDialog } from '../components/plants/CreatePlantDialog';
import { CreateOperationDialog } from '../components/operations/CreateOperationDialog';
import { OperationsMatrix } from '../components/operations/OperationsMatrix';
import { usePlantOperations } from '../hooks/usePlants';
import type { Plant } from '../types';

export function IndirectCostsPage() {
	const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
	const [isCreatePlantOpen, setIsCreatePlantOpen] = useState(false);

	const {
		operations,
		loading: operationsLoading,
		error: operationsError,
		refetch: refetchOperations,
	} = usePlantOperations(selectedPlant?.id || '');

	const handlePlantSelect = (plant: Plant | null) => {
		setSelectedPlant(plant);
	};

	const handlePlantCreated = () => {
		setIsCreatePlantOpen(false);
	};

	const handleCostsUpdated = () => {
		refetchOperations();
	};

	return (
		<div className='container mx-auto p-6 space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Gestión de Costos Indirectos</h1>
				<Button onClick={() => setIsCreatePlantOpen(true)} className='flex items-center gap-2'>
					<Plus className='h-4 w-4' />
					Nueva Planta
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Seleccionar Planta</CardTitle>
				</CardHeader>
				<CardContent>
					<PlantManager
						selectedPlantId={selectedPlant?.id}
						onPlantSelect={handlePlantSelect}
					/>
				</CardContent>
			</Card>

			{selectedPlant && (
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center justify-between'>
							<span>
								Operaciones de {selectedPlant.name} ({selectedPlant.code})
							</span>
							<CreateOperationDialog
								plant={selectedPlant}
								onOperationCreated={handleCostsUpdated}
							/>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{operationsLoading && (
							<div className='text-center py-8'>
								<Loader2Icon className='animate-spin h-8 w-8 mx-auto' />
								<p className='mt-2 text-gray-600'>Cargando operaciones...</p>
							</div>
						)}

						{operationsError && (
							<div className='text-center py-8'>
								<p className='text-red-600'>Error al cargar las operaciones</p>
								<Button
									onClick={() => refetchOperations()}
									className='mt-2'
									variant='outline'
								>
									Reintentar
								</Button>
							</div>
						)}

						{!operationsLoading && !operationsError && operations.length === 0 && (
							<div className='text-center py-8'>
								<div className='text-gray-500 space-y-3'>
									<p>No hay operaciones configuradas para esta planta.</p>
									<p className='text-sm'>
										Crea tu primera operación para comenzar a gestionar los costos
										indirectos.
									</p>
									<CreateOperationDialog
										plant={selectedPlant}
										onOperationCreated={handleCostsUpdated}
									/>
								</div>
							</div>
						)}

						{!operationsLoading && !operationsError && operations.length > 0 && (
							<OperationsMatrix
								operations={operations}
								onOperationsUpdated={handleCostsUpdated}
							/>
						)}
					</CardContent>
				</Card>
			)}

			<CreatePlantDialog
				open={isCreatePlantOpen}
				onOpenChange={setIsCreatePlantOpen}
				onPlantCreated={handlePlantCreated}
			/>
		</div>
	);
}
