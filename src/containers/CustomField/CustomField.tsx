import { useCallback, useEffect, useState } from 'react'
import { TextInput } from '@contentstack/venus-components'
import ContentstackAppSdk from '@contentstack/app-sdk'
import '@contentstack/venus-components/build/main.css'

const CustomFieldExtension = () => {
  const [error, setError] = useState<any>(null)
  const [app, setApp] = useState({} as any)
  const [url, setUrl] = useState("")

  const initializeApp = useCallback(async () => {
    if (app) {
      const customField = await app?.location?.CustomField
      const entry = customField?.entry

      setUrl(entry.getData()?.custom)
      customField.frame.updateHeight(0)

      entry.onChange((data: any) => {
        const url = constructUrl(data)
        setUrl(url)
        console.log("Changing URL : ", url);
        customField.field.setData(url);
        entry.getField('url')?.setData(url)
      })
    }
  }, [app])

  const constructUrl = (data: any) => {
    const productName = data?.title ?? ''
    const formattedProductName = productName.split(' ').join('-').toLowerCase()
    const category = data?.category ?? ''
    return `/${category}/${formattedProductName}`
  }

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    if (typeof window !== 'undefined' && self === top) {
      setError("Error")
    } else {
      ContentstackAppSdk.init().then((appSdk) => {
        setApp(appSdk)
        let customField = appSdk?.location?.CustomField
        console.log("value" , customField?.entry?.getData()?.url, customField?.entry?.getData()?.custom);
        initializeApp()
      })
    }
  }, [initializeApp])

  return error ? (
    <h3>{error}</h3>
  ) : (
    <TextInput type="text" disabled value={url} />
  )
};

export default CustomFieldExtension;
