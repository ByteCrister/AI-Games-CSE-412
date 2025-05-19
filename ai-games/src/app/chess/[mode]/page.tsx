import ChessGame from '@/components/chess/ChessGame'
import { GameMode } from '@/components/chess/types'

const Page = async ({ params }: { params: Promise<{ mode: string }> }) => {
  const { mode } = await params
  return (
    <ChessGame mode={mode as GameMode} />
  )
}

export default Page