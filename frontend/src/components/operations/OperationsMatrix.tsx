import { useState, useMemo } from 'react';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ConfirmDeleteDialog } from '../base/ConfirmDeleteDialog';
import { useUpdateOperationCosts, useDeleteOperation } from '../../hooks/useOperations';
import { useToast } from '../../hooks/useToast';
import { formatVolume, getUniqueVolumeThresholds, formatCostPerKg } from '../../lib';
import type { Operation, IndirectCostInput } from '../../types';

interface OperationsMatrixProps {
	operations: Operation[];
	onOperationsUpdated: () => void;
}

interface MatrixCell {
	operationId: string;
	volumeThresholdKg: number;
	costPerKg: number;
	exists: boolean;
}

export function OperationsMatrix({ operations, onOperationsUpdated }: OperationsMatrixProps) {
	const [editingOperation, setEditingOperation] = useState<string | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [operationToDelete, setOperationToDelete] = useState<Operation | null>(null);
	const [editingCosts, setEditingCosts] = useState<Record<string, IndirectCostInput[]>>({});

	const { updateOperationCosts, loading } = useUpdateOperationCosts();
	const { deleteOperation, loading: deleteLoading } = useDeleteOperation();
	const toast = useToast();

	//  todos los volumenes únicos ordenados
	const allVolumes = useMemo(() => {
		return getUniqueVolumeThresholds(operations);
	}, [operations]);

	const matrixData = useMemo(() => {
		const matrix: Record<string, Record<number, MatrixCell>> = {};

		operations.forEach((operation) => {
			matrix[operation.id] = {};

			// inicializar todas las celdas como no existentes
			allVolumes.forEach((volume) => {
				matrix[operation.id][volume] = {
					operationId: operation.id,
					volumeThresholdKg: volume,
					costPerKg: 0,
					exists: false,
				};
			});

			// llenar con datos existentes
			operation.costs.forEach((cost) => {
				matrix[operation.id][cost.volumeThresholdKg] = {
					operationId: operation.id,
					volumeThresholdKg: cost.volumeThresholdKg,
					costPerKg: cost.costPerKg,
					exists: true,
				};
			});
		});

		return matrix;
	}, [operations, allVolumes]);

	const handleEditStart = (operationId: string) => {
		const operation = operations.find((op) => op.id === operationId);
		if (operation) {
			setEditingOperation(operationId);

			// crear array con todos los volúmenes posibles, incluyendo los existentes y los vacíos
			const allCosts: IndirectCostInput[] = allVolumes.map((volume) => {
				const existingCost = operation.costs.find((cost) => cost.volumeThresholdKg === volume);
				return {
					volumeThresholdKg: volume,
					costPerKg: existingCost?.costPerKg || 0,
				};
			});

			setEditingCosts({
				[operationId]: allCosts,
			});
		}
	};

	const handleEditCancel = () => {
		setEditingOperation(null);
		setEditingCosts({});
	};

	const handleCostChange = (operationId: string, volumeThreshold: number, newCost: number) => {
		setEditingCosts((prev) => {
			const operationCosts = prev[operationId] || [];
			const existingIndex = operationCosts.findIndex(
				(c) => c.volumeThresholdKg === volumeThreshold
			);

			if (existingIndex >= 0) {
				const updated = [...operationCosts];
				updated[existingIndex] = { ...updated[existingIndex], costPerKg: newCost };
				return { ...prev, [operationId]: updated };
			} else {
				return {
					...prev,
					[operationId]: [
						...operationCosts,
						{ volumeThresholdKg: volumeThreshold, costPerKg: newCost },
					],
				};
			}
		});
	};

	const handleSave = async (operationId: string) => {
		const costs = editingCosts[operationId] || [];
		const validCosts = costs.filter((cost) => cost.costPerKg > 0);

		try {
			await updateOperationCosts({
				operationId,
				costs: validCosts,
			});

			toast.success.costsUpdated();

			setEditingOperation(null);
			setEditingCosts({});
			onOperationsUpdated();
		} catch (error) {
			console.error('Error updating operation costs:', error);
			toast.handleGraphQLError(error);
		}
	};

	const handleDeleteClick = (operation: Operation) => {
		setOperationToDelete(operation);
		setDeleteConfirmOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!operationToDelete) return;

		try {
			await deleteOperation(operationToDelete.id);

			toast.success.operationDeleted();

			setDeleteConfirmOpen(false);
			setOperationToDelete(null);
			onOperationsUpdated();
		} catch (error) {
			console.error('Error deleting operation:', error);
			toast.handleGraphQLError(error);
		}
	};

	const getCellValue = (operationId: string, volume: number): number => {
		if (editingOperation === operationId) {
			const editingCost = editingCosts[operationId]?.find((c) => c.volumeThresholdKg === volume);
			return editingCost?.costPerKg || 0;
		}
		return matrixData[operationId]?.[volume]?.costPerKg || 0;
	};

	const isCellActive = (operationId: string, volume: number): boolean => {
		if (editingOperation === operationId) {
			return (
				editingCosts[operationId]?.some(
					(c) => c.volumeThresholdKg === volume && c.costPerKg > 0
				) || false
			);
		}
		return matrixData[operationId]?.[volume]?.exists || false;
	};

	if (operations.length === 0) {
		return (
			<Card>
				<CardContent className='p-6'>
					<p className='text-center text-gray-500'>No hay operaciones disponibles</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Matriz de Costos por Operación</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='font-semibold'>Operación</TableHead>
									{allVolumes.map((volume) => (
										<TableHead key={volume} className='text-center font-semibold'>
											{formatVolume(volume)}
										</TableHead>
									))}
									<TableHead className='text-center'>Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{operations.map((operation) => (
									<TableRow key={operation.id}>
										<TableCell className='font-medium'>{operation.name}</TableCell>
										{allVolumes.map((volume) => {
											const cellValue = getCellValue(operation.id, volume);
											const isActive = isCellActive(operation.id, volume);
											const isEditing = editingOperation === operation.id;

											return (
												<TableCell key={volume} className='text-center'>
													{isEditing ? (
														<Input
															type='number'
															step='0.001'
															value={cellValue || ''}
															onChange={(e) =>
																handleCostChange(
																	operation.id,
																	volume,
																	parseFloat(e.target.value) || 0
																)
															}
															className='w-20 text-center'
															placeholder='0.00'
														/>
													) : (
														<span
															className={`${
																isActive ? 'font-medium' : 'text-gray-400'
															}`}
														>
															{isActive ? formatCostPerKg(cellValue) : '-'}
														</span>
													)}
												</TableCell>
											);
										})}
										<TableCell className='text-center'>
											<div className='flex justify-center gap-2'>
												{editingOperation === operation.id ? (
													<>
														<Button
															size='sm'
															onClick={() => handleSave(operation.id)}
															disabled={loading}
														>
															<Save className='h-4 w-4' />
														</Button>
														<Button
															size='sm'
															variant='outline'
															onClick={handleEditCancel}
														>
															<X className='h-4 w-4' />
														</Button>
													</>
												) : (
													<>
														<Button
															size='sm'
															variant='outline'
															onClick={() => handleEditStart(operation.id)}
														>
															<Edit className='h-4 w-4' />
														</Button>
														<Button
															size='sm'
															variant='outline'
															onClick={() => handleDeleteClick(operation)}
														>
															<Trash2 className='h-4 w-4' />
														</Button>
													</>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<ConfirmDeleteDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
				onConfirm={handleDeleteConfirm}
				title='Eliminar Operación'
				description={`¿Estás seguro de que quieres eliminar la operación? Esta acción no se puede deshacer.`}
				itemName={operationToDelete?.name || ''}
				isLoading={deleteLoading}
			/>
		</>
	);
}
