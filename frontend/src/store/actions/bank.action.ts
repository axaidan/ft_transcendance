import { BankActionType } from '../action-types'

interface BankDepositAction {
	type: BankActionType.DEPOSIT,
	payload: number
}

interface BankWithdrawAction {
	type: BankActionType.WITHDRAW,
	payload: number
}

interface BankBankruptAction {
	type: BankActionType.BANKRUPT
}

export type BankAction = BankDepositAction | BankWithdrawAction | BankBankruptAction;