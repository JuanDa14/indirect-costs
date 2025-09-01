export const APP_CONFIG = {
	PLANT_CODE_MAX_LENGTH: 10,
	PLANT_NAME_MAX_LENGTH: 100,
	OPERATION_NAME_MAX_LENGTH: 100,

	FORM_VALIDATION: {
		MIN_COST_VALUE: 0,
		MAX_COST_VALUE: 999999,
		DECIMAL_PLACES: 3,
	},

	GRAPHQL_ENDPOINT: import.meta.env.PUBLIC_API_URL || 'http://localhost:4000/graphql',

	UI: {
		DEBOUNCE_DELAY: 300,
		LOADING_DELAY: 200,
		TOAST_DURATION: 3000,
	},
} as const;

export const VALIDATION_MESSAGES = {
	REQUIRED_FIELD: 'Este campo es obligatorio',
	INVALID_EMAIL: 'Ingrese un email válido',
	INVALID_NUMBER: 'Ingrese un número válido',
	MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
	MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
	POSITIVE_NUMBER: 'El número debe ser mayor a 0',
	PLANT_CODE_EXISTS: 'Este código de planta ya existe',
	OPERATION_NAME_EXISTS: 'Esta operación ya existe en la planta',
} as const;

export const SUCCESS_MESSAGES = {
	PLANT_CREATED: 'Planta creada exitosamente',
	PLANT_UPDATED: 'Planta actualizada exitosamente',
	PLANT_DELETED: 'Planta eliminada exitosamente',
	OPERATION_CREATED: 'Operación creada exitosamente',
	OPERATION_UPDATED: 'Operación actualizada exitosamente',
	OPERATION_DELETED: 'Operación eliminada exitosamente',
	COSTS_UPDATED: 'Costos actualizados exitosamente',
} as const;

export const ERROR_MESSAGES = {
	GENERIC_ERROR: 'Ha ocurrido un error inesperado',
	NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet',
	SERVER_ERROR: 'Error del servidor. Intente nuevamente más tarde',
	VALIDATION_ERROR: 'Por favor, verifique los datos ingresados',
	PLANT_NOT_FOUND: 'No se encontró la planta especificada',
	OPERATION_NOT_FOUND: 'No se encontró la operación especificada',
	DELETE_ERROR: 'No se pudo eliminar el elemento',
	UPDATE_ERROR: 'No se pudo actualizar el elemento',
	CREATE_ERROR: 'No se pudo crear el elemento',
} as const;

export const PLANT_CONFIG = {
	CODE_GENERATION: {
		SINGLE_WORD_LENGTH: 3,
		MULTI_WORD_LENGTH: 4,
		FALLBACK_LENGTH: 2,
	},

	VALIDATION_PATTERNS: {
		CODE_PATTERN: /^[A-Z0-9]{1,10}$/,
		NAME_PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
	},
} as const;

export const OPERATION_CONFIG = {
	DEFAULT_VOLUME_THRESHOLDS: [300, 500, 1000, 3000, 5000, 10000, 15000, 20000, 25000, 30000],

	COST_CONFIG: {
		MIN_COST_PER_KG: 0.001,
		MAX_COST_PER_KG: 100,
		DEFAULT_COST_PER_KG: 0.02,
	},
} as const;

export const FORMAT_CONFIG = {
	DECIMAL_SEPARATOR: '.',
	THOUSAND_SEPARATOR: ',',

	CURRENCY: {
		SYMBOL: '$',
		// 'before' | 'after'
		POSITION: 'before',
		DECIMAL_PLACES: 2,
	},

	WEIGHT_UNITS: {
		KG_THRESHOLD: 1000,
		DECIMAL_PLACES_KG: 0,
		DECIMAL_PLACES_T: 1,
	},
} as const;
