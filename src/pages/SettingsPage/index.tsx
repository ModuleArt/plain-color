import { FC, useEffect, useState } from 'react'
import { Stack } from '@/components/Stack'
import { Header } from '@/components/Header'
import { CaretLeft, QuestionMark } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { Select } from '@/components/Select'
import { copyVariants, formatCopyText } from '@/utils/copyVariants.util'
import { useSettingsStore } from '@/store/settings.store'
import { getPlatform } from '@/utils/tauri.util'
import {
  checkMacosScreenRecordingPermission,
  requestMacosScreenRecordingPermission,
} from '@/utils/macosPermissions.util'

export const SettingsPage: FC = () => {
  const navigate = useNavigate()
  const settingsStore = useSettingsStore()
  const platform = getPlatform()
  const [isMacosPermissionGranted, setIsMacosPermissionGranted] = useState(false)

  const goHome = () => {
    navigate('/')
  }

  const goToAbout = () => {
    navigate('/about')
  }

  useEffect(() => {
    checkMacosScreenRecordingPermission().then((authorized) => {
      setIsMacosPermissionGranted(authorized)
    })
  }, [])

  const requestMacosPermission = () => {
    requestMacosScreenRecordingPermission().then()
  }

  const exampleColor = '3D061A'
  const exampleColorTransparent = '3D061AED'

  return (
    <Stack dir="vertical" gap="medium" grow>
      <Header
        leftElement={<Button iconPre={CaretLeft} variant="clear" onClick={goHome} nativeTooltip="Back" />}
        rightElement={
          <Button iconPre={QuestionMark} variant="clear" onClick={goToAbout} nativeTooltip="About the app" />
        }
      >
        <Text text="Settings" />
      </Header>
      <Stack dir="vertical" gap="large" grow padding="medium">
        <Stack dir="vertical">
          <Text text="Quick Copy" tinted />
          <Select
            options={copyVariants.map((copyVariant) => ({
              ...copyVariant,
              description: `${formatCopyText(exampleColor, copyVariant.id)}${
                copyVariant.supportsAlpha ? ` or ${formatCopyText(exampleColorTransparent, copyVariant.id)}` : ''
              }`,
            }))}
            value={settingsStore.quickCopyVariants}
            onChange={settingsStore.setQuickCopyVariants}
            multiple
          />
        </Stack>
        {platform === 'macos' && (
          <Stack dir="vertical" align="start">
            <Text text="Accessibility Permissions" tinted />
            {isMacosPermissionGranted ? (
              <Text text="Granted" />
            ) : (
              <Button label="Grant" padding="medium" onClick={requestMacosPermission} />
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
