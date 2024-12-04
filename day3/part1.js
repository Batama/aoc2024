import fs from 'fs'
import path from 'path'

const mulRegex = new RegExp(/mul\([0-9]{1,3},[0-9]{1,3}\)/g)
function main() {
	const fileName = process.argv.find((arg) => arg.startsWith('--file='))?.split('=')[1]
	if (!fileName) {
		console.log('please provide a file name')
		process.exit(1)
	}

	const fileReader = fs.createReadStream(path.join(process.cwd(), fileName))
	let sum = 0
	const buf = []
	fileReader.on('data', (chunk) => {
		buf.push(chunk)
	})
	fileReader.on('end', () => {
		Buffer.concat(buf)
			.toString('utf-8')
			.split('\n')
			.forEach((row) => {
				if (!row) return
				const result = getPairsForMultiplication(row)
					// multiply pairs
					.map((pair) => pair[0] * pair[1])
					// sum multiplication pairs
					.reduce((a, b) => a + b)
				sum += result
			})
		console.log('Total sum: ', sum)
		process.exit(0)
	})
}
/**
 *
 * @param {string} str
 */
function getPairsForMultiplication(str) {
	return [...str.matchAll(mulRegex)].map(
		(a) =>
			a[0] // the entire match
				.replace('mul(', '') // shave off the 'mul('
				.replace(')', '') // shave off the ')'
				.split(',') // split on ',' to get the two numbers
				.map((a) => parseInt(a)) // convert to int
	)
}
main()
