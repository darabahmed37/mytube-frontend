interface IYTImage {
	url: string
	width: number
	height: number
}

export interface IThumbnails {
	default: IYTImage
	medium: IYTImage
	high: IYTImage
	standard: IYTImage
	maxres: IYTImage
}

export interface IYouTubePlayLists {
	items: {
		id: string
		snippet: {
			title: string
			thumbnails: IThumbnails
			description: string
		}
	}[]
}

export interface IYouTubePlayListItems {
	items: {
		id: string
		snippet: {
			title: string
			description: string
			thumbnails: IThumbnails
			resourceId: {
				videoId: string
			}
		}

	}[]
}

export interface IYouTubeVideo {
	items: [
		{
			id: string
			snippet: {
				title: string
				description: string
				thumbnails: IThumbnails
				tags: string[]
				categoryId: string
			}
			player: {
				embedHtml: string
			}
		}
	]
}


export interface IFrameProps {
	allow: string
	allowFullScreen: string
	frameBorder: string
	height: string
	src: string
	width: string
}