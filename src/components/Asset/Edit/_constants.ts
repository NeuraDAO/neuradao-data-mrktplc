import { FileInfo, Metadata, ServiceComputeOptions } from '@neuradao/ocean-lib'
import { secondsToString } from '@utils/ddo'
import * as Yup from 'yup'
import { ComputeEditForm, MetadataEditForm } from './_types'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  price: Yup.number().required('Required'),
  links: Yup.array<any[]>().nullable(),
  files: Yup.array<FileInfo[]>().nullable(),
  timeout: Yup.string().required('Required'),
  author: Yup.string().nullable(),
  dockerImage: Yup.string().nullable()
  // TODO: add validation for algorithm
})

export function getInitialValues(
  metadata: Metadata,
  timeout: number,
  price: string
): Partial<MetadataEditForm> {
  return {
    name: metadata?.name,
    description: metadata?.description,
    price,
    links: metadata?.links,
    files: '',
    timeout: secondsToString(timeout),
    author: metadata?.author
  }
}

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable(),
  publisherTrustedAlgorithmPublishers: Yup.array().nullable()
})

export interface MetadataAlgorithmContainer {
  entrypoint: string
  image: string
  tag: string
  checksum: string
}

export const algorithmContainerPresets: MetadataAlgorithmContainer[] = [
  {
    image: 'node',
    tag: 'latest',
    entrypoint: 'node $ALGO',
    checksum:
      'sha256:eee4c74962a855bc1694676cd5069460e545a8580e0e574b2c59eae4f40bd5bd' // TODO: how to get? Most likely needs to be fetched from DockerHub.
  },
  {
    image: 'python',
    tag: 'latest',
    entrypoint: 'python $ALGO',
    checksum:
      'sha256:607635763e54907fd75397fedfeb83890e62a0f9b54a1d99d27d748c5d269be4'
  },
  {
    image: 'anmu06/c2d_neuradao',
    tag: 'latest',
    entrypoint: 'python3.8 $ALGO',
    checksum:
      'sha256:a981ed6282271fc5492c382cd11d5045641880f738c05a855ed6de8d0eecea8f'
  },
  {
    entrypoint: 'python3.7 $ALGO',
    image: 'oceanprotocol/algo_dockers',
    tag: 'python-panda',
    checksum:
      'sha256:7fc268f502935d11ff50c54e3776dda76477648d5d83c2e3c4fdab744390ecf2'
  }
]

export function getComputeSettingsInitialValues({
  publisherTrustedAlgorithms,
  publisherTrustedAlgorithmPublishers
}: ServiceComputeOptions): ComputeEditForm {
  const allowAllPublishedAlgorithms = publisherTrustedAlgorithms === null
  const publisherTrustedAlgorithmsForForm = allowAllPublishedAlgorithms
    ? null
    : publisherTrustedAlgorithms.map((algo) => algo.did)

  return {
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms: publisherTrustedAlgorithmsForForm,
    publisherTrustedAlgorithmPublishers
  }
}
