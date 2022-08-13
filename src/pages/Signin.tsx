import React, { ChangeEvent, FC, FormEventHandler, useEffect, useState } from "react"
import { AxiosResponse } from "axios"
import axios from "api/axios"
import { isValidEmail } from "utils"
import { ICredentials, IValidation } from "types/IAuth"
import { useNavigate } from "react-router-dom"
import { InputForm, lightText, Link, navigationTitle } from "layouts/AuthenticateLayout/styles"
import GoogleButton from "react-google-button"
import { getGoogleAuthUrl, signInWithEmailAndPassword } from "api/auth"
import { Link as MuiLink, TextField } from "@mui/material"
import { RoundedButton } from "elements/button"

const Signin: FC = () => {
	const navigate = useNavigate()

	const [credentialsForm, setCredentialsForm] = useState<ICredentials>({
		email: "",
		password: "",
	})
	const [emailValidation, setEmailValidation] = useState<IValidation>({
		helperText: "",
		error: false,
	})
	const [passwordValidation, setPasswordValidation] = useState<IValidation>({
		helperText: "",
		error: false,
	})

	async function signin() {
		let response: AxiosResponse
		try {
			// @ts-ignore
			await signInWithEmailAndPassword(credentialsForm.email, credentialsForm.password)

			navigate("/")
		} catch (e) {
			// @ts-ignore
			response = e.response as AxiosResponse
			if (response?.status === 403) {
				setPasswordValidation({
					error: true,
					helperText: "Invalid password",
				})
			} else if (response?.status === 404) {
				setEmailValidation({
					error: true,
					helperText: "User not found",
				})
			} else if (response.status === 307) {
				response = await axios.get(response.data.redirectUrl)
				window.location.href = response.data.authorization_url
			}
		}
	}

	function validation(): boolean {
		if (isValidEmail(credentialsForm.email) || credentialsForm.email.length === 0) {
			setEmailValidation(() => ({
				error: false,
				helperText: "",
			}))
		} else {
			setEmailValidation(() => ({
				error: true,
				helperText: "Please enter a valid email",
			}))
		}
		if (credentialsForm.password.length > 6 || credentialsForm.password.length === 0) {
			setPasswordValidation(() => ({
				error: false,
				helperText: "",
			}))
		} else {
			setPasswordValidation(() => ({
				error: true,
				helperText: "Password must be at least 7 characters",
			}))
		}
		return !(emailValidation.error && passwordValidation.error)
	}

	const formSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()

		if (credentialsForm.email.length === 0) {
			setEmailValidation({
				error: true,
				helperText: "Please enter an email",
			})
			return
		}
		if (credentialsForm.password.length === 0) {
			setPasswordValidation({
				error: true,
				helperText: "Please enter a password",
			})
			return
		}

		if (validation()) {
			await signin()
		}
	}

	function onStateChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
		setCredentialsForm({
			...credentialsForm,
			[event.target.name]: event.target.value,
		})
	}

	useEffect(() => {
		validation()
	}, [credentialsForm]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<div>
				<span style={lightText}>SignIn</span>
			</div>
			<div>
				<GoogleButton
					onClick={async () => {
						await getGoogleAuthUrl()
					}}
					label={"SignIn with Google"}
					type={"light"}
				/>
			</div>
			<div>
				<p style={lightText}>OR</p>
			</div>
			<InputForm onSubmit={formSubmit}>
				<TextField
					fullWidth
					error={emailValidation.error}
					size={"small"}
					helperText={emailValidation.helperText}
					variant={"standard"}
					name={"email"}
					label={"Email"}
					value={credentialsForm.email}
					onChange={onStateChange}
				/>
				<TextField
					error={passwordValidation.error}
					helperText={passwordValidation.helperText}
					name={"password"}
					size={"small"}
					variant={"standard"}
					type={"password"}
					value={credentialsForm.password}
					onChange={onStateChange}
					label="Password"
				/>

				<RoundedButton type={"submit"}>Get Started</RoundedButton>
			</InputForm>

			<div style={navigationTitle}>
				Don't have an Account
				<MuiLink
					sx={Link}
					onClick={() => {
						navigate("/sign-up")
					}}
				>
					SignUp
				</MuiLink>
			</div>
		</>
	)
}

export default Signin
