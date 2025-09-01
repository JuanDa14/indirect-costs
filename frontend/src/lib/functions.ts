import { PLANT_CONFIG, FORMAT_CONFIG, OPERATION_CONFIG } from './constants';

/**
 * Genera un código automáticamente basado en el nombre de la planta
 * @param name - Nombre de la planta
 * @returns Código generado en mayúsculas
 */
export const generatePlantCode = (name: string): string => {
	if (!name.trim()) return '';

	// Remover acentos y caracteres especiales
	const normalized = name
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z\s]/g, '');

	// Tomar las primeras letras de cada palabra
	const words = normalized.trim().split(/\s+/);

	if (words.length === 1) {
		// Si es una sola palabra, tomar las primeras 2-3 letras
		return words[0].substring(0, PLANT_CONFIG.CODE_GENERATION.SINGLE_WORD_LENGTH).toUpperCase();
	} else {
		// Si son múltiples palabras, tomar la primera letra de cada una
		return words
			.map((word) => word.charAt(0))
			.join('')
			.substring(0, PLANT_CONFIG.CODE_GENERATION.MULTI_WORD_LENGTH)
			.toUpperCase();
	}
};

/**
 * Genera un código único añadiendo un número si ya existe
 * @param baseCode - Código base
 * @param existingCodes - Lista de códigos existentes
 * @returns Código único
 */
export const generateUniqueCode = (baseCode: string, existingCodes: string[]): string => {
	let uniqueCode = baseCode;
	let counter = 1;

	while (existingCodes.includes(uniqueCode)) {
		uniqueCode = `${baseCode}${counter}`;
		counter++;
	}

	return uniqueCode;
};

/**
 * Formatea un volumen en kg a una representación legible (kg/T)
 * @param volumeKg - Volumen en kilogramos
 * @returns Cadena formateada (ej: "300kg", "1T", "3.5T")
 */
export const formatVolume = (volumeKg: number): string => {
	if (volumeKg >= FORMAT_CONFIG.WEIGHT_UNITS.KG_THRESHOLD) {
		const tons = volumeKg / FORMAT_CONFIG.WEIGHT_UNITS.KG_THRESHOLD;
		return tons % 1 === 0
			? `${tons}T`
			: `${tons.toFixed(FORMAT_CONFIG.WEIGHT_UNITS.DECIMAL_PLACES_T)}T`;
	}
	return `${volumeKg.toFixed(FORMAT_CONFIG.WEIGHT_UNITS.DECIMAL_PLACES_KG)}kg`;
};

/**
 * Formatea un número como moneda
 * @param amount - Cantidad a formatear
 * @returns Cadena formateada como moneda
 */
export const formatCurrency = (amount: number): string => {
	const formatted = amount.toFixed(FORMAT_CONFIG.CURRENCY.DECIMAL_PLACES);

	if (FORMAT_CONFIG.CURRENCY.POSITION === 'before') {
		return `${FORMAT_CONFIG.CURRENCY.SYMBOL}${formatted}`;
	}
	return `${formatted}${FORMAT_CONFIG.CURRENCY.SYMBOL}`;
};

/**
 * Formatea un número con separadores de miles
 * @param num - Número a formatear
 * @param decimals - Número de decimales (opcional)
 * @returns Número formateado
 */
export const formatNumber = (num: number, decimals?: number): string => {
	const fixed = decimals !== undefined ? num.toFixed(decimals) : num.toString();
	return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, FORMAT_CONFIG.THOUSAND_SEPARATOR);
};

/**
 * Formatea un costo por kg con precisión adecuada
 * @param costPerKg - Costo por kilogramo
 * @returns Costo formateado
 */
export const formatCostPerKg = (costPerKg: number): string => {
	return costPerKg.toFixed(3);
};

/**
 * Valida si un código de planta es válido
 * @param code - Código a validar
 * @returns true si es válido
 */
export const isValidPlantCode = (code: string): boolean => {
	return PLANT_CONFIG.VALIDATION_PATTERNS.CODE_PATTERN.test(code);
};

