
import { PropsWithChildren, useContext } from "react";

import { ChatSocketContext, IChannel } from "../context";

import "../styles/pages/Channels.css"


export function ChannelFromCreate() {

	return (
		<div id="channel-page-form-create">c</div>
	)
}



export function ChannelFromJoin() {

	return (
		<div id="channel-page-form-join">b</div>
	)
}


// export interface ChannelJoinLogicProps extends PropsWithChildren { chan: IChannel };
// export const ChannelJoinLogic: React.FunctionComponent<ChannelJoinLogicProps> = ({ children, chan }) => {

// 	// ICI FAIRE LA LOGIC POUR JOIN UN CHANNEL


// 	return (
// 		<div onClick={() => { console.log(chan.name) }}>
// 			{ children }
// 		</div>
// 	);
// }

export interface ChannelPublicProps { chan: IChannel }
export function ChannelPublic({ chan }:ChannelPublicProps ) {

	return (
		<div className="channel-pp">
			<h2>{chan.name}</h2>
			<button>JOIN</button>
		</div>
	)
}

export function ChannelPublicList() {

	const { allChannels } = useContext(ChatSocketContext).ChatSocketState;

	return (
		<div>
			<h1>JOIN PUBLIC CHANNELS:</h1>
			<div id="channel-public-list">
			{ allChannels.map( (chan, index) => {
				return (
					// <ChannelJoinLogic chan={chan} key={index}> 
						<ChannelPublic chan={chan} key={index} />
					// </ChannelJoinLogic>
				)
			})

			}
			</div>
		</div>
	)
}


export function Channel() {
	return (
		<div id="channel-page">
			<div id="channel-page-froms">
				<ChannelFromCreate />
				<ChannelFromJoin />
			</div>
			<ChannelPublicList />
		</div>
	)
}