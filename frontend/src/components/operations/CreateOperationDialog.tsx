import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useCreateOperation } from '../../hooks/useOperations';
import { useToast } from '../../hooks/useToast';
import type { Plant } from '../../types';

interface CreateOperationDialogProps {
	plant: Plant;
	onOperationCreated: () => void;
}

export function CreateOperationDialog({ plant, onOperationCreated }: CreateOperationDialogProps) {
	const [open, setOpen] = useState(false);
	const [operationName, setOperationName] = useState('');
	const { createOperation, loading } = useCreateOperation();
	const toast = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!operationName.trim()) {
			toast.showWarning('El nombre de la operación es obligatorio');
			return;
		}

		try {
			await createOperation({
				plantId: plant.id,
				name: operationName.trim(),
				costs: [],
			});

			toast.success.operationCreated();

			setOperationName('');
			setOpen(false);
			onOperationCreated();
		} catch (error) {
			console.error('Error creating operation:', error);
			toast.handleGraphQLError(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='flex items-center gap-2'>
					<Plus className='h-4 w-4' />
					Nueva Operación
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Crear Nueva Operación para {plant.name}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='operationName'>Nombre de la Operación</Label>
						<Input
							id='operationName'
							value={operationName}
							onChange={(e) => setOperationName(e.target.value)}
							placeholder='Ej: Secado, Empaque, Procesamiento...'
							required
							disabled={loading}
						/>
					</div>
					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
							disabled={loading}
						>
							Cancelar
						</Button>
						<Button type='submit' disabled={loading || !operationName.trim()}>
							{loading ? 'Creando...' : 'Crear Operación'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
