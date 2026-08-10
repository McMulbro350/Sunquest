import { useAppState } from '../context/AppStateContext'
import { useUVData } from '../lib/uvApi'
import SunTimer from '../components/SunTimer'

export default function Timer() {
  const { skinType } = useAppState()
  const { data, status } = useUVData()
  const uv = status === 'ready' && data ? data.current : data?.current ?? 0

  return (
    <div className="page">
      <h1 className="section-title">⏱ Sun Timer</h1>
      <SunTimer uv={uv} skinTypeId={skinType} />
    </div>
  )
}
