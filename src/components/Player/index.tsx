import React, { FC, useCallback, useEffect } from "react"
import { getVideoById } from "api/youtube"
import { IYouTubeVideo } from "types/YouTube"
import { LinearProgress, Paper, Typography } from "@mui/material"
import YouTube from "elements/YouTube"
import { PaperSx } from "components/Player/style"

interface VideoValues {
	embedHTML: string;
	title: string;
	description: string;
}

const Player: FC<{ videoId: string }> = ({ videoId }) => {
	const [video, setVideo] = React.useState<VideoValues>({
		embedHTML: "",
		title: "",
		description: "",
	})

	const initialize = useCallback(async () => {
		const videoTemp: IYouTubeVideo = await getVideoById(videoId as string)
		setVideo({
			embedHTML: videoTemp.items[0].player.embedHtml,
			title: videoTemp.items[0].snippet.title,
			description: videoTemp.items[0].snippet.description,
		})
	}, [videoId])

	useEffect(() => {
		initialize().then(() => {
		})
	}, [initialize])

	return (
		<>
			{video.embedHTML ? (
				<Paper sx={PaperSx}>
					<YouTube embedHtml={video?.embedHTML} title={video?.title} />

					<Typography variant={"h5"} fontWeight={"600"}>
						{video?.title}
					</Typography>
					<Typography variant={"body1"}>{video.description}</Typography>
				</Paper>
			) : (
				<LinearProgress />
			)}

		</>
	)
}

export default React.memo(Player)