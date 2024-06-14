import { atom } from "jotai"
import { atomFamily, atomWithReducer, atomWithReset } from "jotai/utils"
import { fetchWords, getRandomWord } from "./words"

export const wordsAtom = atom(fetchWords)

export const answerAtom = atomWithReset(async get => {
	const words = await get(wordsAtom)
	const word = getRandomWord(words)
	return word
})

const initial = {
	index: 0,
	chars: [],
}

const isFront = i => i % 5 === 0
const isBack = i => i % 5 === 4

const gameReducer = (state, action) => {
	console.log(action)
	switch (action.type) {
		case "press": {
			let { index, chars } = state

			let key = action.payload
			if (key === "⌫" || key === "Backspace") {
				if (!isFront(index)) {
					return { ...state, index: index - 1, chars: chars.slice(0, -1) }
				} else if (chars[index]) {
					return { ...state, chars: chars.slice(0, -1) }
				}
			} else if (key === "⏎" || key === "Enter") {
				if (isBack(index) && chars[index]) {
					return { ...state, index: index + 1 }
				}
			} else if (key.length === 1 && key.match(/[a-z]/i)) {
				let draft = { ...state }
				if (!chars[index]) draft.chars[index] = key
				if (!isBack(index)) draft.index += 1
				return draft
			}
			return state
		}
		case "reset":
			return initial
		default:
			return state
	}
}

export const gameAtom = atomWithReducer(initial, gameReducer)

export const createTileAtom = atomFamily(id =>
	atom(get => {
		const { chars } = get(gameAtom)
		return chars[id]
	}),
)
