import { prismaService } from '../common/database/index.js';
import { PlantService } from '../modules/plants/index.js';
import { OperationService } from '../modules/operations/index.js';
import { DEFAULT_THRESHOLDS } from '../modules/operations/types/index.js';

async function seedDatabase() {
	try {
		console.log(' Iniciando seed de la base de datos...');

		await prismaService.connect();

		const plantService = new PlantService();
		const operationService = new OperationService();

		console.log('Limpiando datos existentes...');
		await prismaService.indirectCost.deleteMany({});
		await prismaService.operation.deleteMany({});
		await prismaService.plant.deleteMany({});

		console.log('Creando planta de ejemplo...');
		const plant = await plantService.create({
			name: 'Planta Lima',
			code: 'LIM',
		});

		const operations = ['Impresión', 'Laminado', 'Embolsado'];

		console.log('Creando operaciones de ejemplo...');
		for (const operationName of operations) {
			const costs = DEFAULT_THRESHOLDS.map((threshold) => ({
				volumeThresholdKg: threshold,
				costPerKg: 0,
			}));

			await operationService.create({
				plantId: plant.id,
				name: operationName,
				costs,
			});
		}

		console.log('🎉 Seed completado exitosamente!');
	} catch (error) {
		console.error('Error durante el seed:', error);
		throw error;
	} finally {
		await prismaService.disconnect();
		process.exit(0);
	}
}

seedDatabase().catch((error) => {
	console.error('Fallo crítico en el seed:', error);
	process.exit(1);
});