/**
 * Valida si un nombre de planta es válido
 * @param name - Nombre a validar
 * @returns true si es válido
 */
export const isValidPlantName = (name: string): boolean => {
	return name.trim().length > 0 && PLANT_CONFIG.VALIDATION_PATTERNS.NAME_PATTERN.test(name.trim());
};

/**
 * Valida si un costo es válido
 * @param cost - Costo a validar
 * @returns true si es válido
 */
export const isValidCost = (cost: number): boolean => {
	return (
		cost >= OPERATION_CONFIG.COST_CONFIG.MIN_COST_PER_KG &&
		cost <= OPERATION_CONFIG.COST_CONFIG.MAX_COST_PER_KG
	);
};

/**
 * Valida si un volumen es válido
 * @param volume - Volumen a validar
 * @returns true si es válido
 */
export const isValidVolume = (volume: number): boolean => {
	return volume > 0 && Number.isFinite(volume);
};

/**
 * Normaliza una cadena removiendo acentos y caracteres especiales
 * @param str - Cadena a normalizar
 * @returns Cadena normalizada
 */
export const normalizeString = (str: string): string => {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param str - Cadena a capitalizar
 * @returns Cadena capitalizada
 */
export const capitalizeWords = (str: string): string => {
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

/**
 * Genera un ID único simple
 * @returns ID único
 */
export const generateId = (): string => {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function para optimizar llamadas
 * @param func - Función a hacer debounce
 * @param wait - Tiempo de espera en ms
 * @returns Función con debounce aplicado
 */
export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

/**
 * Compara dos arrays para ver si son iguales
 * @param arr1 - Primer array
 * @param arr2 - Segundo array
 * @returns true si son iguales
 */
export const arraysEqual = <T>(arr1: T[], arr2: T[]): boolean => {
	if (arr1.length !== arr2.length) return false;
	return arr1.every((val, index) => val === arr2[index]);
};

/**
 * Ordena un array de objetos por una propiedad específica
 * @param arr - Array a ordenar
 * @param key - Clave por la cual ordenar
 * @param direction - Dirección del ordenamiento
 * @returns Array ordenado
 */
export const sortBy = <T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
	return [...arr].sort((a, b) => {
		const aVal = a[key];
		const bVal = b[key];

		if (aVal < bVal) return direction === 'asc' ? -1 : 1;
		if (aVal > bVal) return direction === 'asc' ? 1 : -1;
		return 0;
	});
};

/**
 * Obtiene los umbrales de volumen únicos de una lista de operaciones
 * Siempre incluye volúmenes predeterminados más cualquier volumen adicional existente
 * @param operations - Lista de operaciones
 * @returns Array de volúmenes únicos ordenados
 */
export const getUniqueVolumeThresholds = (operations: any[]): number[] => {
	const volumes = new Set<number>();

	// Siempre incluir los volúmenes predeterminados
	OPERATION_CONFIG.DEFAULT_VOLUME_THRESHOLDS.forEach((threshold) => {
		volumes.add(threshold);
	});

	// Agregar también cualquier volumen existente de las operaciones
	operations.forEach((operation) => {
		operation.costs?.forEach((cost: any) => {
			volumes.add(cost.volumeThresholdKg);
		});
	});

	return Array.from(volumes).sort((a, b) => a - b);
};

/**
 * Encuentra el costo para un volumen específico en una operación
 * @param operation - Operación
 * @param volumeThreshold - Umbral de volumen
 * @returns Costo encontrado o null
 */
export const findCostForVolume = (operation: any, volumeThreshold: number): any | null => {
	return operation.costs?.find((cost: any) => cost.volumeThresholdKg === volumeThreshold) || null;
};

/**
 * Calcula el costo total para un volumen específico considerando todas las operaciones
 * @param operations - Lista de operaciones
 * @param volumeKg - Volumen en kilogramos
 * @returns Costo total
 */
export const calculateTotalCost = (operations: any[], volumeKg: number): number => {
	return operations.reduce((total, operation) => {
		const cost = findCostForVolume(operation, volumeKg);
		return total + (cost ? cost.costPerKg * volumeKg : 0);
	}, 0);
};
