import { FileInfo } from '@oceanprotocol/lib'
export interface MetadataEditForm {
  name: string
  description: string
  timeout: string
  price?: string
  files: FileInfo[]
  links?: FileInfo[]
  author?: string
  dockerImage?: any
  tags?: string[]
}

export interface ComputeEditForm {
  allowAllPublishedAlgorithms: boolean
  publisherTrustedAlgorithms: string[]
  publisherTrustedAlgorithmPublishers: string[]
}
