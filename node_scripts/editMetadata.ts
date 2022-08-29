// Import dependencies
import { Nft, ProviderInstance, getHash, Aquarius } from '@neuradao/ocean-lib'
import { SHA256 } from 'crypto-js'
import Web3 from 'web3'
import { web3Provider, oceanConfig } from './config'

// Create a web3 instance
const web3 = new Web3(web3Provider)

// Create Aquarius instance
const aquarius = new Aquarius(oceanConfig.metadataCacheUri)
const nft = new Nft(web3)
const providerUrl = oceanConfig.providerUri

// replace the did here
const did =
  'did:op:a419f07306d71f3357f8df74807d5d12bddd6bcd738eb0b461470c64859d6f0f'

// This function takes did as a parameter and updates the data NFT information
const setMetadata = async (did: string) => {
  const accounts = await web3.eth.getAccounts()
  const publisherAccount = accounts[0]

  // Fetch ddo from Aquarius
  const ddo = await aquarius.resolve(did)

  // update the ddo here
  ddo.metadata.name = 'Sample dataset v2'
  ddo.metadata.description =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam'
  ddo.metadata.tags = ['new tag1', 'new tag2']

  // providerResponse = await ProviderInstance.encrypt(ddo, providerUrl)
  const encryptedResponse = await ProviderInstance.encrypt(ddo, providerUrl)
  const metadataHash = getHash(JSON.stringify(ddo))

  // Update the data NFT metadata
  await nft.setMetadata(
    ddo.nftAddress,
    publisherAccount,
    0,
    providerUrl,
    '',
    '0x2',
    encryptedResponse,
    `0x${metadataHash}`
  )

  // Check if ddo is correctly udpated in Aquarius
  await aquarius.waitForAqua(ddo.id)

  console.log(`Resolved asset did [${ddo.id}]from aquarius.`)
  console.log(`Updated name: [${ddo.metadata.name}].`)
  console.log(`Updated description: [${ddo.metadata.description}].`)
  console.log(`Updated tags: [${ddo.metadata.tags}].`)
}

// Call setMetadata(...) function defined above
setMetadata(did)
  .then(() => {
    process.exit()
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
