import { FC } from 'react'
import { Stack } from '@/components/Stack'
import { Header } from '@/components/Header'
import { CaretLeft, Eyedropper, KeyReturn } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { Icon } from '@/components/Icon'
import { Scroller } from '@/components/Scroller'

export const KeybindingsPage: FC = () => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate('/settings')
  }

  return (
    <Stack dir="vertical" gap="none" grow>
      <Header extraPaddingRight>
        <Stack align="center" grow>
          <Button iconPre={CaretLeft} padding="small" onClick={goBack} nativeTooltip="Back" />
          <Text text="Key Bindings" grow align="center" />
        </Stack>
      </Header>
      <Scroller extraPaddingTop>
        <Stack dir="vertical" gap="extra-large" padding="medium">
          <Stack dir="vertical" gap="large">
            <Stack align="center">
              <Icon icon={KeyReturn} />
              <Text text="Global Shortcuts" />
            </Stack>
            <Stack dir="vertical" gap="extra-small">
              <Text text="⇧⌘P - Open PlainColor" size="small" tinted />
              <Text text="⌥⌘P - Open picker" size="small" tinted />
            </Stack>
          </Stack>
          <Stack dir="vertical" gap="large">
            <Stack align="center">
              <Icon icon={Eyedropper} />
              <Text text="Picker" />
            </Stack>
            <Stack dir="vertical" gap="extra-small">
              <Text text="Control zoom level with + and - keys" size="small" tinted />
              <Text text="Hold Shift to pick multiple colors in a row" size="small" tinted />
              <Text text="Press C to pick and instantly copy the color" size="small" tinted />
            </Stack>
          </Stack>
        </Stack>
      </Scroller>
    </Stack>
  )
}
