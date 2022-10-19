import { colorStatus } from ".";

type ContactStatusProps = { mode: number };
export function ContactStatus({ mode }: ContactStatusProps) {
	const statusTab: string[] = ['online', 'absent', 'inQueue', 'inGame', 'offline'];
	return (
		<div id={colorStatus(mode, "status", false)} className="contact-status">
			<div id="status-bulle">◉</div>
			{statusTab[mode]}
		</div>
	)
}