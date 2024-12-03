import fs from 'fs'
import path from 'path'
function main() {
	const fileName = process.argv.find((arg) => arg.startsWith('--file='))?.split('=')[1]
	if (!fileName) {
		console.log('please provide a file name')
		process.exit(1)
	}

	const fileReader = fs.createReadStream(path.join(process.cwd(), fileName))
	const sim1 = new Map()
	const sim2 = new Map()

	fileReader.on('data', (chunk) => {
		chunk
			.toString()
			.split('\n')
			.forEach((row) => {
				const [item1, item2] = row.split('   ').map((a) => parseInt(a))
				if (isNaN(item1) || isNaN(item2)) return
				const a = sim1.get(item1) ?? 0
				sim1.set(item1, a + 1)
				const b = sim2.get(item2) ?? 0
				sim2.set(item2, b + 1)
			})
	})
	fileReader.on('end', () => {
		calculateSimilarity(sim1, sim2)
	})
}
/**
 *
 * @param {Map<number, number>} sim1
 * @param {Map<number, number>} sim2
 */
function calculateSimilarity(sim1, sim2) {
	let sum = 0
	sim1.forEach((key, value) => {
		sum += key * value * (sim2.get(value) ?? 0)
	})
	console.log('Total distance: ', sum)
}
main()
