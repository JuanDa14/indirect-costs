import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useCreatePlant } from '../../hooks/usePlants';
import { useToast } from '../../hooks/useToast';
import { generatePlantCode, APP_CONFIG } from '../../lib';

interface CreatePlantDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPlantCreated: () => void;
}

export function CreatePlantDialog({ open, onOpenChange, onPlantCreated }: CreatePlantDialogProps) {
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [isCodeManuallyEdited, setIsCodeManuallyEdited] = useState(false);
	const { createPlant, loading } = useCreatePlant();
	const toast = useToast();

	// codigo automatico
	useEffect(() => {
		if (!isCodeManuallyEdited) {
			if (name.trim()) {
				setCode(generatePlantCode(name));
			} else {
				setCode('');
			}
		}
	}, [name, isCodeManuallyEdited]);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setName(newName);

		if (!newName.trim() && isCodeManuallyEdited) {
			setIsCodeManuallyEdited(false);
		}
	};

	const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value.toUpperCase());
		setIsCodeManuallyEdited(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.showWarning('El nombre de la planta es obligatorio');
			return;
		}

		const finalCode = code.trim() || generatePlantCode(name);

		try {
			await createPlant({
				name: name.trim(),
				code: finalCode,
			});

			toast.success.plantCreated();

			setName('');
			setCode('');
			setIsCodeManuallyEdited(false);

			onOpenChange(false);
			onPlantCreated();
		} catch (err) {
			console.error('Error creating plant:', err);
			toast.handleGraphQLError(err);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!loading) {
			onOpenChange(newOpen);
			if (!newOpen) {
				setName('');
				setCode('');
				setIsCodeManuallyEdited(false);
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crear Nueva Planta</DialogTitle>
					<DialogDescription>
						Ingresa los datos de la nueva planta. El código debe ser único.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='plant-name'>Nombre de la Planta</Label>
						<Input
							id='plant-name'
							value={name}
							onChange={handleNameChange}
							placeholder='ej. Planta Norte'
							required
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='plant-code'>Código de la Planta</Label>
						<Input
							id='plant-code'
							value={code}
							onChange={handleCodeChange}
							placeholder='Se genera automáticamente'
							disabled={loading}
							maxLength={APP_CONFIG.PLANT_CODE_MAX_LENGTH}
						/>
						<p className='text-sm text-gray-500'>
							El código se genera automáticamente del nombre. Puedes editarlo si es
							necesario.
						</p>
					</div>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => handleOpenChange(false)}
							disabled={loading}
						>
							Cancelar
						</Button>
						<Button type='submit' disabled={loading || !name.trim()}>
							{loading ? 'Creando...' : 'Crear Planta'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
