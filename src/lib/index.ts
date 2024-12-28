import { IPlainlibComponentProps } from './types'

export const commonComponentClasses = (props: IPlainlibComponentProps<any>) => {
  return {
    'plainlib--grow': props.grow,
    [`plainlib--pointer-events-${props.pointerEvents}`]: props.pointerEvents,
    [`${props.className}`]: !!props.className,
  }
}
