import React from 'react'
import { allowDynamicPricing, allowFixedPricing } from '../../../app.config.js'
import { FormPublishData, PublishFeedback, StepContent } from './_types'
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
    price: 0,
    type: allowFixedPricing === 'true' ? 'fixed' : 'free',
    amountDataToken: 1000,
    amountOcean: 100,
    weightOnOcean: '5', // 50% on OCEAN
    weightOnDataToken: '5', // 50% on datatoken
    swapFee: 0.1, // in %
    freeAgreement: false
  }
}

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

export const initialPublishFeedback: PublishFeedback = contentFeedback
