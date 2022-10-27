let idValue = 1234;

export type LobbyId= number;
export default class Lobby {

    LobbyId: number;
    PlayersId: Array<number>;
    ViewersId: Array<number>;
    
    
    /**
     *  mettre un match aussi
     *  
     */

    constructor() {this.LobbyId= idValue++;
        this.PlayersId = new Array<number>();
        console.log(this.LobbyId);
    }

    /**
     *  ici je peux ecrire des fonctions
     */
}