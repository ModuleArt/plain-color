import { invokeCmd } from '.'

export const invokeFetchPreview = async (args: { size: number }) => {
  return invokeCmd<boolean>('fetch_preview', args)
}
