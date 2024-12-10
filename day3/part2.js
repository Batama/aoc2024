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

	const buf = []
	fileReader.on('data', (chunk) => {
		buf.push(chunk)
	})
	fileReader.on('end', () => {
		const noisyEnabledMultiplications = Buffer.concat(buf)
			.toString('utf-8')
			.replaceAll('\n', '')
			.split('do()') // split on 'do()'
			.reduce((p, c) => p + removeDisableMultiplications(c), '')

		const sum = getPairsForMultiplication(noisyEnabledMultiplications)
			.map(([a, b]) => a * b) // multiply pairs
			.reduce((a, b) => a + b) // sum multiplication pairs

		console.log('Total sum: ', sum)
		process.exit(0)
	})
}
/**
 * Returns the first part of the string where there is no 'don't'.
 * If there is no 'don't', returns an empty string
 * @param {string} str
 * @returns {string}
 */
function removeDisableMultiplications(str) {
	return str.split("don't()")[0] ?? ''
}
/**
 *
 * @param {string} str
 * @returns {[number,number]}
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
