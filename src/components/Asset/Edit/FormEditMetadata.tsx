import React, { ReactElement } from 'react'
import { Field, Form } from 'formik'
import Input, { InputProps } from '@shared/FormInput'
import FormActions from './FormActions'
import { useAsset } from '@context/Asset'
import { getFieldContent } from '@utils/form'

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
  isComputeDataset
}: {
  data: InputProps[]
  showPrice: boolean
  isComputeDataset: boolean
}): ReactElement {
  const { oceanConfig } = useAsset()
  console.log('[data]', data)

  // This component is handled by Formik so it's not rendered like a "normal" react component,
  // so handleTimeoutCustomOption is called only once.
  // https://github.com/oceanprotocol/market/pull/324#discussion_r561132310
  // if (data && values) handleTimeoutCustomOption(data, values)

  const timeoutOptionsArray = data.filter(
    (field) => field.name === 'timeout'
  )[0].options

  if (isComputeDataset && timeoutOptionsArray.includes('Forever')) {
    const foreverOptionIndex = timeoutOptionsArray.indexOf('Forever')
    timeoutOptionsArray.splice(foreverOptionIndex, 1)
  } else if (!isComputeDataset && !timeoutOptionsArray.includes('Forever')) {
    timeoutOptionsArray.push('Forever')
  }

  // TODO: need to add algorithm prop in editMetadata.json => data object
  const fields = data.map((field: InputProps) => {
    if (
      (!showPrice && field.name === 'price') ||
      field.name.indexOf('docker') !== -1
    ) {
      return null
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

  if (isComputeDataset) {
    // push the docker image options
    // fields.push(
    //   <>
    //     <Field
    //       {...getFieldContent('dockerImage', content.metadata.fields)}
    //       component={Input}
    //       name="metadata.dockerImage"
    //       options={dockerImageOptions}
    //     />
    //     {values.metadata.dockerImage === 'custom' && (
    //       <>
    //         <Field
    //           {...getFieldContent('dockerImageCustom', content.metadata.fields)}
    //           component={Input}
    //           name="metadata.dockerImageCustom"
    //         />
    //         <Field
    //           {...getFieldContent(
    //             'dockerImageCustomTag',
    //             content.metadata.fields
    //           )}
    //           component={Input}
    //           name="metadata.dockerImageCustomTag"
    //         />
    //         <Field
    //           {...getFieldContent(
    //             'dockerImageCustomEntrypoint',
    //             content.metadata.fields
    //           )}
    //           component={Input}
    //           name="metadata.dockerImageCustomEntrypoint"
    //         />
    //       </>
    //     )}
    //   </>
    // )
  }

  return (
    <Form>
      {fields}

      <FormActions />
    </Form>
  )
}
