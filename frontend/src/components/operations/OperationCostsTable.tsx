import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ConfirmDeleteDialog } from '../base/ConfirmDeleteDialog';
import { useUpdateOperationCosts, useDeleteOperation } from '../../hooks/useOperations';
import type { Operation, IndirectCostInput } from '../../types';

interface OperationCostsTableProps {
	operation: Operation;
	onCostsUpdated: () => void;
	onOperationDeleted?: () => void;
}

export function OperationCostsTable({
	operation,
	onCostsUpdated,
	onOperationDeleted,
}: OperationCostsTableProps) {
	const [costs, setCosts] = useState<IndirectCostInput[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

	const { updateOperationCosts, loading } = useUpdateOperationCosts();
	const { deleteOperation, loading: deleteLoading } = useDeleteOperation();

	useEffect(() => {
		setCosts(
			operation.costs.map((cost) => ({
				volumeThresholdKg: cost.volumeThresholdKg,
				costPerKg: cost.costPerKg,
			}))
		);
	}, [operation.costs]);

	const handleCostChange = (index: number, field: keyof IndirectCostInput, value: number) => {
		const newCosts = [...costs];
		newCosts[index] = { ...newCosts[index], [field]: value };
		setCosts(newCosts);
	};

	const handleAddCost = () => {
		setCosts([...costs, { volumeThresholdKg: 0, costPerKg: 0 }]);
	};

	const handleRemoveCost = (index: number) => {
		setCosts(costs.filter((_, i) => i !== index));
	};

	const handleSave = async () => {
		try {
			await updateOperationCosts({
				operationId: operation.id,
				costs: costs.filter((cost) => cost.volumeThresholdKg > 0),
			});
			setIsEditing(false);
			onCostsUpdated();
		} catch (err) {
			console.error('Error updating costs:', err);
		}
	};

	const handleCancel = () => {
		setCosts(
			operation.costs.map((cost) => ({
				volumeThresholdKg: cost.volumeThresholdKg,
				costPerKg: cost.costPerKg,
			}))
		);
		setIsEditing(false);
	};

	const handleDeleteOperation = async () => {
		try {
			await deleteOperation(operation.id);
			onOperationDeleted?.();
		} catch (error) {
			console.error('Error deleting operation:', error);
		}
	};

	const hasChanges =
		JSON.stringify(costs) !==
		JSON.stringify(
			operation.costs.map((cost) => ({
				volumeThresholdKg: cost.volumeThresholdKg,
				costPerKg: cost.costPerKg,
			}))
		);

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					{operation.name}
					<div className='flex gap-2'>
						{!isEditing ? (
							<>
								<Button
									onClick={() => setDeleteConfirmOpen(true)}
									size='sm'
									variant='destructive'
									className='flex items-center gap-2'
									disabled={deleteLoading}
								>
									<Trash2 className='h-4 w-4' />
									Eliminar
								</Button>
								<Button
									onClick={() => setIsEditing(true)}
									size='sm'
									variant='outline'
									className='flex items-center gap-2'
								>
									<Edit className='h-4 w-4' />
									Editar
								</Button>
							</>
						) : (
							<>
								<Button
									onClick={handleCancel}
									size='sm'
									variant='outline'
									disabled={loading}
								>
									Cancelar
								</Button>
								<Button
									onClick={handleSave}
									size='sm'
									disabled={loading || !hasChanges}
									className='flex items-center gap-2'
								>
									<Save className='h-4 w-4' />
									{loading ? 'Guardando...' : 'Guardar'}
								</Button>
							</>
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Umbral de Volumen (kg)</TableHead>
							<TableHead>Costo por kg</TableHead>
							{isEditing && <TableHead className='w-20'>Acciones</TableHead>}
						</TableRow>
					</TableHeader>
					<TableBody>
						{costs.map((cost, index) => (
							<TableRow key={index}>
								<TableCell>
									{isEditing ? (
										<Input
											type='number'
											value={cost.volumeThresholdKg}
											onChange={(e) =>
												handleCostChange(
													index,
													'volumeThresholdKg',
													Number(e.target.value)
												)
											}
											min='0'
											step='1'
										/>
									) : (
										cost.volumeThresholdKg.toLocaleString()
									)}
								</TableCell>
								<TableCell>
									{isEditing ? (
										<Input
											type='number'
											value={cost.costPerKg}
											onChange={(e) =>
												handleCostChange(index, 'costPerKg', Number(e.target.value))
											}
											min='0'
											step='0.01'
										/>
									) : (
										`$${cost.costPerKg.toFixed(2)}`
									)}
								</TableCell>
								{isEditing && (
									<TableCell>
										<Button
											onClick={() => handleRemoveCost(index)}
											size='sm'
											variant='destructive'
											className='h-8 w-8 p-0'
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
						{isEditing && (
							<TableRow>
								<TableCell colSpan={3}>
									<Button
										onClick={handleAddCost}
										size='sm'
										variant='outline'
										className='w-full flex items-center gap-2'
									>
										<Plus className='h-4 w-4' />
										Agregar Nivel de Costo
									</Button>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{costs.length === 0 && !isEditing && (
					<div className='text-center py-8 text-gray-500'>
						No hay costos configurados para esta operación.
					</div>
				)}
			</CardContent>

			<ConfirmDeleteDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
				title='Eliminar Operación'
				description='¿Estás seguro de que deseas eliminar esta operación? Se eliminarán también todos los costos asociados.'
				itemName={operation.name}
				isLoading={deleteLoading}
				onConfirm={handleDeleteOperation}
			/>
		</Card>
	);
}
