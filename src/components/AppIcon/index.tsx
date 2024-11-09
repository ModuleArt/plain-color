import { FC, useEffect, useState } from 'react'
import './index.scss'
import { Stack } from '@/components/Stack'
import { Text } from '@/components/Text'
import { app } from '@tauri-apps/api'
import { IAppIconProps } from './props'
import { Button } from '@/components/Button'
import { GithubLogo, CoinVertical, Globe, AppStoreLogo } from '@phosphor-icons/react'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { open } from '@tauri-apps/plugin-shell'

export const AppIcon: FC<IAppIconProps> = ({ projectUrl, githubUrl, ...props }) => {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('0')
  const moreAppsUrl = 'https://moduleart.github.io/'
  const donateUrl = 'https://opencollective.com/moduleart'

  useEffect(() => {
    app.getName().then((n) => setName(n))
    app.getVersion().then((v) => setVersion(v))
  }, [])

  const openUrl = (url: string) => {
    open(url)
  }

  return (
    <Stack className={cn('app-icon', commonComponentClasses(props))} dir="vertical" gap="large" grow>
      <Stack dir="vertical" align="center" gap="none" grow>
        <img className="app-icon__icon" src="/assets/imgs/icon.svg" />
        <Stack dir="vertical" align="center">
          <Text text={`${name} v${version}`} />
          <Text text="by ModuleArt with ❤️" tinted />
          <Text text="Author: Eugene Volynko" tinted />
        </Stack>
      </Stack>
      <Stack dir="vertical" padding="medium">
        <Stack>
          <Button icon={Globe} label="Website" onClick={() => openUrl(projectUrl)} grow />
          <Button icon={CoinVertical} label="Donate" onClick={() => openUrl(donateUrl)} grow />
        </Stack>
        <Stack>
          <Button icon={GithubLogo} label="GitHub" onClick={() => openUrl(githubUrl)} grow />
          <Button icon={AppStoreLogo} label="More Apps" onClick={() => openUrl(moreAppsUrl)} grow />
        </Stack>
      </Stack>
    </Stack>
  )
}
