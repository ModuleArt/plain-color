import { FC, useState, useEffect } from 'react'
import { Stack } from '@/components/Stack'
import { Header } from '@/components/Header'
import { GithubLogo, CoinVertical, Globe, AppStoreLogo, CaretLeft } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { app } from '@tauri-apps/api'
import { Image } from '@/components/Image'

export const AboutPage: FC = () => {
  const navigate = useNavigate()
  const [version, setVersion] = useState('0')
  const projectUrl = 'https://moduleart.github.io/plaincolor'
  const githubUrl = 'https://github.com/ModuleArt/plain-color'
  const moreAppsUrl = 'https://moduleart.github.io/'
  const donateUrl = 'https://opencollective.com/moduleart'

  useEffect(() => {
    app.getVersion().then((v) => setVersion(v))
  }, [])

  const goBack = () => {
    navigate('/settings')
  }

  const openUrl = (url: string) => {
    open(url)
  }

  return (
    <Stack dir="vertical" gap="none" grow>
      <Header leftElement={<Button iconPre={CaretLeft} padding="small" onClick={goBack} nativeTooltip="Back" />}>
        <Text text="About" />
      </Header>
      <Stack dir="vertical" gap="none" grow>
        <Stack justify="center" align="center" grow>
          <Image src="/assets/imgs/icon.svg" width={120} />
        </Stack>
        <Stack dir="vertical" padding="medium">
          <Stack justify="between">
            <Text text="Version" tinted />
            <Text text={version} />
          </Stack>
          <Stack justify="between">
            <Text text="Author" tinted />
            <Text text="Eugene Volynko" />
          </Stack>
          <Stack justify="between">
            <Text text="Publisher" tinted />
            <Text text="ModuleArt" />
          </Stack>
        </Stack>

        <Stack dir="vertical" padding="medium">
          <Stack>
            <Button iconPre={Globe} label="Website" onClick={() => openUrl(projectUrl)} grow />
            <Button iconPre={CoinVertical} label="Donate" onClick={() => openUrl(donateUrl)} grow />
          </Stack>
          <Stack>
            <Button iconPre={GithubLogo} label="GitHub" onClick={() => openUrl(githubUrl)} grow />
            <Button iconPre={AppStoreLogo} label="More Apps" onClick={() => openUrl(moreAppsUrl)} grow />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
