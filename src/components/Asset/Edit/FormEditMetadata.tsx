import React, { ReactElement } from 'react'
import { Field, Form, useFormikContext } from 'formik'
import Input, { InputProps } from '@shared/FormInput'
import FormActions from './FormActions'
import { useAsset } from '@context/Asset'
import { algorithmContainerPresets } from './_constants'

export function checkIfTimeoutInPredefinedValues(
  timeout: string,
  timeoutOptions: string[]
): boolean {
  if (timeoutOptions.indexOf(timeout) > -1) {
    return true
  }
  return false
}

export default function FormEditMetadata({
  data,
  showPrice,
  isComputeDataset,
  isAlgorithm
}: {
  data: InputProps[]
  showPrice: boolean
  isComputeDataset: boolean
  isAlgorithm: boolean
}): ReactElement {
  const { oceanConfig } = useAsset()
  // console.log('[data]', data)

  // This component is handled by Formik so it's not rendered like a "normal" react component,
  // so handleTimeoutCustomOption is called only once.
  // https://github.com/oceanprotocol/market/pull/324#discussion_r561132310
  // if (data && values) handleTimeoutCustomOption(data, values)
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  const timeoutOptionsArray = data.filter(
    (field) => field.name === 'timeout'
  )[0].options

  if (isComputeDataset && timeoutOptionsArray.includes('Forever')) {
    const foreverOptionIndex = timeoutOptionsArray.indexOf('Forever')
    timeoutOptionsArray.splice(foreverOptionIndex, 1)
  } else if (!isComputeDataset && !timeoutOptionsArray.includes('Forever')) {
    timeoutOptionsArray.push('Forever')
  }

  const dockerImageOptions: BoxSelectionOption[] =
    algorithmContainerPresets.map((preset) => ({
      name: `${preset.image}:${preset.tag}`,
      title: `${preset.image}:${preset.tag}`,
      checked: values.dockerImage === `${preset.image}:${preset.tag}`
    }))

  // TODO: need to add algorithm prop in editMetadata.json => data object
  const fields = data.map((field: InputProps) => {
    if (
      (!showPrice && field.name === 'price') ||
      (field.name.indexOf('docker') !== -1 && !isAlgorithm)
    ) {
      return null
    } else if (field.name.indexOf('docker') !== -1 && isAlgorithm) {
      return (
        <Field
          key={field.name}
          {...field}
          component={Input}
          options={dockerImageOptions}
        />
      )
    } else {
      return (
        <Field
          key={field.name}
          options={
            field.name === 'timeout' && isComputeDataset === true
              ? timeoutOptionsArray
              : field.options
          }
          {...field}
          component={Input}
          prefix={field.name === 'price' && oceanConfig?.oceanTokenSymbol}
        />
      )
    }
  })

  return (
    <Form>
      {fields}

      <FormActions />
    </Form>
  )
}
