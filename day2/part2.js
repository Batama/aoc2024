import fs from 'fs'
import path from 'path'
const minimumDifference = 1
const maximumDifference = 3
function main() {
	const fileName = process.argv.find((arg) => arg.startsWith('--file='))?.split('=')[1]
	if (!fileName) {
		console.log('please provide a file name')
		process.exit(1)
	}

	const fileReader = fs.createReadStream(path.join(process.cwd(), fileName))
	const collection = []
	let safeReportsCount = 0
	fileReader.on('data', (chunk) => {
		chunk
			.toString()
			.split('\n')
			.forEach((row) => {
				const levels = row.split(' ').map((a) => parseInt(a))
				const isSafe = levels.some((v, i, a) => {
					const a1 = [...a]
					a1.splice(i, 1)
					return isLevelsSafe(a1)
				})
				if (isSafe) safeReportsCount++
			})
	})
	fileReader.on('end', () => {
		console.log('Safe reports count: ', safeReportsCount)
	})
}
/**
 * @param {number} a - integer
 * @returns {boolean}
 */
function isDifferenceSafe(a) {
	const difference = Math.abs(a)
	return difference >= minimumDifference && difference <= maximumDifference
}
/**
 *
 * @param {number} prev
 * @param {number} cur
 */
function isDifferenceSameSign(prev, cur) {
	return Math.sign(prev) === Math.sign(cur)
}
/**
 * @param {number[]} list - Array<integer>
 * @returns {boolean}
 */
function isLevelsSafe(list) {
	if (list.some(isNaN)) return false
	if (list.length === 0) return false
	if (list.length === 1) return true
	if (list.length === 2) return isDifferenceSafe(list[1] - list[0])

	const isInitialIncreasing = list[1] - list[0]
	for (let i = 1; i < list.length; i++) {
		const difference = list[i] - list[i - 1]
		if (!isDifferenceSafe(difference)) return false
		if (!isDifferenceSameSign(isInitialIncreasing, difference)) return false
	}
	return true
}
main()
