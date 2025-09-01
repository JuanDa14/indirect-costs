import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';

interface ConfirmDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	itemName: string;
	isLoading?: boolean;
	onConfirm: () => void;
}

export function ConfirmDeleteDialog({
	open,
	onOpenChange,
	title,
	description,
	itemName,
	isLoading = false,
	onConfirm,
}: ConfirmDeleteDialogProps) {
	const handleConfirm = () => {
		onConfirm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<AlertTriangle className='h-5 w-5 text-red-500' />
						{title}
					</DialogTitle>
					<DialogDescription className='text-left'>
						{description}
						<br />
						<br />
						<span className='font-semibold text-red-600'>"{itemName}"</span>
						<br />
						<br />
						Esta acción no se puede deshacer.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='flex-col sm:flex-row gap-2'>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
						className='w-full sm:w-auto'
					>
						Cancelar
					</Button>
					<Button
						variant='destructive'
						onClick={handleConfirm}
						disabled={isLoading}
						className='w-full sm:w-auto'
					>
						{isLoading ? 'Eliminando...' : 'Eliminar'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
