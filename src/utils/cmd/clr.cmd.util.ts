import { invokeCmd } from '.'

export const invokeLoadClrFile = async () => {
  return invokeCmd<string>('load_clr_file')
}
