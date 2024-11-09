import { FC } from 'react'
import { Stack } from '@/components/Stack'
import { Header } from '@/components/Header'
import { CaretLeft } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { AppIcon } from '@/components/AppIcon'

export const AboutPage: FC = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  return (
    <Stack dir="vertical" gap="none" grow>
      <Header leftElement={<Button icon={CaretLeft} variant="clear" onClick={goHome} />} />
      <AppIcon
        projectUrl="https://moduleart.github.io/plain-color"
        githubUrl="https://github.com/ModuleArt/plain-color"
        grow
      />
    </Stack>
  )
}
