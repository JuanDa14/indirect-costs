export class PrismaErrorHandler {
	static handleError(error: any): never {
		// Si no es un error de Prisma, relanzar el error original
		if (!error.code || !error.code.startsWith('P')) {
			throw error;
		}

		switch (error.code) {
			case 'P2002': // Unique constraint failed
				return this.handleUniqueConstraintError(error);

			case 'P2003': // Foreign key constraint failed
				return this.handleForeignKeyError(error);

			case 'P2025': // Record not found
				throw new Error('El elemento que intentas modificar no existe');

			case 'P2016': // Query interpretation error
				throw new Error('Los datos proporcionados no son válidos');

			case 'P2021': // Table does not exist
				throw new Error('Error interno del sistema. Contacta al administrador');

			case 'P2022': // Column does not exist
				throw new Error('Error interno del sistema. Contacta al administrador');

			default:
				// Para códigos de error no manejados específicamente
				throw new Error('Ha ocurrido un error inesperado. Por favor, intenta de nuevo');
		}
	}

	private static handleUniqueConstraintError(error: any): never {
		const target = error.meta?.target;

		if (!target) {
			throw new Error('Ya existe un elemento con esos datos');
		}

		// Manejar errores específicos según los campos únicos
		if (target.includes('plantId_name')) {
			throw new Error('Ya existe una operación con ese nombre en la planta seleccionada');
		}

		if (target.includes('code')) {
			throw new Error('Ya existe una planta con ese código');
		}

		if (target.includes('name')) {
			throw new Error('Ya existe un elemento con ese nombre');
		}

		if (target.includes('email')) {
			throw new Error('Ya existe un usuario con ese email');
		}

		// Mensaje genérico para otros casos
		throw new Error('Ya existe un elemento con esos datos');
	}

	private static handleForeignKeyError(error: any): never {
		const field = error.meta?.field_name;

		if (field?.includes('plant')) {
			throw new Error('La planta seleccionada no existe');
		}

		if (field?.includes('operation')) {
			throw new Error('La operación seleccionada no existe');
		}

		// Mensaje genérico
		throw new Error('Uno de los elementos relacionados no existe');
	}
}

export function handlePrismaErrors(
	target: any,
	propertyName: string,
	descriptor: PropertyDescriptor
) {
	const method = descriptor.value;

	descriptor.value = async function (...args: any[]) {
		try {
			return await method.apply(this, args);
		} catch (error) {
			PrismaErrorHandler.handleError(error);
		}
	};

	return descriptor;
}
