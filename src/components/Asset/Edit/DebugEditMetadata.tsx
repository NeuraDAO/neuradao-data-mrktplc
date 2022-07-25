import { Asset, Metadata, Service } from '@neuradao/ocean-lib'
import React, { ReactElement } from 'react'
import DebugOutput from '@shared/DebugOutput'
import { MetadataEditForm } from './_types'
import { mapTimeoutStringToSeconds } from '@utils/ddo'
import { sanitizeUrl } from '@utils/url'
import { getAlgorithmContainerPreset } from './_utils'

export default function DebugEditMetadata({
  values,
  asset
}: {
  values: Partial<MetadataEditForm>
  asset: Asset
}): ReactElement {
  const linksTransformed = values.links?.length &&
    values.links[0].valid && [sanitizeUrl(values.links[0].url)]

  const newMetadata: Metadata = {
    ...asset?.metadata,
    name: values.name,
    description: values.description,
    links: linksTransformed,
    author: values.author,
    algorithm: values.dockerImage
      ? {
          language: '',
          version: '0.1',
          container: {
            entrypoint: getAlgorithmContainerPreset(values.dockerImage)
              .entrypoint,
            image: getAlgorithmContainerPreset(values.dockerImage).image,
            tag: getAlgorithmContainerPreset(values.dockerImage).tag,
            checksum: getAlgorithmContainerPreset(values.dockerImage).checksum
          }
        }
      : asset?.metadata.algorithm
  }
  const updatedService: Service = {
    ...asset?.services[0],
    timeout: mapTimeoutStringToSeconds(values.timeout)
  }
  const updatedAsset: Asset = {
    ...asset,
    metadata: newMetadata,
    services: [updatedService]
  }

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Asset Values" output={updatedAsset} />
    </>
  )
}
