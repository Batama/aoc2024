import fs from 'fs'
import path from 'path'
function main() {
	const fileName = process.argv.find((arg) => arg.startsWith('--file='))?.split('=')[1]
	if (!fileName) {
		console.log('please provide a file name')
		process.exit(1)
	}

	const fileReader = fs.createReadStream(path.join(process.cwd(), fileName))
	const list1 = [],
		list2 = []

	fileReader.on('data', (chunk) => {
		chunk
			.toString()
			.split('\n')
			.forEach((row) => {
				const [item1, item2] = row.split('   ')
				if (isNaN(item1) || isNaN(item2)) return
				list1.push(parseInt(item1))
				list2.push(parseInt(item2))
			})
	})
	fileReader.on('end', () => {
		list1.sort((a, b) => a - b)
		list2.sort((a, b) => a - b)
		calculateDistance(list1, list2)
	})
}
function calculateDistance(list1, list2) {
	if (list1.length !== list2.length) throw new Error('Lists are not the same length')

	let distance = 0
	for (let i = 0; i < list1.length; i++) distance += Math.abs(list1[i] - list2[i])

	console.log('Total distance: ', distance)
}
main()
