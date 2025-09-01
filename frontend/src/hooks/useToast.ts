import { toast } from 'sonner';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../lib/constants';

export interface ToastOptions {
	title?: string;
	description?: string;
	duration?: number;
}

export const useToast = () => {
	const showSuccess = (message: string, options?: ToastOptions) => {
		toast.success(message, {
			duration: options?.duration || 3000,
			description: options?.description,
		});
	};

	const showError = (message: string, options?: ToastOptions) => {
		toast.error(message, {
			duration: options?.duration || 4000,
			description: options?.description,
		});
	};

	const showWarning = (message: string, options?: ToastOptions) => {
		toast.warning(message, {
			duration: options?.duration || 3500,
			description: options?.description,
		});
	};

	const showInfo = (message: string, options?: ToastOptions) => {
		toast.info(message, {
			duration: options?.duration || 3000,
			description: options?.description,
		});
	};

	const success = {
		plantCreated: () => showSuccess(SUCCESS_MESSAGES.PLANT_CREATED),
		plantUpdated: () => showSuccess(SUCCESS_MESSAGES.PLANT_UPDATED),
		plantDeleted: () => showSuccess(SUCCESS_MESSAGES.PLANT_DELETED),
		operationCreated: () => showSuccess(SUCCESS_MESSAGES.OPERATION_CREATED),
		operationUpdated: () => showSuccess(SUCCESS_MESSAGES.OPERATION_UPDATED),
		operationDeleted: () => showSuccess(SUCCESS_MESSAGES.OPERATION_DELETED),
		costsUpdated: () => showSuccess(SUCCESS_MESSAGES.COSTS_UPDATED),
	};

	const error = {
		generic: () => showError(ERROR_MESSAGES.GENERIC_ERROR),
		network: () => showError(ERROR_MESSAGES.NETWORK_ERROR),
		server: () => showError(ERROR_MESSAGES.SERVER_ERROR),
		validation: () => showError(ERROR_MESSAGES.VALIDATION_ERROR),
		plantNotFound: () => showError(ERROR_MESSAGES.PLANT_NOT_FOUND),
		operationNotFound: () => showError(ERROR_MESSAGES.OPERATION_NOT_FOUND),
		deleteError: () => showError(ERROR_MESSAGES.DELETE_ERROR),
		updateError: () => showError(ERROR_MESSAGES.UPDATE_ERROR),
		createError: () => showError(ERROR_MESSAGES.CREATE_ERROR),
	};

	const handleGraphQLError = (error: any) => {
		console.error('GraphQL Error:', error);

		if (error.networkError) {
			showError(ERROR_MESSAGES.NETWORK_ERROR);
		} else if (error.graphQLErrors?.length > 0) {
			const message = error.graphQLErrors[0].message;
			showError(message || ERROR_MESSAGES.SERVER_ERROR);
		} else {
			showError(ERROR_MESSAGES.GENERIC_ERROR);
		}
	};

	return {
		showSuccess,
		showError,
		showWarning,
		showInfo,
		success,
		error,
		handleGraphQLError,
	};
};
