import { useContext } from "react";
import { ChannelSocketContext } from "../../context";

import '../../styles/components/channel_components/Channel.css'

export function Channel() {
	const { channel_display } = useContext(ChannelSocketContext).ChannelSocketState;

	return (
		<div id={channel_display ? "channel-container-display" : "channel-container-none"}>

		</div>
	)
}