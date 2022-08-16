import React, { FC } from "react"
import { Card, CardContent, CardMedia, Typography } from "@mui/material"
import { CardChildMaxWidth, CardStyles } from "components/VideoCard/style"
import { VideoCardProps } from "types/ComponentProps"



const VideoCard: FC<VideoCardProps> = ({ title, description, thumbnails }) => {
	return (
		<Card sx={CardStyles}>
			<CardMedia component={"img"} image={thumbnails.high.url} alt={"Video Logo"} sx={CardChildMaxWidth} />

			<CardContent sx={CardChildMaxWidth}>
				<Typography variant={"h6"} fontWeight={800} mb={2}>
					{title}
				</Typography>
				<Typography variant={"subtitle2"}>
					{description.length > 100 ? description.substring(0, 100) + "..." : description}
				</Typography>
			</CardContent>
		</Card>
	)
}

export default VideoCard
