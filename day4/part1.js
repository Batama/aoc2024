'use strict'
import fs from 'fs'
import path from 'path'

const wordToFind = 'XMAS'
// const directions = [[0, 1]] // right only
// all 8 directions
const directions = [
	[0, 1], // right
	[0, -1], // left
	[1, 0], // up
	[-1, 0], // down
	[1, 1], // right up
	[1, -1], // left up
	[-1, 1], // left down
	[-1, -1] // right down
]
function main() {
	const fileName = process.argv.find((arg) => arg.startsWith('--file='))?.replace('--file=', '')
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
		const fileContents = Buffer.concat(buf).toString('utf-8')
		const wordsMap = generateMap(fileContents)
		const wordCount = directions.reduce((p, direction) => p + countWordLinear(wordsMap, ...direction), 0)
		console.log('Total word count: ', wordCount)
		process.exit(0)
	})
}
/**
 * Function to generate 2D char map
 * @param {string} wordsMap
 * @returns {string[][]}
 */
function generateMap(wordsMap) {
	return wordsMap.split('\n').map((row) => row.trim().split(''))
}
/**
 *
 * @param {string[][]} map
 * @param {number} y
 * @param {number} x
 * @param {number} dy
 * @param {number} dx
 * @returns {string}
 */
function getWordByLine(map, y, x, dy, dx) {
	if (!map[y + 3 * dy][x + 3 * dx]) return ''
	return map[y][x] + map[y + dy][x + dx] + map[y + 2 * dy][x + 2 * dx] + map[y + 3 * dy][x + 3 * dx]
}
/**
 * Function to count word in 2D char map
 * @param {[string,string]} map
 * @param {number} stepY -1 | 0 | 1
 * @param {number} stepX -1 | 0 | 1
 * @returns {number} wordCount
 */
function countWordLinear(map, stepY, stepX) {
	let mapLengthY = map[0].length
	let mapLengthX = map.length
	let count = 0
	// increment by step i and j
	for (let y = 0; y < mapLengthY; y++) {
		const yBorder = y + 3 * stepY
		if (yBorder >= mapLengthY || yBorder < 0) continue
		for (let x = 0; x < mapLengthX; x++) {
			const xBorder = x + 3 * stepX
			if (xBorder >= mapLengthX || xBorder < 0) continue
			let guess = getWordByLine(map, y, x, stepY, stepX)
			if (guess === wordToFind) {
				console.log('y', y, 'x', x, 'stepY', stepY, 'stepX', stepX, 'guess: ', guess)
				count++
			}
		}
	}
	return count
}
main()
