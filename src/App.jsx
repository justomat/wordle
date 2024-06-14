import {
	Suspense,
	createRef,
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useReducer,
} from "react"
import "./App.css"
import { GearIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { useAtom, useAtomValue } from "jotai"

import { Button } from "./components/ui/button"
import { answerAtom, createTileAtom, gameAtom, wordsAtom } from "./lib/state"

function Header() {
	const Title = () => <h1 className="font-serif text-3xl font-bold">Wordle</h1>

	return (
		<header className="w-screen">
			<div className="flex flex-row items-center justify-between p-4">
				<HamburgerMenuIcon />

				<Title />

				<span>
					<GearIcon />
				</span>
			</div>
			<hr />
		</header>
	)
}

/** @typedef {"none" | "typed" | "absent" | "displaced" | "correct"} State */

const Tile = memo(({ id }) => {
	const tileAtom = useMemo(() => createTileAtom(id), [id])
	const value = useAtomValue(tileAtom)
	const [state] = useAtom(gameAtom)

	const shake = useMemo(() => {
		if (state.status === "false") {
			return "animate-shake"
		}
	}, [state])

	const style = useMemo(() => {
		if (value) {
			return "border-zinc-500 animate-flip"
		} else {
			return "border-gray-300 upside-down"
		}
	}, [value])

	return (
		<input
			id={id}
			contentEditable={false}
			maxLength={1}
			value={value || ""}
			readOnly
			className={`${style} ${shake} text-center caret-transparent uppercase pointer-events-none flex justify-center items-center text-3xl border-2 min-w-[1ch] max-w-10 min-h-10`}
		/>
	)
})

function Tiles() {
	return (
		<section id="tiles" className="flex items-center justify-center">
			<div className="grid grid-cols-5 gap-1 m-4 auto-rows-fr">
				{Array.from({ length: 30 }).map((_, i) => {
					return <Tile key={i} id={`${i}`} />
				})}
			</div>
		</section>
	)
}

/**
 * @param {{ id: string, state?: State }} props
 * @returns {JSX.Element}
 */
const Key = memo(({ id, state = "none" }) => {
	const [, dispatch] = useAtom(gameAtom)

	const handleClick = useCallback(() => {
		dispatch({ type: "press", payload: id })
	}, [dispatch, id])

	let style = useMemo(() => {
		switch (state) {
			case "none":
				return "bg-gray-300 text-black"
			case "typed":
				return "bg-gray-500 text-white"
			case "displaced":
				return "bg-amber-400 text-white"
			case "correct":
				return "bg-green-500 text-white"
			default:
				return ""
		}
	}, [state])

	return (
		<Button
			id={id}
			onClick={handleClick}
			className={`${style} rounded h-14 max-w-[1ch] hover:bg-unset`}
		>
			<h4 className="text-lg font-semibold tracking-tight uppercase">{id}</h4>
		</Button>
	)
})

const Row = ({ children }) => (
	<div className="flex flex-row justify-center gap-2 mb-2">{children}</div>
)

const Keyboard = memo(() => {
	return (
		<section id="keyboard" className="mx-2">
			<Row>
				{"qwertyuiop".split("").map(id => (
					<Key key={id} id={id} />
				))}
			</Row>
			<Row>
				{"asdfghjkl".split("").map(id => (
					<Key key={id} id={id} />
				))}
			</Row>
			<Row>
				<Key id="⏎" />
				{"zxcvbnm".split("").map(id => (
					<Key key={id} id={id} />
				))}
				<Key id="⌫" />
			</Row>
		</section>
	)
})

function Game({ answer }) {
	const [, dispatch] = useAtom(gameAtom)

	const handleKeyPress = useCallback(key => {
		dispatch({ type: "press", payload: key })
	})

	useEffect(() => {
		let handler = e => handleKeyPress(e.key)
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [handleKeyPress])

	return (
		<article className="flex flex-col items-center flex-1">
			<Header />
			<main className="max-w-[480px]">
				<Tiles />
				<Keyboard handleKeyPress={handleKeyPress} />
			</main>
			<footer></footer>
		</article>
	)
}

function App() {
	const answer = useAtomValue(answerAtom)
	const game = useAtomValue(gameAtom)

	useEffect(() => {
		console.log(JSON.stringify(game))
	}, [game])

	return answer && <Game answer={answer} />
}

export default memo(App)
