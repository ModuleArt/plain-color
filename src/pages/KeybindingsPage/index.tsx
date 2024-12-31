import { FC } from 'react'
import { Stack } from '@/components/Stack'
import { Header } from '@/components/Header'
import { CaretLeft, Eyedropper } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { Icon } from '@/components/Icon'

export const KeybindingsPage: FC = () => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate('/settings')
  }

  return (
    <Stack dir="vertical" gap="large" grow>
      <Header leftElement={<Button iconPre={CaretLeft} padding="small" onClick={goBack} nativeTooltip="Back" />}>
        <Text text="Key Bindings" />
      </Header>
      <Stack dir="vertical" gap="extra-large" grow padding="medium">
        <Stack dir="vertical" gap="large">
          <Stack align="center">
            <Icon icon={Eyedropper} />
            <Text text="Picker" />
          </Stack>
          <Stack dir="vertical" gap="extra-small">
            <Text text="Control zoom level with + and - keys" size="small" tinted />
            <Text text="Hold Shift to pick multiple colors in a row" size="small" tinted />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
