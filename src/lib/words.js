export const fetchWords = () =>
	fetch("/words.txt")
		// .then(r => new Promise(resolve => setTimeout(() => resolve(r), 2000)))
		.then(r => r.text())
		.then(lines => lines.split("\n"))

export function getRandomWord(words) {
	const index = Math.floor(Math.random() * words.length)
	return words[index]
}
