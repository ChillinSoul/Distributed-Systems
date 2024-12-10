export type SignupInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type LoginInput = {
  email: string;
  password: string;
}

export type FormulaInput = {
  formula: string;
  beginAt: string | undefined;
	endAt: string | undefined;
	period: string | undefined;
}

export type ErrorMessage = {
  message: string;
  status: number;
}
