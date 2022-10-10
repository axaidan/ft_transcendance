import { Setting } from "../componants/profile_componants/Setting";


const SETTINGS = 'settings'

type ReplaceProfileBodyProps = {
    mode: string;
}

function ReplaceProfileBodyPage( { mode }:ReplaceProfileBodyProps) {
    
    switch (mode) {
        case SETTINGS:
            <Setting />;
            break;
        default:
            break;
    }
}

export default ReplaceProfileBodyPage;