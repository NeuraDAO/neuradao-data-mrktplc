import React from 'react'
import { allowFixedPricing } from '../../../app.config.js'
import {
  FormPublishData,
  MetadataAlgorithmContainer,
  PublishFeedback,
  StepContent
} from './_types'
import content from '../../../content/publish/form.json'
import PricingFields from './Pricing'
import MetadataFields from './Metadata'
import ServicesFields from './Services'
import Preview from './Preview'
import Submission from './Submission'
import { ServiceComputeOptions } from '@neuradao/ocean-lib'
import contentFeedback from '../../../content/publish/feedback.json'

export const wizardSteps: StepContent[] = [
  {
    step: 1,
    title: content.metadata.title,
    component: <MetadataFields />
  },
  {
    step: 2,
    title: content.services.title,
    component: <ServicesFields />
  },
  {
    step: 3,
    title: content.pricing.title,
    component: <PricingFields />
  },
  {
    step: 4,
    title: content.preview.title,
    component: <Preview />
  },
  {
    step: 5,
    title: content.submission.title,
    component: <Submission />
  }
]

const computeOptions: ServiceComputeOptions = {
  allowRawAlgorithm: false,
  allowNetworkAccess: true,
  publisherTrustedAlgorithmPublishers: [],
  publisherTrustedAlgorithms: []
}

export const initialValues: FormPublishData = {
  user: {
    stepCurrent: 1,
    chainId: 1,
    accountId: ''
  },
  metadata: {
    nft: { name: '', symbol: '', description: '', image_data: '' },
    transferable: true,
    type: 'dataset',
    name: '',
    author: '',
    description: '',
    tags: '',
    termsAndConditions: false,
    dockerImage: '',
    dockerImageCustom: '',
    dockerImageCustomTag: '',
    dockerImageCustomEntrypoint: ''
  },
  services: [
    {
      files: [{ url: '' }],
      links: [{ url: '' }],
      dataTokenOptions: { name: '', symbol: '' },
      timeout: '',
      access: 'access',
      providerUrl: {
        url: 'https://provider.mainnet.oceanprotocol.com',
        valid: true,
        custom: false
      },
      computeOptions
    }
  ],
  pricing: {
    baseToken: { address: '', name: '', symbol: 'OCEAN', decimals: 18 },
    price: 0,
    type: allowFixedPricing === 'true' ? 'fixed' : 'free',
    freeAgreement: false
  }
}

export const algorithmContainerPresets: MetadataAlgorithmContainer[] = [
  {
    image: 'node',
    tag: '18.6.0', // TODO: Put this back to latest once merging the PR that fetches the container digest from docker hub via dockerhub-proxy
    entrypoint: 'node $ALGO',
    checksum:
      'sha256:c60726646352202d95de70d9e8393c15f382f8c6074afc5748b7e570ccd5995f'
  },
  {
    image: 'python',
    tag: '3.10.5', // TODO: Put this back to latest once merging the PR that fetches the container digest from docker hub via dockerhub-proxy
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

export const initialPublishFeedback: PublishFeedback = contentFeedback
