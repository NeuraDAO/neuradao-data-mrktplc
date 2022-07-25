import { useEffect, useState } from 'react'
import { NftFactory } from '@neuradao/ocean-lib'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'

function useNftFactory(): NftFactory {
  let { web3, chainId } = useWeb3()
  // TODO: use the chainId to get the correct factory
  // chainId = chainId || 4
  const [nftFactory, setNftFactory] = useState<NftFactory>()
  // console.log({ chainId })

  useEffect(() => {
    if (!web3 || !chainId) return
    const config = getOceanConfig(chainId)
    console.log({ chainId, config })
    const factory = new NftFactory(config?.erc721FactoryAddress, web3)
    console.log({ factory })
    setNftFactory(factory)
  }, [web3, chainId])

  return nftFactory
}

export default useNftFactory
