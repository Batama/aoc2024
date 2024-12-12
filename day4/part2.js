'use strict'
import fs from 'fs'
import path from 'path'

const wordToFind = 'MAS'
const wordMutations = ['MAS', 'SAM']
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
		const wordCount = getCountCrossMAS(wordsMap)
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
 * Function to return coordinates of 'A'
 * @param {string[][]} map
 * @returns {[][number, number]}
 */
function getCountCrossMAS(map) {
	let count = 0
	for (let y = 1; y < map.length - 1; y++) {
		for (let x = 1; x < map[y].length - 1; x++) {
			if (map[y][x] === 'A' && isCrossMAS(map, [y, x])) count++
		}
	}
	return count
}
/**
 * Function to detect if A forms 2 'MAS' diagonally.
 * @param {string[][]} map
 * @param {[y: number, x: number]} point
 * @returns {number} count 0 | 1
 */
function isCrossMAS(map, point) {
	const TLDR = map[point[0] - 1][point[1] - 1] + map[point[0]][point[1]] + map[point[0] + 1][point[1] + 1]
	const TRDL = map[point[0] - 1][point[1] + 1] + map[point[0]][point[1]] + map[point[0] + 1][point[1] - 1]
	return wordMutations.includes(TRDL) && wordMutations.includes(TLDR)
}
main()
