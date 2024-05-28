import { useMemo } from "react"
import "./App.css"
import { Button } from "./components/ui/button"

function Header() {
	const Title = () => <h1 className="text-3xl font-bold font-serif">Wordle</h1>

	return (
		<header>
			<div className="flex flex-row justify-between items-center p-4">
				<span>a</span>
				<Title />
				<span>b</span>
			</div>
			<hr />
		</header>
	)
}

const Key = ({ label, state = "used" }) => {
	let variant = useMemo(() => {
		switch (state) {
			case "unused":
			default:
				return "secondary"
		}
	}, [state])

	let clazz = useMemo(() => {
		switch (state) {
			case "used":
				return "bg-gray-500 text-white"
			default:
				return ""
		}
	}, [state])

	return <Button className={`${clazz}`} variant={variant} children={label} />
}
const Row = ({ children }) => (
	<div className="flex flex-row justify-center gap-2 mb-2">{children}</div>
)

function Keyboard() {
	return (
		<div className="flex-1 mx-2 w-[500px]">
			<Row>
				{"QWERTYUIOP".split("").map(label => (
					<Key key={label} label={label} />
				))}
			</Row>
			<Row>
				{"ASDFGHJKL".split("").map(label => (
					<Key key={label} label={label} />
				))}
			</Row>
			<Row>
				<Key label="⏎" />
				{"ZXCVBNM".split("").map(label => (
					<Key key={label} label={label} />
				))}
				<Key label="⌫" />
			</Row>
		</div>
	)
}

function App() {
	return (
		<article className="min-w-[500px]">
			<Header />
			<main className="flex flex-1 justify-center">
				<section />
				<section id="keyboard">
					<Keyboard />
				</section>
			</main>
			<footer></footer>
		</article>
	)
}

export default App
