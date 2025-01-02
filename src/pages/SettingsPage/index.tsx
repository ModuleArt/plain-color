import { FC, useEffect, useState } from 'react'
import { Stack } from '@/components/Stack'
import { Header } from '@/components/Header'
import { CaretLeft, QuestionMark, Keyboard } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { Select } from '@/components/Select'
import { copyVariants, formatCopyText } from '@/utils/copyVariants.util'
import { EColorProfile, useSettingsStore } from '@/store/settings.store'
import { getPlatform } from '@/utils/tauri.util'
import {
  invokeRequestMacosScreenRecordingPermission,
  invokeOpenMacosScreenRecordingSettings,
  invokeCheckMacosScreenRecordingPermission,
} from '@/utils/cmd/macosPermissions.cmd.util'
import { invokeSetPickerColorProfile } from '@/utils/cmd/picker.cmd.util'

export const SettingsPage: FC = () => {
  const navigate = useNavigate()
  const settingsStore = useSettingsStore()
  const platform = getPlatform()
  const [isMacosPermissionStatusLoading, setIsMacosPermissionStatusLoading] = useState(true)
  const [isMacosPermissionGranted, setIsMacosPermissionGranted] = useState(false)

  const goBack = () => {
    navigate('/')
  }

  const goToAbout = () => {
    navigate('/about')
  }

  const goToKeybindings = () => {
    navigate('/keybindings')
  }

  useEffect(() => {
    invokeCheckMacosScreenRecordingPermission().then((authorized) => {
      setIsMacosPermissionGranted(authorized)
      setIsMacosPermissionStatusLoading(false)
    })
  }, [])

  const requestMacosPermission = () => {
    invokeRequestMacosScreenRecordingPermission()
    invokeOpenMacosScreenRecordingSettings()
  }

  const colorProfiles = [
    { id: EColorProfile.SRGB, label: 'sRGB (Default)' },
    { id: EColorProfile.SYSTEM, label: 'System' },
  ]

  const exampleColor = '3D061A'
  const exampleColorTransparent = '3D061AED'

  useEffect(() => {
    invokeSetPickerColorProfile({ profile: settingsStore.pickerColorProfile })
  }, [settingsStore.pickerColorProfile])

  return (
    <Stack dir="vertical" gap="large" grow>
      <Header
        leftElement={<Button iconPre={CaretLeft} padding="small" onClick={goBack} nativeTooltip="Back" />}
        rightElement={
          <Button iconPre={QuestionMark} padding="small" onClick={goToAbout} nativeTooltip="About the app" />
        }
      >
        <Text text="Settings" />
      </Header>
      <Stack dir="vertical" gap="extra-large" grow padding="medium">
        <Stack dir="vertical" gap="extra-small">
          <Stack dir="vertical">
            <Text text="Primary Copy Format" />
            <Text text="Choose which copy color format will be used by default" size="small" tinted />
          </Stack>
          <Select
            options={copyVariants.map((copyVariant) => ({
              ...copyVariant,
              description: `${formatCopyText(exampleColor, copyVariant.id)}${
                copyVariant.supportsAlpha ? ` or ${formatCopyText(exampleColorTransparent, copyVariant.id)}` : ''
              }`,
            }))}
            value={[settingsStore.defaultCopyVariant]}
            onChange={(options) => settingsStore.setDefaultCopyVariant(options[0])}
          />
        </Stack>
        <Stack dir="vertical" gap="extra-small">
          <Stack dir="vertical">
            <Text text="Quick Copy" />
            <Text text="Choose which copy color formats are shown directly on the color card" size="small" tinted />
          </Stack>
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
        <Stack dir="vertical" gap="extra-small">
          <Stack dir="vertical">
            <Text text="Picker Color Profile" />
          </Stack>
          <Select
            options={colorProfiles}
            value={[settingsStore.pickerColorProfile]}
            onChange={(options) => settingsStore.setPickerColorProfile(options[0])}
          />
        </Stack>
        {platform === 'macos' && !isMacosPermissionStatusLoading && (
          <Stack dir="vertical" gap="extra-small" align="start">
            <Stack dir="vertical" align="start">
              <Text text="Screen Recording Permission" />
              <Text
                text="This permission is required to allow the magnifying glass to capture the screen"
                size="small"
                tinted
              />
            </Stack>
            {isMacosPermissionGranted ? (
              <Text text="Granted" />
            ) : (
              <Button label="Open System Settings" padding="medium" onClick={requestMacosPermission} />
            )}
          </Stack>
        )}
        <Stack dir="vertical" align="start">
          <Button iconPre={Keyboard} label="Key Bindings" padding="medium" onClick={goToKeybindings} />
        </Stack>
      </Stack>
    </Stack>
  )
}
