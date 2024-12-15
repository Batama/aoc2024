'use strict'
import fs from 'fs'
import path from 'path'
const pageOrder = []
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
		const [section1, section2] = fileContents.split('\n\n')

		const pageOrderingRules = section1.split('\n').map((row) =>
			row
				.trim()
				.split('|')
				.map((a) => parseInt(a))
		)
		const pageOrderingRule = generateMap(pageOrderingRules)

		const updates = section2
			.trim()
			.split('\n')
			.map((row) =>
				row
					.trim()
					.split(',')
					.map((a) => parseInt(a))
			)

		const correctLevelMiddleSum = processUpdates(updates, pageOrderingRule)
		console.log("Sum of correct levels' middle: ", correctLevelMiddleSum)
		process.exit(0)
	})
}
/**
 * Function to generate 2D char map
 * @param {[number,number][]} wordsMap
 * @returns {Map<number, {pre: number[], post:number[]}>} map
 */
function generateMap(wordsMap) {
	const map = new Map()
	wordsMap.forEach(([pageA, pageB]) => {
		// initialize page A if not exist
		if (!map.has(pageA)) map.set(pageA, { pre: [], post: [] })
		map.get(pageA).post.push(pageB)
		// initialize page B if not exist
		if (!map.has(pageB)) map.set(pageB, { pre: [], post: [] })
		map.get(pageB).pre.push(pageA)
	})
	return map
}
/**
 * Function that returns the sum of pages that in correct order
 * @param {number[][]} updateList
 * @param {Map<number, {pre: number[], post: number[]}>} map
 * @returns {number} sumCorrectMiddlePages
 */
function processUpdates(updateList, map) {
	return updateList.reduce((prev, pageList) => {
		const isUpdateCorrect = isPagesInCorrectOrder(pageList, map)
		if (!isUpdateCorrect) return prev
		const middlePage = getMiddleItem(pageList)
		return prev + middlePage
	}, 0)
}
/**
 * Function to check if page is in correct order
 * iterate each input in page by map
 * @param {number[]} pages
 * @param {Map<number, {pre: number[], post:number[]}>} map
 * @returns {boolean}
 */
function isPagesInCorrectOrder(pages, map) {
	return pages.every((l, i) => {
		if (!map.has(l)) throw new Error('no mapItem' + l)
		const mapItem = map.get(l)
		const itemsBefore = pages.slice(0, i)
		const itemsAfter = pages.slice(i + 1, pages.length)
		const beforeIncludes = itemsBefore.every((p) => mapItem.pre.includes(p))
		const afterIncludes = itemsAfter.every((p) => mapItem.post.includes(p))
		return beforeIncludes && afterIncludes
	})
}
/**
 * Function to get middle item
 * @param {number[]} items
 * @returns {number}
 */
function getMiddleItem(items) {
	return items[Math.floor(items.length / 2)]
}
main()
