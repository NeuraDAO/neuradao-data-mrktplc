import { algorithmContainerPresets } from './_constants'

export function getAlgorithmContainerPreset(
  dockerImage: string
): MetadataAlgorithmContainer {
  if (dockerImage === '') return

  const preset = algorithmContainerPresets.find(
    (preset) => `${preset.image}:${preset.tag}` === dockerImage
  )

  //   console.log(['dockerImage'], dockerImage)
  //   console.log(['preset', preset])
  return preset
}
