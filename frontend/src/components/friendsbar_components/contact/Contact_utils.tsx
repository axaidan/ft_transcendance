export enum EStatus {
	ONLINE,
	ABSENT,
	INQUEUE,
	INGAME,
	OFFLINE
}

export const colorStatus = (mode: number, cible: string, notifed: boolean) => {
	switch (cible) {
		case "status":
			switch (mode) {
				case EStatus.ONLINE:
					return ('contact-color-online');
				case EStatus.ABSENT:
					return ('contact-color-occuped');
				case EStatus.INGAME:
					return ('contact-color-ongame');
				case EStatus.INQUEUE:
					return ('contact-color-ongame');
				case EStatus.OFFLINE:
					return ('contact-color-offline');
			}
		case "username":
			if (notifed)
				return ('contact-color-notified');
			switch (mode) {
				case EStatus.OFFLINE:
					return ('contact-color-offline');
				default:
					return ('contact-color-username');
			}
		case "border":
			return (mode === EStatus.OFFLINE ?
				'contact-color-offline' : 'contact-color-online');
	}
	return ("")
}