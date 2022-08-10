import React, { FC } from "react"
import { ThemeProvider } from "@mui/material"
import { theme } from "./theme"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import HomePage from "./pages/HomePage"

const App: FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path={"/sign-up"} element={<Signup />} />

					<Route path={"/sign-in"} element={<Signin />} />

					<Route path={"/"} element={<HomePage />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
