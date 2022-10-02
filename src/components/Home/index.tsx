import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '@shared/AssetList'
import Button from '@shared/atoms/Button'
import Bookmarks from './Bookmarks'
import { generateBaseQuery, queryMetadata } from '@utils/aquarius'
import { Asset, LoggerInstance } from '@neuradao/ocean-lib'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './index.module.css'
import { useIsMounted } from '@hooks/useIsMounted'
import { useCancelToken } from '@hooks/useCancelToken'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../@types/aquarius/SearchQuery'
import PublishersWithMostSales from './PublishersWithMostSales'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { fetchNftOrders, updateOrders } from '@utils/subgraph'

function sortElements(items: Asset[], sorted: string[]) {
  items.sort(function (a, b) {
    return (
      sorted.indexOf(a.services[0].datatokenAddress.toLowerCase()) -
      sorted.indexOf(b.services[0].datatokenAddress.toLowerCase())
    )
  })
  return items
}

function SectionQueryResult({
  title,
  query,
  action,
  queryData
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
  queryData?: string[]
}) {
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<PagedAssets>()
  const [loading, setLoading] = useState<boolean>()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()
  console.log(result)

  useEffect(() => {
    if (!query) return

    async function init() {
      if (chainIds.length === 0) {
        const result: PagedAssets = {
          results: [],
          page: 0,
          totalPages: 0,
          totalResults: 0,
          aggregations: undefined
        }
        setResult(result)
        setLoading(false)
      } else {
        try {
          setLoading(true)
          let result = await queryMetadata(query, newCancelToken())
          result.results = await updateOrders(result.results)

          if (!isMounted()) return
          if (queryData && result?.totalResults > 0) {
            const sortedAssets = sortElements(result.results, queryData)
            const overflow = sortedAssets.length - 9
            sortedAssets.splice(sortedAssets.length - overflow, overflow)
            result.results = sortedAssets
          }
          setResult(result)
          setLoading(false)
        } catch (error) {
          LoggerInstance.error(error.message)
        }
      }
    }
    init()
  }, [chainIds.length, isMounted, newCancelToken, query, queryData])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>

      <AssetList
        assets={result?.results}
        showPagination={false}
        isLoading={loading || !query}
      />

      {action && action}
    </section>
  )
}

function getFilterTerm(
  filterField: string,
  value: string | number | boolean | number[] | string[]
): FilterTerm {
  const isArray = Array.isArray(value)
  return {
    [isArray ? 'terms' : 'term']: {
      [filterField]: value
    }
  }
}

function getPublishedAssets(
  accountId: string,
  chainIds: number[],
  type?: string,
  accesType?: string
): BaseQueryParams {
  if (!accountId) return

  const filters: FilterTerm[] = []

  filters.push(getFilterTerm('nft.owner', accountId.toLowerCase()))
  accesType !== undefined &&
    filters.push(getFilterTerm('services.type', accesType))
  type !== undefined && filters.push(getFilterTerm('metadata.type', type))

  const baseQueryParams = {
    chainIds,
    filters,
    sortOptions: {
      sortBy: SortTermOptions.Created
    } as SortOptions,
    aggs: {
      totalOrders: {
        sum: {
          field: SortTermOptions.Stats
        }
      }
    },
    ignorePurgatory: true,
    esPaginationOptions: {
      size: 9
    }
  } as BaseQueryParams

  return baseQueryParams
}

export default function HomePage(): ReactElement {
  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    const baseParams = {
      chainIds,
      esPaginationOptions: {
        size: 9
      },
      sortOptions: {
        sortBy: SortTermOptions.Created
      } as SortOptions
    } as BaseQueryParams
    setQueryLatest(
      generateBaseQuery(
        getPublishedAssets(
          '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
          chainIds
        )
      )
    )

    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 9
      },
      sortOptions: {
        sortBy: SortTermOptions.Stats
      } as SortOptions
    } as BaseQueryParams
    setQueryMostSales(generateBaseQuery(baseParamsSales))
  }, [chainIds])

  return (
    <>
      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      {/* <SectionQueryResult title="Most Sales" query={queryMostSales} /> */}

      <SectionQueryResult title="Recently Published" query={queryLatest} />

      <PublishersWithMostSales title="Publishers With Most Sales" />
    </>
  )
}
