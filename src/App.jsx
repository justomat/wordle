import { useEffect, useMemo, useReducer } from "react"
import "./App.css"
import { Button } from "./components/ui/button"
import { GearIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"

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

function Attempt() {
	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				let form = e.target
				let data = new FormData(form)
				let values = Array.from(data.values()).filter(Boolean)
				console.log(values)
				if (values.length !== 5) {
					form.children.forEach(child => {
						child.classlist.add("animate-shake")
					})
					setTimeout(() => {
						form.reset()
					}, 1000)
				}
			}}
		>
			<input type="text" name="value" maxLength={1} />
			<input type="text" name="value" maxLength={1} />
			<input type="text" name="value" maxLength={1} />
			<input type="text" name="value" maxLength={1} />
			<input type="text" name="value" maxLength={1} />
			<input type="submit" value="hi" />
		</form>
	)
}

const Tile = ({ value }) => (
	<div className="flex justify-center items-center text-3xl border border-gray-300 min-w-[1ch] max-w-10 min-h-10">
		{value}
	</div>
)

function Tiles() {
	return (
		<section id="tiles" className="flex items-center justify-center">
			<div className="grid grid-cols-5 gap-1 m-4 auto-rows-fr">
				{Array.from({ length: 30 }).map((_, i) => {
					let value = i + 1
					return <Tile key={i} id={value} value={value} />
				})}
			</div>
		</section>
	)
}

/**
 * @param {{ id: string, state?: State }} props
 * @returns {JSX.Element}
 */
const Key = ({ id, state = "none", value }) => {
	let className = useMemo(() => {
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
		<Button className={`${className} rounded h-14 max-w-[1ch] hover:bg-unset`}>
			<h4 className="text-lg font-semibold tracking-tight">{value ?? id}</h4>
		</Button>
	)
}

const Row = ({ children }) => (
	<div className="flex flex-row justify-center gap-2 mb-2">{children}</div>
)

function Keyboard() {
	return (
		<section id="keyboard" className="mx-2">
			<Row>
				{"QWERTYUIOP".split("").map(id => (
					<Key key={id} id={id} />
				))}
			</Row>
			<Row>
				{"ASDFGHJKL".split("").map(id => (
					<Key key={id} id={id} />
				))}
			</Row>
			<Row>
				<Key id="⏎" />
				{"ZXCVBNM".split("").map(id => (
					<Key key={id} id={id} />
				))}
				<Key id="⌫" />
			</Row>
		</section>
	)
}

const initial = { answer: "" }
const decoder = new TextDecoder()

const initializer = async () => {
	try {
		const res = await fetch("/words.txt")
		const buffer = await res.arrayBuffer()

		const array = new Uint8Array(buffer)
		const index = Math.floor(Math.random() * (array.length / 6))
		const slice = array.subarray(index * 6, index * 6 + 5)

		const answer = decoder.decode(slice)

		return { answer }
	} catch (error) {
		console.error(error)
	}
}

const reducer = (state, action) => {
	switch (action.press) {
		default:
			return state
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, initial, initializer)

	useEffect(() => {
		const handler = e => {
			dispatch({ press: e.key })
		}
		window.addEventListener("keydown", handler)
		return () => {
			window.removeEventListener("keydown", handler)
		}
	}, [])

	return (
		<article className="flex flex-col items-center flex-1">
			<Header />
			<main className="max-w-[480px]">
				<Tiles />
				<Keyboard />
			</main>
			<footer></footer>
		</article>
	)
}

export default App
