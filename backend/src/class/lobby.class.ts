let idValue = 1234;

export type LobbyId= number;
export default class Lobby {

    LobbyId: number;
    PlayersId: Array<number>;
    ViewersId: Array<number>;
    
    PalettePlayer1: number;
    PalettePlayer2: number;

	mode: number;
    /**
     *  mettre un match aussi
     *  
     */

    constructor() {this.LobbyId= idValue++;
        this.PlayersId = new Array<number>();
        this.ViewersId = new Array<number>();
    }

    /**
     *  ici je peux ecrire des fonctions
     */
}