import { BankActionType } from "../action-types"
import { Dispatch } from "redux"
import { BankAction } from "../actions"


const depositMoney = (amout: number) => {
	return ( dispatch: Dispatch<BankAction> ) => {
		dispatch({
			type: BankActionType.DEPOSIT,
			payload: amout,
		})
	}
}

const withdrawMoney = (amout: number) => {
	return ( dispatch: Dispatch<BankAction> ) => {
		dispatch({
			type: BankActionType.WITHDRAW,
			payload: amout,
		})
	}
}

const bankruptMoney = () => {
	return ( dispatch: Dispatch<BankAction> ) => {
		dispatch({
			type: BankActionType.BANKRUPT,
		})
	}
}