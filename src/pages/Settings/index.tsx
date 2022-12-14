import React, { ChangeEvent, FC, FormEvent, useContext, useEffect } from "react";
import {
	Alert,
	AlertColor,
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Slide,
	Snackbar,
} from "@mui/material";
import {
	DeleteButton,
	DeleteForm,
	Form,
	IncreaseTime,
	Input,
	Item,
	ItemHeader,
	Playlist,
	PlaylistBox,
	SettingItems,
	SettingsContainer,
} from "pages/Settings/emotion";
import { Body1, H1, H3 } from "elements/Typography";
import { IYouTubePlayListItems } from "types/YouTube";
import {
	changePasswordAction,
	deleteUserAction,
	getAllPlayListsAction,
	increaseTimeAction,
	setUserPlaylistAction,
} from "pages/Settings/service";
import { IUserContext, UserContext } from "context/UserContext";
import { initUser } from "api/profile";
import { getTimerAction } from "pages/PlayerScreen/services";

const Settings: FC = () => {
	const [playlists, setPlaylists] = React.useState<IYouTubePlayListItems>();
	const [playlistDisabled, setPlaylistDisabled] = React.useState(true);
	const [selectedPlaylist, setSelectedPlaylist] = React.useState<string | undefined>();
	const [buttonDisabled, setButtonDisabled] = React.useState(true);
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("");
	const [severity, setSeverity] = React.useState<AlertColor>("success");
	const [deleteButtonDisabled, setDeleteButtonDisabled] = React.useState(true);
	const [increaseTimeDisabled, setSetIncreaseTimeDisabled] = React.useState(true);
	const [passwordForm, setPasswordForm] = React.useState<{
		password: string;
		passwordConfirm: string;
	}>({
		password: "",
		passwordConfirm: "",
	});
	const { user, setUser } = useContext(UserContext) as IUserContext;

	function onPasswordChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setPasswordForm({
			...passwordForm,
			[event.target.name]: event.target.value,
		});
	}

	useEffect(() => {
		if (passwordForm.password === passwordForm.passwordConfirm) {
			if (passwordForm.password.length > 6) {
				setButtonDisabled(false);
				return;
			}
		}
		setButtonDisabled(true);
	}, [passwordForm]);

	function handleChange(e: SelectChangeEvent) {
		if (user) {
			setUserPlaylistAction(e.target.value).then(() => {
				setSelectedPlaylist(e.target.value);
				initUser().then((r) => {
					setUser(r.data.user);
				});
			});
		}
	}

	function submitPasswordForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		changePasswordAction(passwordForm.password).then(() => {
			setPasswordForm({
				password: "",
				passwordConfirm: "",
			});
			setSnackbarOpen(true);
			setSnackbarMessage("Password changed");
		});
	}

	useEffect(() => {
		if (user) {
			getAllPlayListsAction().then((data) => {
				setPlaylists(data);
				setSelectedPlaylist(user?.playlist);
				setPlaylistDisabled(false);
				getTimerAction().then((data) => {
					console.log(data);
					setSetIncreaseTimeDisabled(data.availed_time);
				});
			});
		}
	}, [user]);

	function closeSnackbar() {
		setSnackbarOpen(false);
		setSnackbarMessage("");
	}

	function increaseTimeOnClick() {
		increaseTimeAction()
			.then(() => {
				setSnackbarOpen(true);
				setSnackbarMessage("Time increased");
				setSetIncreaseTimeDisabled(true);
			})
			.catch(() => {
				setSnackbarOpen(true);
				setSnackbarMessage("Time not increased");
				setSeverity("error");
			});
	}

	return (
		<SettingsContainer>
			<H1>Settings</H1>
			<SettingItems>
				<Item>
					<ItemHeader>
						<H3>Your Playlist</H3>
						<Body1>
							<span>Warning!</span> If changed your YouTube playlist you will lose your data
						</Body1>
					</ItemHeader>
					<Playlist>
						<span>Select Playlist</span>
						<PlaylistBox>
							{playlists ? (
								<FormControl fullWidth disabled={playlistDisabled}>
									<InputLabel id="playlist-select-label">Playlist</InputLabel>
									<Select
										labelId="playlist-select-label"
										id="playlist-simple-select"
										value={selectedPlaylist}
										label="Playlist"
										onChange={handleChange}
									>
										{playlists.items.map((list, index) => (
											<MenuItem key={index} value={list.id}>
												{list.snippet.title}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							) : (
								<CircularProgress />
							)}
						</PlaylistBox>
					</Playlist>
				</Item>

				<Item>
					<ItemHeader>
						<H3>Change Password</H3>
					</ItemHeader>
					<Form onSubmit={submitPasswordForm}>
						<FormControl>
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input
								id={"password"}
								onChange={onPasswordChange}
								value={passwordForm.password}
								name={"password"}
								type="password"
								autoComplete="current-password"
							/>

							<FormHelperText>Password must be 7 or more figures</FormHelperText>
						</FormControl>
						<FormControl>
							<InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
							<Input
								id={"confirm-password"}
								onChange={onPasswordChange}
								value={passwordForm.passwordConfirm}
								name={"passwordConfirm"}
								type="password"
								autoComplete="current-password"
							/>

							<FormHelperText>Type Same Password here </FormHelperText>
						</FormControl>
						<Button disabled={buttonDisabled} type={"submit"} variant={"contained"}>
							Change
						</Button>
					</Form>
				</Item>
				<Item>
					<ItemHeader>
						<H3>Delete User</H3>
						<Body1>
							<span>Warning!</span> You are about to delete account
						</Body1>
					</ItemHeader>
					<DeleteForm>
						<FormControlLabel
							control={
								<Checkbox
									checked={!deleteButtonDisabled}
									onChange={(e) => {
										setDeleteButtonDisabled(!e.target.checked);
									}}
									color={"error"}
								/>
							}
							label="I confirm that I will delete account"
						/>
						<DeleteButton onClick={deleteUserAction} disabled={deleteButtonDisabled}>
							Delete Account
						</DeleteButton>
					</DeleteForm>
				</Item>

				<Item>
					<ItemHeader>
						<H3>Add 2 more hours</H3>
						<Body1>
							<span>Warning!</span> Dear user you are about to add 2 more hours to your account{" "}
							<strong>for today</strong>
						</Body1>
						<IncreaseTime disabled={increaseTimeDisabled} onClick={increaseTimeOnClick}>
							Yes! I want to waste 2 more hours
						</IncreaseTime>
						{increaseTimeDisabled ? <Body1>You can't increase time</Body1> : ""}
					</ItemHeader>
				</Item>
			</SettingItems>
			<Snackbar
				open={snackbarOpen}
				TransitionComponent={Slide}
				onClose={closeSnackbar}
				autoHideDuration={2000}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
			>
				<Alert severity={severity} variant="filled">
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</SettingsContainer>
	);
};

export default Settings;
