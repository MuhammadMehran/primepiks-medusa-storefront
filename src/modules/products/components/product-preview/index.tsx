import { Text } from "@medusajs/ui"

import { ProductPreviewType } from "types/global"

import { retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { Button } from "@medusajs/ui"
import { ShoppingBag } from "@medusajs/icons"

export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
}: {
  productPreview: ProductPreviewType
  isFeatured?: boolean
  region: Region
}) {
  const pricedProduct = await retrievePricedProductById({
    id: productPreview.id,
    regionId: region.id,
  }).then((product) => product)

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
    region,
  })

  const trimString = (str: any, maxLength: number = 90): string => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "..."
    }
    return str
  }

  return (
    <div className="border p-3 bg-white/50 rounded-[32px] shadow">
      <LocalizedClientLink
        href={`/products/${productPreview.handle}`}
        className="group"
      >
        <div data-testid="product-wrapper">
          <Thumbnail
            thumbnail={productPreview.thumbnail}
            size="square"
            isFeatured={isFeatured}
          />
          <div className="flex txt-compact-medium mt-4 justify-between">
            <Text
              className="text-ui-fg-subtle text-lg"
              data-testid="product-title"
            >
              {productPreview.title}
            </Text>
            <div className="flex items-center gap-x-2 text-lg">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          <Text className="text-sm text-gray-500">
            {trimString(pricedProduct.description, 300)}
          </Text>

          <div className="flex justify-between  items-center py-4 ">
            <LocalizedClientLink
              href={`/products/${pricedProduct.handle}`}
              className={`w-3/4 mx-2`}
            >
              <div className="h-[42px] w-full px-4 py-2.5 rounded-[50px] border border-[#8bcef3] justify-center items-center gap-2.5 inline-flex">
                <div className="text-[#1e99f5] text-base font-semibold ">
                  More Info
                </div>
              </div>
            </LocalizedClientLink>
            <div className="inline-flex">
              <Button
                variant="secondary"
                className={` rounded-[50px] shadow px-6 py-2 bg-gradient-to-r from-[#8bcef3] to-[#1e99f5] text-white`}
              >
                <ShoppingBag />
              </Button>
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
